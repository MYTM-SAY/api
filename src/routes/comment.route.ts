import express from 'express'
import {
  findAllComments,
  findComment,
  createComment,
  updateComment,
  deleteComment,
  getCommentsByUserIdAndCommunityId,
  upVoteComment,
  downVoteComment,
} from '../controllers/commentController'

const router = express.Router()

router.get('/:postId', findAllComments)
router.get('/:postId/:commentId', findComment)
router.post('/create-comment/:postId', createComment)
router.put('/update-comment/:commentId', updateComment)
router.delete('/delete-comment/:commentId', deleteComment)
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

/**
 * @swagger
 * /api/v1/comments/comment-upvote/{commentId}/{postId}/{forumId}/{communityId}/{userId}:
 *   put:
 *     summary: Upvote a comment
 *     description: Increments the upvote count of a comment in a specific post, forum, and community by a specific user.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to upvote
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post containing the comment
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the forum containing the post
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the community containing the forum
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user upvoting the comment
 *     responses:
 *       200:
 *         description: Comment successfully upvoted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment upvoted successfully"
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put('/comment-upvote/:commentId/:postId/:forumId/:communityId/:userId', upVoteComment);

/**
 * @swagger
 * /api/v1/comments/comment-downvote/{commentId}/{postId}/{forumId}/{communityId}/{userId}:
 *   put:
 *     summary: Downvote a comment
 *     description: Decreases the vote count of a comment by 1 for a specific user in a community.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to downvote
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post that contains the comment
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the forum
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the community
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user downvoting the comment
 *     responses:
 *       200:
 *         description: Comment downvoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 userId:
 *                   type: integer
 *                   example: 10
 *                 commentId:
 *                   type: integer
 *                   example: 5
 *                 count:
 *                   type: integer
 *                   example: -1
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */

router.put('/comment-downvote/:commentId/:postId/:forumId/:communityId/:userId', downVoteComment);

export default router;