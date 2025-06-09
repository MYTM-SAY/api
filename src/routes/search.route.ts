import express from 'express';
const router = express.Router();
import { SearchController } from '../controllers/searchController';
import { isAuthenticated } from '../middlewares/authMiddleware';

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for communities and users
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: The search keyword used to match community names or user usernames/fullnames
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [community, user]
 *         description: Optional type to search for (community or user). Omit to search both.
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Optional array of tag names to filter community results
 *     responses:
 *       200:
 *         description: Successful search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the search was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: A message describing the result
 *                   example: Search completed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     communities:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Community'
 *       400:
 *         description: Bad request (e.g., missing search term)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Search term (q) is required
 * 
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the user
 *           example: 1
 *         username:
 *           type: string
 *           description: The user's username
 *           example: johndoe
 *         fullname:
 *           type: string
 *           description: The user's full name
 *           example: John Doe
 *         profilePicture:
 *           type: string
 *           description: URL to the user's profile picture
 *           example: https://example.com/newprofile.jpg
 *     Community:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the community
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the community
 *           example: Tech Community
 *         description:
 *           type: string
 *           description: A brief description of the community
 *           example: A place for tech enthusiasts.
 *         bio:
 *           type: string
 *           description: A detailed bio of the community
 *           example: We are a passionate group of tech enthusiasts sharing knowledge and collaborating on innovative projects.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the community was created
 *           example: 2025-05-30T11:50:25.748Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the community was last updated
 *           example: 2025-05-30T11:50:25.748Z
 *         coverImgURL:
 *           type: string
 *           description: URL to the community's cover image
 *           example: https://example.com/cover.jpg
 *         logoImgURL:
 *           type: string
 *           description: URL to the community's logo image
 *           example: https://example.com/logo.jpg
 *         ownerId:
 *           type: integer
 *           description: The ID of the user who owns the community
 *           example: 1
 *         isPublic:
 *           type: boolean
 *           description: Indicates if the community is public
 *           example: true
 *         Tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the tag
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the tag
 *           example: javascript
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the tag was created
 *           example: 2025-05-01T00:03:29.048Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the tag was last updated
 *           example: 2025-05-01T00:03:29.048Z
 */
router.get('/', isAuthenticated, SearchController.search);

export default router;