import express from 'express'
import {
	modifiedLessons,
	updatedProgress,
} from '../controllers/progressBarController'

const router = express.Router()

router.post('/change-lesson-status/:communityId/:classroomId/:lessonId/:userId', modifiedLessons)
router.post('/update-progress/:communityId/:classroomId/:userId', updatedProgress)

export default router
