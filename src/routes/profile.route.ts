import express from 'express';
import {
  getProfile
} from '../controllers/profileComtroller';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

;
router.get('/:id', getProfile);
export default router;
