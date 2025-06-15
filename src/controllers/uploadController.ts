import { Request, Response } from 'express'
import fs from 'fs'
import StorageFactory from '../services/storageFactory'
import { getVideoDurationInSeconds } from 'get-video-duration'
// Get the appropriate storage service
const storageService = StorageFactory.getStorageService()

export const uploadFileToStorage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    console.log({
      file: req.file,
    })

    // For smaller files, use buffer upload
    if (req.file.size <= 5 * 1024 * 1024) {
      // TODO: for now we are using the large file upload for all files

      // 5MB
      // const fileUrl = await storageService.uploadBuffer(
      //   req.file.buffer,
      //   req.file.originalname,
      //   req.file.mimetype,
      // )

      const fileUrl = await storageService.uploadLargeFile(
        req.file.path,
        req.file.originalname,
        req.file.mimetype,
      )

      fs.unlinkSync(req.file.path)

      return res.status(201).json({
        message: 'File uploaded successfully',
        fileUrl,
      })
    } else {
      // For larger files, use the multipart upload
      const fileUrl = await storageService.uploadLargeFile(
        req.file.path,
        req.file.originalname,
        req.file.mimetype,
      )

      // Clean up temp file after upload
      fs.unlinkSync(req.file.path)

      return res.status(201).json({
        message: 'File uploaded successfully',
        fileUrl,
      })
    }
  } catch (error) {
    console.error('Error in file upload:', error)
    return res.status(500).json({
      message: 'Failed to upload file',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export const uploadVideoToStorage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' })
    }
    const duration = await getVideoDurationInSeconds(req.file.path)
    console.log('Video duration:', duration)
    const fileUrl = await storageService.uploadLargeFile(
      req.file.path,
      req.file.originalname,
      req.file.mimetype,
      Math.floor(duration),
    )

    return res.status(201).json({
      message: 'Video uploaded successfully',
      fileUrl,
    })
  } catch (error) {
    console.error('Error in video upload:', error)
    return res.status(500).json({
      message: 'Failed to upload video',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

/**
 * Generate a signed URL for uploading a file directly to S3
 */
export const getSignedUploadUrl = async (req: Request, res: Response) => {
  try {
    const { filename, contentType } = req.body

    if (!filename || !contentType) {
      return res.status(400).json({
        message: 'Filename and content type are required',
      })
    }

    const key = `uploads/${Date.now()}-${filename}`
    const signedUrl = await storageService.getSignedUploadUrl(key, contentType)

    return res.status(200).json({
      message: 'Upload URL generated successfully',
      uploadUrl: signedUrl,
      key: key,
      // After upload completes, the file will be available at:
      fileUrl: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`,
    })
  } catch (error) {
    console.error('Error generating signed upload URL:', error)
    return res.status(500).json({
      message: 'Failed to generate upload URL',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

/**
 * Generate a signed URL for downloading a file from S3
 */
export const getSignedDownloadUrl = async (req: Request, res: Response) => {
  try {
    const { key } = req.params

    if (!key) {
      return res.status(400).json({ message: 'File key is required' })
    }

    const signedUrl = await storageService.getSignedDownloadUrl(key)

    return res.status(200).json({
      message: 'Download URL generated successfully',
      downloadUrl: signedUrl,
    })
  } catch (error) {
    console.error('Error generating signed download URL:', error)
    return res.status(500).json({
      message: 'Failed to generate download URL',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
