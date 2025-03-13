import express from 'express'
import {
  createLesson,
  deleteLesson,
  getLesson,
  getLessons,
  updateLesson,
} from '../controllers/lessonController'
import {
  hasCommunityRoleOrHigher,
  isAuthenticated,
} from '../middlewares/authTesting'

const router = express.Router()

router.use(isAuthenticated)
router.get('/', getLessons)
router.get('/:id', getLesson)

// Owner-only routes
router.use(hasCommunityRoleOrHigher(['OWNER']))
router.post('/', createLesson)
router.delete('/:id', deleteLesson)
router.patch('/:id', updateLesson)

export default router
