import express from 'express';
import post from './post.route';

const router = express.Router();

router.use('/posts', post);

export default router;
