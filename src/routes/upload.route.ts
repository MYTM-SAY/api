import express from 'express'
import { uploadFile, uploadVideo } from '../middlewares/uploadMiddleware'
import {
  uploadFileToStorage,
  uploadVideoToStorage,
  getSignedUploadUrl,
  getSignedDownloadUrl,
} from '../controllers/uploadController'

const router = express.Router()

/**
 * @swagger
 * /upload/file:
 *   post:
 *     summary: Upload a file to storage
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload (max 10MB)
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 fileUrl:
 *                   type: string
 *                   example: https://example.com/files/uploads/1234567890-file.pdf
 *       400:
 *         description: No file uploaded or invalid file type
 *       500:
 *         description: Server error
 */
router.post('/file', uploadFile.single('file'), uploadFileToStorage)

/**
 * @swagger
 * /upload/video:
 *   post:
 *     summary: Upload a video to storage
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: The video file to upload (max 100MB)
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Video uploaded successfully
 *                 fileUrl:
 *                   type: string
 *                   example: https://example.com/files/videos/1234567890-video.mp4
 *       400:
 *         description: No video uploaded or invalid file type
 *       500:
 *         description: Server error
 */
router.post('/video', uploadVideo.single('video'), uploadVideoToStorage)

/**
 * @swagger
 * /upload/signed-url:
 *   post:
 *     summary: Get a signed URL for direct upload
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filename
 *               - contentType
 *             properties:
 *               filename:
 *                 type: string
 *                 description: Name of the file to upload
 *                 example: document.pdf
 *               contentType:
 *                 type: string
 *                 description: MIME type of the file
 *                 example: application/pdf
 *     responses:
 *       200:
 *         description: Signed URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Upload URL generated successfully
 *                 uploadUrl:
 *                   type: string
 *                   example: https://example.com/presigned-url
 *                 key:
 *                   type: string
 *                   example: uploads/1234567890-document.pdf
 *                 fileUrl:
 *                   type: string
 *                   example: https://example.com/files/uploads/1234567890-document.pdf
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.post('/signed-url', getSignedUploadUrl)

/**
 * @swagger
 * /upload/download/{key}:
 *   get:
 *     summary: Get a signed URL for downloading a file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The storage key of the file to download
 *         example: uploads/1234567890-document.pdf
 *     responses:
 *       200:
 *         description: Signed URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Download URL generated successfully
 *                 downloadUrl:
 *                   type: string
 *                   example: https://example.com/presigned-download-url
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.get('/download/:key', getSignedDownloadUrl)

export default router
