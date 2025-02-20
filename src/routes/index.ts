import express from 'express';
import classroom from './classroom.route';
import community from './community.route';
import post from './post.route';
import progress from './progressBar.route';

const router = express.Router();

router.use('/posts', post);
router.use('/communities', community);
router.use('/classrooms', classroom);
router.use('/progress', progress);

export default router;
