import express from 'express';
import {
  getProfile,
  createProfile,
  updateProfile,
  contributionsOfUser,
  userPublicProfile
} from '../controllers/profileController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/:id', isAuthenticated, getProfile);
router.post('/:id/create', isAuthenticated, createProfile);
router.put('/:id/update', isAuthenticated, updateProfile);
router.get('/:id/contributions', isAuthenticated, contributionsOfUser );
router.get('/:id/public', isAuthenticated, userPublicProfile);


export default router;
