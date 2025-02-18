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

router.get('/discover', discoverCommunities);
router.get('/', getCommunities);
router.post('/', createCommunity);
router.delete('/:id', deleteCommunity);
router.put('/:id', updateCommunity);
router.get('/:id', getCommunity);
router.get('/', isAuthenticated, getCommunities);

export default router;
