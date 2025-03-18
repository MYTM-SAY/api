import express from 'express'
import {
  getPostsByForumId,
  createPost,
  deletePost,
  getPost,
  updatePost,
  upVotePost,
  downVotePost,
} from '../controllers/postController'
import { isAuthenticated } from '../middlewares/authMiddleware'

const router = express.Router()

/**
 * @swagger
 * /posts/forums/{id}:
 *   get:
 *     summary: Get posts by forum ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Forum ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched posts
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Forum not found
 */
router.get('/forums/:id', isAuthenticated, getPostsByForumId)

/**
 * @swagger
 * /posts/forums/{forumId}:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the forum where the post is created
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: url
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request
 */
router.post('/forums/:forumId', isAuthenticated, createPost)

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Successfully retrieved post
 *       404:
 *         description: Post not found
 */
router.get('/:id', isAuthenticated, getPost)

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: url
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 */
router.put('/:id', isAuthenticated, updatePost)

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete('/:id', isAuthenticated, deletePost)

/**
 * @swagger
 * /posts/upvote/{postId}/{userId}:
 *   put:
 *     summary: Upvote a post
 *     description: Increments the upvote count for a specific post by a specific user. If the user has not upvoted before, a new vote record is created.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to upvote
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user upvoting the post
 *     responses:
 *       200:
 *         description: Post upvoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post upvoted successfully"
 *                 vote:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     postId:
 *                       type: integer
 *                     count:
 *                       type: integer
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put('/upvote/:postId/:userId', upVotePost);

/**
 * @swagger
 * /posts/downvote/{postId}/{userId}:
 *   put:
 *     summary: Downvote a post
 *     description: Decreases the vote count of a specific post by a specific user. If the user has not voted before, a new vote record is created with a negative value.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to downvote
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user downvoting the post
 *     responses:
 *       200:
 *         description: Post downvoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post downvoted successfully"
 *                 vote:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     postId:
 *                       type: integer
 *                     count:
 *                       type: integer
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put('/downvote/:postId/:userId', downVotePost);

export default router
