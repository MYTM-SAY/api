import express from 'express';
import { createProfile, getContributions, getProfile, updateProfile } from '../controllers/profileController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

// pulbic routes
/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Get a user profile
 *     description: "Retrieves the profile details for the specified user ID."
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "The ID of the user."
 *     responses:
 *       200:
 *         description: "Successfully retrieved profile."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       404:
 *         description: "Profile not found."
 *       500:
 *         description: "Server error."
 */
router.get('/:id',  getProfile);

// Authenticated routes

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create a new user profile
 *     description: "Creates a new profile for the authenticated user."
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              
 *               - bio
 *             properties:
 *               bio:
 *                 type: string
 *                 example: "I am a software developer."
 *               twitter:
 *                 type: string
 *                 format: url
 *                 example: "https://twitter.com/example"
 *               facebook:
 *                 type: string
 *                 format: url
 *                 example: "https://facebook.com/example"
 *               instagram:
 *                 type: string
 *                 format: url
 *                 example: "https://instagram.com/example"
 *               linkedin:
 *                 type: string
 *                 format: url
 *                 example: "https://linkedin.com/in/example"
 *               youtube:
 *                 type: string
 *                 format: url
 *                 example: "https://youtube.com/example"
 *               profilePictureURL:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/profile.jpg"
 *     responses:
 *       201:
 *         description: "Profile created successfully."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       403:
 *         description: "Forbidden: You can only create your own profile."
 *       500:
 *         description: "Server error."
 */
router.post('/', isAuthenticated, createProfile);

/**
 * @swagger
 * /profiles/:
 *   put:
 *     summary: Update a user profile
 *     description: "Updates the profile details for the authenticated user."
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 example: "Updated bio information."
 *               twitter:
 *                 type: string
 *                 format: url
 *                 example: "https://twitter.com/newexample"
 *               facebook:
 *                 type: string
 *                 format: url
 *                 example: "https://facebook.com/newexample"
 *               instagram:
 *                 type: string
 *                 format: url
 *                 example: "https://instagram.com/newexample"
 *               linkedin:
 *                 type: string
 *                 format: url
 *                 example: "https://linkedin.com/in/newexample"
 *               youtube:
 *                 type: string
 *                 format: url
 *                 example: "https://youtube.com/newexample"
 *               profilePictureURL:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/newprofile.jpg"
 *     responses:
 *       200:
 *         description: "Profile updated successfully."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       403:
 *         description: "Forbidden: You can only update your own profile."
 *       500:
 *         description: "Server error."
 */
router.put('/', isAuthenticated, updateProfile);


/**
 * @swagger
 * /profiles/contributions/{username}:
 *   get:
 *     summary: Get user contributions
 *     description: Retrieves the contribution data (e.g., daily streaks or total contributions) for the specified user.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved contributions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *                 userId:
 *                   type: integer
 *                   example: 5
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-08T12:34:56.000Z"
 *                 count:
 *                   type: integer
 *                   example: 34
 *       404:
 *         description: Contributions not found for this user.
 *       500:
 *         description: Internal server error.
 */
router.get('/contributions/:username', getContributions);

export default router;
