import express from 'express'
import {
  discoverCommunities,
  getCommunities,
  createCommunity,
  deleteCommunity,
  updateCommunity,
  getCommunity,
} from '../controllers/communityController'

import {
  promoteToModerator,
  demoteFromModerator,
} from '../controllers/memberRoles'

import { isAuthenticated } from '../middlewares/authMiddleware'
import validate from '../middlewares/validation'
import { CommunitySchema } from '../utils'

const app = express.Router()

// authed
// TODO: app.get('/mine', isAuthenticated, getUserCommunities);
app.get('/discover', discoverCommunities) // need revision
app.post('/:id/remove-moderator/:userId', isAuthenticated, demoteFromModerator) // done
app.post('/:id/assign-moderator/:userId', isAuthenticated, promoteToModerator) // done
/**
 * @swagger
 * /api/v1/communities:
 *   get:
 *     summary: Get all communities
 *     description: Fetch a list of all communities.
 *     tags: [Communities]
 *     responses:
 *       200:
 *         description: Successfully retrieved communities.
 *       500:
 *         description: Server error.
 */
app.get('/', getCommunities)
/**
 * @swagger
 * /api/v1/communities:
 *   post:
 *     summary: Create a new community
 *     description: Creates a new community with the provided details.
 *     tags: [Communities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - Owner
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tech Community"
 *               description:
 *                 type: string
 *                 example: "A place for tech enthusiasts."
 *               coverImgURL:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/cover.jpg"
 *               logoImgURL:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/logo.jpg"
 *               ownerId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Community created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Community"
 *       400:
 *         description: Bad request.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
app.post('/', isAuthenticated, validate(CommunitySchema), createCommunity)
/**
 * @swagger
 * /api/v1/communities/{id}:
 *   delete:
 *     summary: Delete a community
 *     description: Removes a community by its ID.
 *     tags: [Communities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the community to delete.
 *     responses:
 *       204:
 *         description: Community deleted successfully.
 *       404:
 *         description: Community not found.
 *       500:
 *         description: Server error.
 */
app.delete('/:id', deleteCommunity)
/**
 * @swagger
 * /api/v1/communities/{id}:
 *   get:
 *     summary: Get a single community
 *     description: Fetches details of a specific community by its ID.
 *     tags: [Communities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the community to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved community.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Community"
 *       404:
 *         description: Community not found.
 *       500:
 *         description: Server error.
 */
app.get('/:id', getCommunity)
/**
 * @swagger
 * /api/v1/communities/{id}:
 *   put:
 *     summary: Update a community
 *     description: Updates an existing community with new data.
 *     tags: [Communities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the community to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Community Name"
 *               description:
 *                 type: string
 *                 example: "Updated description for the community."
 *               coverImgURL:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/updated-cover.jpg"
 *               logoImgURL:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/updated-logo.jpg"
 *     responses:
 *       200:
 *         description: Community updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Community"
 *       404:
 *         description: Community not found.
 *       500:
 *         description: Server error.
 */
app.put('/:id', validate(CommunitySchema), updateCommunity)
app.get('/', isAuthenticated, getCommunities)

export default app
