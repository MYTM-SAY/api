import express from 'express';
import {
  getProfile
} from '../controllers/profileController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/:id', isAuthenticated, getProfile);


export default router;
