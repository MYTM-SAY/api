import express from 'express';
import { getCommunities, getCommunity } from '../controllers/communityController';

const router = express.Router();

router.get('/', getCommunities);
router.get('/:id', getCommunity);

export default router;
