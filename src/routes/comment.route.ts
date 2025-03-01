import express from 'express';
import {
  findAllComments,
  findComment,
  createComment,
  updateComment,
} from '../controllers/commentController';

const router = express.Router();

router.get('/:postId', findAllComments );
router.get('/:postId/:commentId', findComment );
router.post('/create-comment/:postId', createComment);
router.put('/update-comment/:commentId', updateComment);


export default router;
