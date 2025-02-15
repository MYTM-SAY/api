import express from 'express';
import {
  getClassrooms,
  getClassroom,
  createClassroom,
} from '../controllers/classroomController';
import { isAuthenticated, isOwner } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', isAuthenticated, getClassrooms );
router.get('/:id', isAuthenticated, getClassroom );
router.post('/', isAuthenticated, isOwner, createClassroom );


export default router;
