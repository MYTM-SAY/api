import express from 'express'
import { getMe, getUser, getUserContributions,getUserIdByUsername } from '../controllers/userController'
import { isAuthenticated } from '../middlewares/authMiddleware'
import { getJoinedCommunities } from '../controllers/communityController'
// from posts
import { getAllPostContribByUser } from '../controllers/postController'
import { get } from 'http'
const router = express.Router()
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     UserPublic:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         username:
 *           type: string
 *           example: "john_doe"
 *         fullname:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "user@example.com"
 *         dob:
 *           type: string
 *           format: date-time
 *           example: "1990-01-01T00:00:00Z"
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2023-01-03T00:00:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-02T00:00:00Z"
 *     UserContributions:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "User contributions retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             CommunityMembers:
 *               type: integer
 *               example: 5
 *             Post:
 *               type: integer
 *               example: 10
 *             Comment:
 *               type: integer
 *               example: 20
 *             PostVote:
 *               type: integer
 *               example: 15
 *             CommentVote:
 *               type: integer
 *               example: 25
 *     CommunitiesResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Communities retrieved successfully"
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *     ContributionsListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Contributions retrieved successfully"
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get authenticated user's details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
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
 *                   example: "User retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/UserPublic'
 *       401:
 *         description: Unauthorized, authentication required
 *       500:
 *         description: Server error
 */
router.get('/me', isAuthenticated, getMe)

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
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
 *                   example: "User retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/UserPublic'
 *       400:
 *         description: Invalid user ID format
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:userId', getUser)

/**
 * @swagger
 * /users/{userId}/numOfContributions:
 *   get:
 *     summary: Get number of contributions by user ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved contributions count
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserContributions'
 *       400:
 *         description: Invalid user ID format
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:userId/numOfContributions', getUserContributions)

/**
 * @swagger
 * /users/{userId}/communities:
 *   get:
 *     summary: Get communities joined by user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved joined communities
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommunitiesResponse'
 *       400:
 *         description: Invalid user ID format
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:userId/communities', getJoinedCommunities)

/**
 * @swagger
 * /users/{userId}/contributions:
 *   get:
 *     summary: Get all contributions by user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved user contributions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContributionsListResponse'
 *       400:
 *         description: Invalid user ID format
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:userId/contributions', getAllPostContribByUser)

/**
 * @swagger
 * /users/getUserIdByUsername:
 *   post:
 *     summary: Get user ID by username
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: JSON object with the username
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for which the user ID is requested.
 *     responses:
 *       200:
 *         description: Successfully retrieved user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The numeric ID of the user.
 *       400:
 *         description: Invalid username format
 *       401:
 *         description: Unauthorized, authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/getUserIdByUsername', getUserIdByUsername);

export default router