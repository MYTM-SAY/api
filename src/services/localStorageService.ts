import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { Readable } from 'stream'
import crypto from 'crypto'
import { StorageService } from '../interfaces/storageService.interface'
import { Buffer } from 'buffer'

const copyFile = promisify(fs.copyFile)
const mkdir = promisify(fs.mkdir)
const unlink = promisify(fs.unlink)

export class LocalStorageService implements StorageService {
  private storagePath: string

  private baseUrl: string

  constructor() {
    this.storagePath =
      process.env.LOCAL_STORAGE_PATH || path.join(process.cwd(), 'uploads')
    this.baseUrl =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`

    // Ensure storage directory exists
    this.ensureStorageDirectory()
  }

  private async ensureStorageDirectory(): Promise<void> {
    try {
      // Create base uploads directory if it doesn't exist
      if (!fs.existsSync(this.storagePath)) {
        await mkdir(this.storagePath, { recursive: true })
      }

      // Create subdirectories for different file types
      const directories = ['uploads', 'videos', 'documents', 'images']
      for (const dir of directories) {
        const dirPath = path.join(this.storagePath, dir)
        if (!fs.existsSync(dirPath)) {
          await mkdir(dirPath, { recursive: true })
        }
      }
    } catch (error) {
      console.error('Error creating storage directories:', error)
      throw new Error('Failed to create storage directories')
    }
  }

  /**
   * Upload a file from buffer to local storage
   * @param buffer File buffer
   * @param fileName Destination file name
   * @param contentType MIME type of the file
   * @returns URL of the uploaded file
   */
  async uploadBuffer(
    buffer: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    try {
      // Determine folder based on content type
      let folder = 'uploads'
      if (contentType.startsWith('image/')) folder = 'images'
      else if (contentType.startsWith('video/')) folder = 'videos'
      else if (contentType.startsWith('application/')) folder = 'documents'

      // Generate a unique filename to avoid collisions
      const name = fileName.replace(/\s+/g, '-')
      const uniqueFileName = `${Date.now()}-${name}`
      const filePath = path.join(this.storagePath, folder, uniqueFileName)
      console.log({
        filePath,
      })

      // Write buffer to file
      // await fs.promises.writeFile(filePath, buffer)

      // Return public accessible URL
      return `${this.baseUrl}/api/v1/files/${folder}/${uniqueFileName}`
    } catch (error) {
      console.error('Error uploading file to local storage:', error)
      throw new Error(
        `Failed to upload file to local storage: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Upload a large file to local storage
   * @param filePath Path to the file on disk
   * @param fileName Destination file name
   * @param contentType MIME type of the file
   * @returns URL of the uploaded file
   */
  async uploadLargeFile(
    filePath: string,
    fileName: string,
    contentType: string,
    duration?: number,
  ): Promise<string> {
    try {
      // Determine folder based on content type
      let folder = 'uploads'
      if (contentType.startsWith('image/')) folder = 'images'
      else if (contentType.startsWith('video/')) folder = 'videos'
      else if (contentType.startsWith('application/')) folder = 'documents'

      // Generate a unique filename to avoid collisions
      const uniqueFileName = `${Date.now()}-${fileName}-${duration ? duration : ''}`
      const destinationPath = path.join(
        this.storagePath,
        folder,
        uniqueFileName,
      )

      // Copy the file to the destination
      await copyFile(filePath, destinationPath)

      // Return public accessible URL
      return `${this.baseUrl}/api/v1/files/${folder}/${uniqueFileName}`
    } catch (error) {
      console.error('Error uploading large file to local storage:', error)
      throw new Error(
        `Failed to upload large file to local storage: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Get a file from local storage
   * @param key File path relative to storage directory
   * @returns Readable stream of the file
   */
  async getFile(key: string): Promise<Readable> {
    try {
      const filePath = path.join(this.storagePath, key)

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${key}`)
      }

      const stream = fs.createReadStream(filePath)
      return stream
    } catch (error) {
      console.error('Error getting file from local storage:', error)
      throw new Error(
        `Failed to get file from local storage: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Delete a file from local storage
   * @param key File path relative to storage directory
   * @returns Success indicator
   */
  async deleteFile(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.storagePath, key)

      if (!fs.existsSync(filePath)) {
        return false // File doesn't exist
      }

      await unlink(filePath)
      return true
    } catch (error) {
      console.error('Error deleting file from local storage:', error)
      throw new Error(
        `Failed to delete file from local storage: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Generate a URL for downloading a file (no signing for local files)
   * @param key File path relative to storage directory
   * @returns Direct URL to the file
   */
  async getSignedDownloadUrl(key: string): Promise<string> {
    // For local storage, we just return a direct URL to the file
    try {
      // Validate that the file exists
      const segments = key.split('/')
      const folder = segments[0]
      const fileName = segments.slice(1).join('/')

      const filePath = path.join(this.storagePath, folder, fileName)

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${key}`)
      }

      return `${this.baseUrl}/api/v1/files/${key}`
    } catch (error) {
      console.error('Error generating download URL:', error)
      throw new Error(
        `Failed to generate download URL: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Generate a token for uploading a file
   * @param key Intended file path
   * @param contentType MIME type of the file
   * @returns Upload token and URL
   */
  async getSignedUploadUrl(key: string, contentType: string): Promise<string> {
    // For local files, we'll generate a temporary token that the client can use
    // to authenticate the upload
    try {
      const token = crypto.randomBytes(32).toString('hex')

      // In a real implementation, you'd store this token with an expiry time
      // in a database or cache so you can validate it when the upload request comes in

      return `${this.baseUrl}/api/v1/files/upload?token=${token}&key=${key}&contentType=${encodeURIComponent(contentType)}`
    } catch (error) {
      console.error('Error generating upload URL:', error)
      throw new Error(
        `Failed to generate upload URL: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }
}

export default LocalStorageService
