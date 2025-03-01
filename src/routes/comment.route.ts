import express from 'express';
import {
  findAllComments,
} from '../controllers/commentController';

const router = express.Router();

router.get('/:postId', findAllComments );


export default router;
