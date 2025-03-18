import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Readable } from 'stream'
import fs from 'fs'
import { Buffer } from 'buffer'

const getSignedUrl = async (...args: any[]) => {
  console.log({
    args,
  })
  return 'https://example.com'
}

export class S3Service {
  private s3Client: S3Client

  private bucket: string

  constructor() {
    throw new Error('S3Service is not implemented yet')
    // Initialize S3 client with AWS credentials from environment variables
    // this.s3Client = new S3Client({
    //   region: process.env.AWS_REGION || 'us-east-1',
    //   credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    //   },
    // })

    // this.bucket = process.env.AWS_S3_BUCKET || ''

    // if (!this.bucket) {
    //   throw new Error('AWS S3 bucket name is required')
    // }
  }

  /**
   * Upload a file from buffer to S3
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
    const key = `uploads/${Date.now()}-${fileName}`

    const uploadParams = {
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams))
      return `https://${this.bucket}.s3.amazonaws.com/${key}`
    } catch (error) {
      console.error('Error uploading file to S3:', error)
      throw new Error(
        `Failed to upload file to S3: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Upload a large file or video to S3 using multipart upload
   * @param filePath Path to the file on disk
   * @param fileName Destination file name
   * @param contentType MIME type of the file
   * @returns URL of the uploaded file
   */
  async uploadLargeFile(
    filePath: string,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    const fileStream = fs.createReadStream(filePath)
    const key = `videos/${Date.now()}-${fileName}`

    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucket,
          Key: key,
          Body: fileStream,
          ContentType: contentType,
        },
      })

      await upload.done()
      return `https://${this.bucket}.s3.amazonaws.com/${key}`
    } catch (error) {
      console.error('Error uploading large file to S3:', error)
      throw new Error(
        `Failed to upload large file to S3: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Get a file from S3
   * @param key S3 object key
   * @returns Readable stream of the file
   */
  async getFile(key: string): Promise<Readable> {
    try {
      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      )

      return response.Body as Readable
    } catch (error) {
      console.error('Error getting file from S3:', error)
      throw new Error(
        `Failed to get file from S3: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Delete a file from S3
   * @param key S3 object key
   * @returns Success indicator
   */
  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      )
      return true
    } catch (error) {
      console.error('Error deleting file from S3:', error)
      throw new Error(
        `Failed to delete file from S3: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Generate a signed URL for downloading a file from S3
   * @param key S3 object key
   * @param expiresIn URL expiration time in seconds (default: 3600 = 1 hour)
   * @returns Signed URL for downloading the file
   */
  async getSignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      })

      return signedUrl
    } catch (error) {
      console.error('Error generating signed download URL:', error)
      throw new Error(
        `Failed to generate signed download URL: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Generate a signed URL for uploading a file to S3
   * @param key S3 object key
   * @param contentType MIME type of the file
   * @param expiresIn URL expiration time in seconds (default: 3600 = 1 hour)
   * @returns Signed URL for uploading the file
   */
  async getSignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn = 3600,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      })

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      })

      return signedUrl
    } catch (error) {
      console.error('Error generating signed upload URL:', error)
      throw new Error(
        `Failed to generate signed upload URL: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }
}

// Export a singleton instance
export default S3Service
