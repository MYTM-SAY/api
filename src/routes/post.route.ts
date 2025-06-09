import express from 'express'
import {
  getPostsByForumId,
  createPost,
  deletePost,
  getPost,
  updatePost,
  upVotePost,
  downVotePost,
  getAllPostContribByUser,
  getAllPostsFromCommunitiesJoinedByUser,
  getUserPosts
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
 *             example:
 *               title: "Updated Post Title"
 *               content: "This is the updated content of the post."
 *               attachments:
 *                 - "https://example.com/file1.pdf"
 *                 - "https://cdn.example.com/image.jpg"
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
 * /posts/upvote/{postId}:
 *   put:
 *     summary: Upvote a post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to upvote
 *     responses:
 *       200:
 *         description: Post successfully upvoted
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
 *                     type:
 *                       type: string
 *                       enum: [UPVOTE, DOWNVOTE, NONE]
 *                 voteCount:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put('/upvote/:postId', isAuthenticated, upVotePost);

/**
 * @swagger
 * /posts/downvote/{postId}:
 *   put:
 *     summary: Downvote a post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to downvote
 *     responses:
 *       200:
 *         description: Post successfully downvoted
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
 *                     type:
 *                       type: string
 *                       enum: [UPVOTE, DOWNVOTE, NONE]
 *                 voteCount:
 *                   type: integer
 *                   example: 8
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put('/downvote/:postId', isAuthenticated, downVotePost);
/**
 * @swagger
 * /posts/me/feed:
 *   get:
 *     summary: Get feed for the authenticated user
 *     tags: [Posts]
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
 *       403:
 *         description: Forbidden — insufficient permissions
 *       404:
 *         description: Feed not found
 */

router.get('/me/feed', isAuthenticated, getAllPostsFromCommunitiesJoinedByUser)

/**
 * @swagger
 * /posts/user/{userId}:
 *   get:
 *     summary: Get posts from communities the user has joined
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched user posts
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Posts fetched successfully
 *               data:
 *                 - id: 10
 *                   title: "Interesting Post"
 *                   content: "Here's something insightful."
 *                   voteCounter: 5
 *                   attachments:
 *                     - https://example.com/image.png
 *                   forumId: 3
 *                   createdAt: "2025-06-01T10:00:00.000Z"
 *                   updatedAt: "2025-06-01T10:15:00.000Z"
 *                   commentCount: 2
 *                   voteType: "UPVOTE"
 *                   author:
 *                     id: 2
 *                     username: johndoe
 *                     fullname: John Doe
 *                     profilePictureURL: "https://example.com/profile.jpg"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found or no posts available
 */
router.get('/user/:userId', isAuthenticated, getUserPosts);


export default router
