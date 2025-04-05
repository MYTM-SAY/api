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
import { hasRoles, isAuthenticated } from '../middlewares/authMiddleware'
import {
  createJoinRequstCommunity,
  getAllJoinRequests,
  updateJoinRequestStatus,
} from '../controllers/joinRequestsController'
import { Role } from '@prisma/client'

const app = express.Router()

/**
 * @swagger
 * /communities/discover:
 *   get:
 *     summary: Discover communities based on search term, tags, or popularity
 *     description: Retrieves a list of communities based on search criteria, recommended tags, or popularity.
 *     tags:
 *       - Communities
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *           nullable: true
 *         description: Optional search term to filter communities.
 *       - in: query
 *         name: tagIds
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: Optional list of tag IDs to filter communities.
 *     responses:
 *       200:
 *         description: Successfully retrieved communities.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   enum: [search, recommended, popular]
 *                   description: Type of result returned.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Community'
 *       500:
 *         description: Internal server error.
 */

app.get('/discover', discoverCommunities) // need revision
app.post('/:id/remove-moderator/:userId', isAuthenticated, demoteFromModerator) // done
app.post('/:id/assign-moderator/:userId', isAuthenticated, promoteToModerator) // done
/**
 * @swagger
 * /communities:
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
app.get('/', isAuthenticated, getCommunities)
/**
 * @swagger
 * /communities:
 *   post:
 *     summary: Create a new community
 * 
 *     description: Creates a new community with the provided details.
 * 
 *     tags: [Communities]
 * 
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
 * 
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

app.post('/', isAuthenticated, createCommunity)
/**
 * @swagger
 * /communities/{id}:
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
app.delete('/:id', isAuthenticated, deleteCommunity)
/**
 * @swagger
 * /communities/{id}:
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
 * /communities/{id}:
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
app.put('/:id', isAuthenticated, updateCommunity)
/**
 * @swagger
 * /communities/{id}/join-requests:
 *   post:
 *     summary: Create a join request for a community
 *     tags: [Communities]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the community the user wants to join
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       201:
 *         description: Join request created successfully
 *       400:
 *         description: Invalid data or request
 *       404:
 *         description: Community not found
 */
app.post('/:id/join-requests', isAuthenticated, createJoinRequstCommunity)
/**
 * @swagger
 * /communities/{id}/join-requests:
 *   get:
 *     summary: Get all pending join requests for a specific community
 *     tags: [Communities]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the community to get join requests for
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully fetched join requests
 *       400:
 *         description: Invalid community ID
 *       404:
 *         description: Community not found
 *       500:
 *         description: Internal server error
 */
app.get('/:id/join-requests', isAuthenticated, getAllJoinRequests)
/**
 * @swagger
 * /communities/join-requests/status:
 *   patch:
 *     summary: Update the status of a join request for a community
 *     tags: [Communities]
 *     requestBody:
 *       description: Status to update the join request to (APPROVED or REJECTED)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *                 example: APPROVED
 *               communityId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Successfully updated join request status
 *       400:
 *         description: Invalid data or request
 *       404:
 *         description: Join request not found
 *       500:
 *         description: Internal server error
 */
app.patch(
  '/join-requests/status',
  isAuthenticated,
  hasRoles([Role.OWNER]),
  updateJoinRequestStatus,
)

export default app
