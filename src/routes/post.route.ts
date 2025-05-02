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
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Posts fetched successfully
 *               data:
 *                 - id: 7
 *                   title: "string"
 *                   content: "string"
 *                   voteCounter: 0
 *                   attachments:
 *                     - https://example.com/file1
 *                   forumId: 1
 *                   createdAt: "2025-05-02T19:43:02.054Z"
 *                   updatedAt: "2025-05-02T19:43:02.054Z"
 *                   commentCount: 0
 *                   author:
 *                     id: 1
 *                     username: johndoe
 *                     fullname: John Doe
 *                     avatarUrl: https://example.com/profile.jpg
 *                 - id: 6
 *                   title: "string abdelsalam"
 *                   content: "string"
 *                   voteCounter: 0
 *                   attachments:
 *                     - https://example.com/file1
 *                   forumId: 1
 *                   createdAt: "2025-05-02T19:34:01.225Z"
 *                   updatedAt: "2025-05-02T19:34:01.225Z"
 *                   commentCount: 0
 *                   author:
 *                     id: 2
 *                     username: johndoe12
 *                     fullname: John Doe12
 *                     avatarUrl: defaultavatar.jpg
 *                 - id: 4
 *                   title: "string"
 *                   content: "string"
 *                   voteCounter: 0
 *                   attachments:
 *                     - https://example.com/file1
 *                   forumId: 1
 *                   createdAt: "2025-05-02T18:44:11.608Z"
 *                   updatedAt: "2025-05-02T18:44:11.608Z"
 *                   commentCount: 0
 *                   author:
 *                     id: 1
 *                     username: johndoe
 *                     fullname: John Doe
 *                     avatarUrl: https://example.com/profile.jpg
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
 *                   example: "https://example.com/file1"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     voteCounter:
 *                       type: number
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: string
 *                     forumId:
 *                       type: number
 *                     authorId:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     Authorfiltered:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         username:
 *                           type: string
 *                         fullname:
 *                           type: string
 *                         profilePictureURL:
 *                           type: string
 *                     commentsCount:
 *                       type: number
 *             example:
 *               success: true
 *               message: "Post fetched successfully"
 *               data:
 *                 id: 1
 *                 title: "string"
 *                 content: "string"
 *                 voteCounter: 0
 *                 attachments: []
 *                 forumId: 1
 *                 authorId: 1
 *                 createdAt: "2025-04-11T06:41:58.470Z"
 *                 updatedAt: "2025-04-11T06:41:58.470Z"
 *                 Authorfiltered:
 *                   id: 1
 *                   username: "johndoe"
 *                   fullname: "John Doe"
 *                   profilePictureURL: "https://example.com/profile.jpg"
 *                 commentsCount: 0
 *       404:
 *         description: Post not found
 */
router.get('/:id', isAuthenticated, getPost);

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
router.put('/upvote/:postId/:userId', upVotePost)

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
router.put('/downvote/:postId/:userId', downVotePost)

export default router
