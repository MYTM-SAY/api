import express from 'express'
import path from 'path'
import fs from 'fs'

const router = express.Router()
const storagePath =
  process.env.LOCAL_STORAGE_PATH || path.join(process.cwd(), 'uploads')

// Serve static files
router.get('/:folder/:filename', (req, res) => {
  const { folder, filename } = req.params
  const filePath = path.join(storagePath, folder, filename)

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' })
  }

  // Determine content type
  const ext = path.extname(filename).toLowerCase()
  const contentTypeMap: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx':
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx':
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx':
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.txt': 'text/plain',
  }

  const contentType = contentTypeMap[ext] || 'application/octet-stream'

  // Set content type and send file
  res.setHeader('Content-Type', contentType)
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`)

  // Stream the file to the client
  const fileStream = fs.createReadStream(filePath)
  fileStream.pipe(res)
})

export default router
