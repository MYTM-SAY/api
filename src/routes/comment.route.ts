import express from 'express';
import {
  findAllComments,
  findComment,
} from '../controllers/commentController';

const router = express.Router();

router.get('/:postId', findAllComments );
router.get('/:postId/:commentId', findComment );


export default router;
