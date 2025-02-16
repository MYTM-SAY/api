import express from 'express';
import {
  discoverCommunities,
  getCommunities,
} from '../controllers/communityController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', isAuthenticated, getCommunities);
router.get('/discover', discoverCommunities);

export default router;
