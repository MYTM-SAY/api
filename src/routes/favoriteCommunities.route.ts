import express from 'express'
import {
  toggleFavoriteCommunity,
  getFavoriteCommunities,
} from '../controllers/favoriteCommunitiesController'
import { isAuthenticated } from '../middlewares/authMiddleware'

const router = express.Router()

router.use(isAuthenticated)

/**
 * @swagger
 * /favorites/{communityId}/toggle:
 *   patch:
 *     summary: Toggle a community as favorite for the authenticated user
 *     description: Adds a community to the user's favorites if not already favorited, or removes it if it is. Requires authentication via a bearer token.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the community to toggle as favorite
 *     responses:
 *       201:
 *         description: Community successfully added to favorites
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
 *                   example: "Community added to favorites"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     communityId:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-03T16:46:47.092Z"
 *       200:
 *         description: Community successfully removed from favorites
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
 *                   example: "Community removed from favorites"
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: Invalid communityId provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid communityId"
 *       404:
 *         description: Community not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Community not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.patch('/:communityId/toggle', toggleFavoriteCommunity)

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get all favorite communities for the authenticated user
 *     description: Retrieves a list of all communities marked as favorites by the authenticated user. Requires authentication via a bearer token.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorite communities successfully retrieved
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
 *                   example: "Favorite communities retrieved"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FavoriteCommunity'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/', getFavoriteCommunities)

export default router
