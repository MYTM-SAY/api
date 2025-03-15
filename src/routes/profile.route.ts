import express from 'express'
import { getProfile, createProfile } from '../controllers/profileController'
import { isAuthenticated } from '../middlewares/authMiddleware'

const router = express.Router()

router.get('/:id', isAuthenticated, getProfile)
router.post('/:id/create', isAuthenticated, createProfile)

export default router
