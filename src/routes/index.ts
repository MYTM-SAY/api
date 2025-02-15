import express from 'express';
import classroom from './classroom.route';
import community from './community.route';
import post from './post.route';

const router = express.Router();

router.use('/posts', post);
router.use('/communities', community);
router.use('/classrooms', classroom);

export default router;
