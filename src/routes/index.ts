import express from 'express';
import post from './post.route';
import community from './community.route';
import profile from './profile.route';

const router = express.Router();

router.use('/posts', post);
router.use('/communities', community);
router.use('/profile', profile);


export default router;
