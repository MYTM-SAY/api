import { Readable } from 'stream'
import { Buffer } from 'buffer'

export interface StorageService {
  uploadBuffer(
    buffer: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<string>
  uploadLargeFile(
    filePath: string,
    fileName: string,
    contentType: string,
    duration?: number,
  ): Promise<string>
  getFile(key: string): Promise<Readable>
  deleteFile(key: string): Promise<boolean>
  getSignedDownloadUrl(key: string, expiresIn?: number): Promise<string>
  getSignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn?: number,
  ): Promise<string>
}
