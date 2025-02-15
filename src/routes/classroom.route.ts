import express from 'express';
import {
  getClassrooms,
  getClassroom,
} from '../controllers/classroomController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', isAuthenticated, getClassrooms );
router.get('/:id', isAuthenticated, getClassroom );

export default router;
