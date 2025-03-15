import express from 'express'
import {
  getPostsByForumId,
  createPost,
  deletePost,
  getPost,
  updatePost,
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
 *       - bearerAuth: []  # Assuming authentication is required
 *     responses:
 *       200:
 *         description: Successfully fetched posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Posts fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
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
 *                 example: "New Post Title"
 *               content:
 *                 type: string
 *                 example: "Content of the post."
 *               attchments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: url
 *                 example: ["https://example.com/image.png"]
 *               forumId:
 *                 type: integer
 *                 example: 5
 *               authorId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "New Post Title"
 *                 content:
 *                   type: string
 *                   example: "Content of the post."
 *                 attchments:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: url
 *                   example: ["https://example.com/image.png"]
 *                 forumId:
 *                   type: integer
 *                   example: 5
 *                 authorId:
 *                   type: integer
 *                   example: 10
 */
router.post('/', isAuthenticated, createPost)
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Post data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "My First Post"
 *                 content:
 *                   type: string
 *                   example: "This is the content of the post."
 *                 attchments:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: url
 *                   example: ["https://example.com/image.png"]
 *                 forumId:
 *                   type: integer
 *                   example: 5
 *                 authorId:
 *                   type: integer
 *                   example: 10
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
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Post Title"
 *               content:
 *                 type: string
 *                 example: "Updated content."
 *               attchments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: url
 *                 example: ["https://example.com/new-image.png"]
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Updated Post Title"
 *                 content:
 *                   type: string
 *                   example: "Updated content."
 *                 attchments:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: url
 *                   example: ["https://example.com/new-image.png"]
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
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post to delete
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete('/:id', isAuthenticated, deletePost)

export default router
