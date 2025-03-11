import express from 'express'
import {
  getClassrooms,
  getClassroom,
  createClassroom,
  deleteClassroom,
  updateClassroom,
} from '../controllers/classroomController'
import {
  hasCommunityRoleOrHigher,
  isAuthenticated,
} from '../middlewares/authMiddleware'

const router = express.Router()

router.get('/', isAuthenticated, getClassrooms)
router.get('/:id', isAuthenticated, getClassroom)

// Owner-only routes
router.use(hasCommunityRoleOrHigher(['OWNER']))
router.post('/', isAuthenticated, createClassroom)
router.delete('/:id', isAuthenticated, deleteClassroom)
router.patch('/:id', isAuthenticated, updateClassroom)

export default router
