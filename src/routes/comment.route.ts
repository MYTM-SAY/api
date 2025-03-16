import express from 'express'
import {
  findAllComments,
  findComment,
  createComment,
  updateComment,
  deleteComment,
  getCommentsByUserIdAndCommunityId,
} from '../controllers/commentController'
import { isAuthenticated } from '../middlewares/authMiddleware'

const router = express.Router()

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get all comments for a specific post
 *     description: Retrieves all comments associated with the given post ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: A list of comments for the post
 */
router.get('/posts/:id', isAuthenticated, findAllComments)

/**
 * @swagger
 * /comments/{commentId}/posts/{postId}:
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

export default router
