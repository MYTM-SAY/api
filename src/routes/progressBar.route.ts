import express from 'express'
import {
	modifiedLessons,
	updatedProgress,
} from '../controllers/progressBarController'

const router = express.Router()

router.post('/change-lesson-status/:lessonId/:userId', modifiedLessons)
router.post('/update-progress/:classroomId/:userId', updatedProgress)

export default router
