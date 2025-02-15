import express from 'express';
import {
  getCommunities,
} from '../controllers/communityController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', isAuthenticated, getCommunities);

export default router;
