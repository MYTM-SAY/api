import express from 'express';
import {
  findAllComments,
  findComment,
  createComment,
} from '../controllers/commentController';

const router = express.Router();

router.get('/:postId', findAllComments );
router.get('/:postId/:commentId', findComment );
router.post('/create-comment/:postId', createComment);


export default router;
