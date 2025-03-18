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
import { isAuthenticated } from '../middlewares/authMiddleware'

const router = express.Router()

/**
 * @swagger
 * /comments/{postId}:
 *   get:
 *     summary: Get all comments for a post
 *     description: Retrieves all comments associated with a specific post.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post
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
 *                   content:
 *                     type: string
 *                   authorId:
 *                     type: integer
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.get('/:postId', findAllComments)

/**
 * @swagger
 * /comments/{postId}/{commentId}:
 *   get:
 *     summary: Get a specific comment
 *     description: Retrieves a specific comment from a post.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment
 *     responses:
 *       200:
 *         description: Comment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 authorId:
 *                   type: integer
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.get('/:postId/:commentId', findComment)

/**
 * @swagger
 * /comments/{commentId}/posts/{postId}:
 * /comments:
 *   get:
 *     summary: Retrieve a specific comment on a post
 *     description: Fetches a single comment by comment ID and post ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Successfully retrieved the comment
 */
router.get('/:commentId/posts/:postId', isAuthenticated, findComment)

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     description: Adds a new comment to a post.
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Content of the comment
 *               postId:
 *                 type: integer
 *                 description: ID of the post to comment on
 *               parentId:
 *                  type: integer
 *                  description: ID of the parent comment
 *     responses:
 *       201:
 *         description: Successfully created the comment
 */
router.post('/', isAuthenticated, createComment)

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update an existing comment
 *     description: Modifies the content of an existing comment.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated content of the comment
 *     responses:
 *       200:
 *         description: Successfully updated the comment
 */
router.put('/:id', isAuthenticated, updateComment)

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Permanently removes a comment by its ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to delete
 *     responses:
 *       204:
 *         description: Successfully deleted the comment
 */
router.delete('/:id', isAuthenticated, deleteComment)

/**
 * @swagger
 * /comments/communities/{id}:
 *   get:
 *     summary: Get comments by user and community
 *     description: Retrieves comments made by a user within a specific community.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the community
 *     responses:
 *       200:
 *         description: Successfully retrieved comments for the specified community
 */
router.get(
  '/communities/:id',
  isAuthenticated,
  getCommentsByUserIdAndCommunityId,
)

/**
 * @swagger
 * /comments/upvote/{commentId}/{postId}/{userId}:
 *   put:
 *     summary: Upvote a comment
 *     description: Increments the upvote count of a comment in a specific post by a specific user.
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
router.put('/upvote/:commentId/:postId/:userId', upVoteComment)

/**
 * @swagger
 * /comments/downvote/{commentId}/{postId}/{userId}:
 *   put:
 *     summary: Downvote a comment
 *     description: Decreases the vote count of a comment by 1 for a specific user.
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
 *         description: ID of the post containing the comment
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
 *                 message:
 *                   type: string
 *                   example: "Comment downvoted successfully"
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put('/downvote/:commentId/:postId/:userId', downVoteComment)

export default router
