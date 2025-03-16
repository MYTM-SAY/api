import express from 'express'
import { getMe } from '../controllers/userController'
import { isAuthenticated } from '../middlewares/authMiddleware'

const router = express.Router()

router.get('/me', isAuthenticated, getMe)
export default router
