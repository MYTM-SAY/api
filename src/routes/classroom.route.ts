import express from 'express';
import {
  getClassrooms,
  getClassroom,
  createClassroom,
  deleteClassroom,
} from '../controllers/classroomController';
import { isAuthenticated, isOwner } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', isAuthenticated, getClassrooms );
router.get('/:id', isAuthenticated, getClassroom );
router.post('/', isAuthenticated, isOwner, createClassroom );
router.delete('/', isAuthenticated, isOwner,   deleteClassroom);


export default router;
