import express from 'express';
import {
  discoverCommunities,
  getCommunities,
  createCommunity,
  deleteCommunity,
  updateCommunity,
  getCommunity,
} from '../controllers/communityController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', getCommunities);
router.post('/', createCommunity);
router.delete('/:id', deleteCommunity);
router.put('/:id', updateCommunity);
router.get('/:id', getCommunity);
router.get('/', isAuthenticated, getCommunities);
router.get('/discover', discoverCommunities);

export default router;
