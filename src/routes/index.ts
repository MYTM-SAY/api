import express from 'express';
import post from './post.route';
import community from './community.route';

const router = express.Router();

router.use('/posts', post);
router.use('/communities', community);

export default router;
