import express from 'express'
import {
	modifiedSection,
	updatedProgress,
} from '../controllers/progressBarController'

const router = express.Router()

router.post('/change-section-status/:secId', modifiedSection)
router.post('/update-progress/:classId', updatedProgress)

export default router
