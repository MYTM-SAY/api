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
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - forumId
 *               - authorId
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
 *               forumId:
 *                 type: integer
 *               authorId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request
 */
router.post('/:authorId/:forumId', isAuthenticated, createPost)

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
 * /posts/upvote/{postId}/{forumId}/{userId}:
 *   put:
 *     summary: Upvote a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Forum ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Post upvoted successfully
 *       404:
 *         description: Post not found
 */
router.put('/upvote/:postId/:forumId/:userId', upVotePost)

/**
 * @swagger
 * /posts/downvote/{postId}/{forumId}/{userId}:
 *   put:
 *     summary: Downvote a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Forum ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Post downvoted successfully
 *       404:
 *         description: Post not found
 */
router.put('/downvote/:postId/:forumId/:userId', downVotePost)

export default router
