import { StorageService } from '../interfaces/storageService.interface'
import S3Service from './s3Service'
import LocalStorageService from './localStorageService'

class StorageFactory {
  private static instance: StorageService | null = null

  static getStorageService(): StorageService {
    if (!this.instance) {
      const hasS3Credentials = !!(
        process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY &&
        process.env.AWS_S3_BUCKET
      )

      if (hasS3Credentials) {
        console.log('Using S3 storage service')
        this.instance = new S3Service()
      } else {
        console.log('Using local storage service (S3 credentials not found)')
        this.instance = new LocalStorageService()
      }
    }

    return this.instance
  }
}

export default StorageFactory
