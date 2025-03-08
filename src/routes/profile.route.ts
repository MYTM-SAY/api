import express from 'express';
import {
  getProfile,
  createProfile,
  updateProfile
} from '../controllers/profileController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/:id', isAuthenticated, getProfile);
router.post('/:id/create', isAuthenticated, createProfile);
router.put('/:id/update', isAuthenticated, updateProfile);


export default router;
