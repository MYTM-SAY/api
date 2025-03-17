import express from 'express';
import {
  findAllComments,
  findComment,
  createComment,
  updateComment,
  deleteComment,
  getCommentsByUserIdAndCommunityId,
  upVoteComment,
  downVoteComment,
} from '../controllers/commentController';

const router = express.Router();

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
router.get('/:postId', findAllComments);

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
router.get('/:postId/:commentId', findComment);

/**
 * @swagger
 * /comments/create/{postId}/{authorId}:
 *   post:
 *     summary: Create a new comment
 *     description: Adds a new comment to a specific post by a specific author.
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
 *         name: authorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the author creating the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is a new comment"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/create/:postId/:authorId', createComment);

/**
 * @swagger
 * /comments/update/{commentId}:
 *   put:
 *     summary: Update a comment
 *     description: Modifies the content of an existing comment.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
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
 *                 example: "Updated comment content"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put('/update/:commentId', updateComment);

/**
 * @swagger
 * /comments/delete/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     description: Removes a specific comment from the database.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:commentId', deleteComment);

/**
 * @swagger
 * /comments:
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
router.put('/upvote/:commentId/:postId/:userId', upVoteComment);

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
router.put('/downvote/:commentId/:postId/:userId', downVoteComment);

export default router;
