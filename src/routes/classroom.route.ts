import express from 'express';
import {
  getClassrooms,
} from '../controllers/classroomController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', isAuthenticated, getClassrooms );

export default router;
