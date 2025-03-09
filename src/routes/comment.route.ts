import express from 'express';
import {
  findAllComments,
  findComment,
  createComment,
  updateComment,
  deleteComment,
  getCommentsByUserIdAndCommunityId,
} from '../controllers/commentController';

const router = express.Router();

router.get('/:postId', findAllComments);
router.get('/:postId/:commentId', findComment);
router.post('/create-comment/:postId', createComment);
router.put('/update-comment/:commentId', updateComment);
router.delete('/delete-comment/:commentId', deleteComment);
/**
 * @swagger
 * /api/v1/comments:
 *   get:
 *     summary: Get user comments in a community
 *     description: Retrieves all comments made by a specific user in a specific community.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: communityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Community ID
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   content:
 *                     type: string
 *                     example: "This is a comment"
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.get('/', getCommentsByUserIdAndCommunityId);

export default router;
