import express from 'express'
import {
  getClassrooms,
  getClassroom,
  createClassroom,
  deleteClassroom,
  updateClassroom,
} from '../controllers/classroomController'
import { isAuthenticated, isOwner } from '../middlewares/authMiddleware'

const router = express.Router()

router.get('/', isAuthenticated, getClassrooms)
router.get('/:id', isAuthenticated, getClassroom)
router.post('/', isAuthenticated, isOwner, createClassroom)
router.delete('/:id', isAuthenticated, isOwner, deleteClassroom)
router.patch('/:id', isAuthenticated, isOwner, updateClassroom)

export default router
