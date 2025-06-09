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
  getUserComments,
} from '../controllers/commentController'
import { isAuthenticated } from '../middlewares/authMiddleware'

const router = express.Router()
/**
 * @swagger
 * /comments/user/{userId}:
 *   get:
 *     summary: Get comments by a specific user
 *     description: Retrieves all comments made by a specific user along with vote count and vote type.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of user comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User comments retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       authorId:
 *                         type: integer
 *                       voteCount:
 *                         type: integer
 *                       voteType:
 *                         type: string
 *                         enum: [UPVOTE, DOWNVOTE, NONE]
 *                       Author:
 *                         type: object
 *                         properties:
 *                           fullname:
 *                             type: string
 *                           UserProfile:
 *                             type: object
 *                             properties:
 *                               profilePictureURL:
 *                                 type: string
 *                       Children:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             content:
 *                               type: string
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', isAuthenticated, getUserComments)

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
router.get('/:postId', isAuthenticated, findAllComments)

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
 * /comments/{postId}:
 *   post:
 *     summary: Create a new comment
 *     description: Adds a new comment to a post by ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               parentId:
 *                 type: integer
 *                 description: ID of the parent comment (optional)
 *     responses:
 *       201:
 *         description: Successfully created the comment
 */
router.post('/:postId', isAuthenticated, createComment)

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
 * /comments/upvote/{commentId}:
 *   put:
 *     summary: Upvote a comment
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to upvote
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
 *                 vote:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     commentId:
 *                       type: integer
 *                     type:
 *                       type: string
 *                       enum: [UPVOTE, DOWNVOTE, NONE]
 *                 voteCount:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put('/upvote/:commentId', isAuthenticated, upVoteComment);

/**
 * @swagger
 * /comments/downvote/{commentId}:
 *   put:
 *     summary: Downvote a comment
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to downvote
 *     responses:
 *       200:
 *         description: Comment successfully downvoted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment downvoted successfully"
 *                 vote:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     commentId:
 *                       type: integer
 *                     type:
 *                       type: string
 *                       enum: [UPVOTE, DOWNVOTE, NONE]
 *                 voteCount:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put('/downvote/:commentId', isAuthenticated, downVoteComment);


export default router
