import express from 'express'
import {
  discoverCommunities,
  getCommunities,
  createCommunity,
  deleteCommunity,
  updateCommunity,
  getCommunity,
  getAllUsersInACommunity,
  getAllOnlineUsersInACommunity
} from '../controllers/communityController'
import { hasRoles, isAuthenticated } from '../middlewares/authMiddleware'
import {
  createJoinRequstCommunity,
  getAllJoinRequests,
  updateJoinRequestStatus,
} from '../controllers/joinRequestsController'
import { Role } from '@prisma/client'
import { getUsersInCommunity, removeUserInCommunity } from '../controllers/communityMemberController'

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
 *               bio:
 *                 type: string
 *                 maxLength: 200
 *                 example: "We are a passionate group of tech enthusiasts sharing knowledge and collaborating on innovative projects."
 *               coverImgURL:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/cover.jpg"
 *               logoImgURL:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/logo.jpg"
 *               Tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["javascript", "backend", "cloud"]
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
 *     summary: Retrieve a community by ID
 *     description: Returns details of a specific community, including its forum and posts, based on the provided community ID.
 *     tags: [Communities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the community to retrieve
 *     responses:
 *       200:
 *         description: Community retrieved successfully
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
 *                   $ref: '#/components/schemas/Community'
 *       404:
 *         description: Community not found
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
 *                   type: 'null'
 *               required:
 *                 - success
 *                 - message
 *                 - data
 *             example:
 *               success: false
 *               message: Community not found
 *               data: null
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
 *               bio:
 *                 type: string
 *                 maxLength: 200
 *                 example: "Updated bio for the community, within 200 characters."
 *               coverImgURL:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/updated-cover.jpg"
 *               logoImgURL:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/updated-logo.jpg"
 *               Tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["javascript", "backend", "cloud"]
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
/**
 * @swagger
 * /communities/{id}/users:
 *   get:
 *     summary: Get users in a specific community
 *     tags: [Communities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the community
 *     responses:
 *       200:
 *         description: List of users in the community
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       403:
 *         description: Access denied
 *       404:
 *         description: Community not found
 *       500:
 *         description: Internal server error
 */
app.get('/:id/users', isAuthenticated, getUsersInCommunity)
/**
 * @swagger
 * /communities/{communityId}/users/{userId}:
 *   delete:
 *     summary: Remove a user from a community
 *     tags: [Communities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the community
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to remove from the community
 *     responses:
 *       200:
 *         description: User successfully removed from the community
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
 *                   example: User removed from community successfully
 *       400:
 *         description: Invalid input or user not in community
 *       403:
 *         description: Access denied
 *       404:
 *         description: Community or user not found
 *       500:
 *         description: Internal server error
 */

app.delete('/:communityId/users/:userId', isAuthenticated, removeUserInCommunity)



/**
 * @swagger
 * /communities/{communityId}/users-count:
 *   get:
 *     summary: Get number of users in a specific community
 *     description: Returns the total count of users who are members of the given community.
 *     tags: [Communities]
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the community to count users for.
 *     responses:
 *       200:
 *         description: Successfully retrieved user count.
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
 *                   example: Community members fetched successfully
 *                 data:
 *                   type: integer
 *                   example: 42
 *       404:
 *         description: Community not found.
 *       500:
 *         description: Server error.
 */
app.get('/:communityId/users-count', getAllUsersInACommunity);

/**
 * @swagger
 * /communities/{communityId}/online-users-count:
 *   get:
 *     summary: Get the count of users online in a specific community
 *     description: Returns the count of users who have logged in within the last 3 minutes in the given community.
 *     tags:
 *       - Communities
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the community to check online users for.
 *     responses:
 *       200:
 *         description: Successfully retrieved the count of online users in the community.
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
 *                   example: Community online members fetched successfully
 *                 data:
 *                   type: integer
 *                   example: 5  # This is an example of the number of online users
 *       404:
 *         description: Community not found.
 *       500:
 *         description: Internal server error.
 */
app.get('/:communityId/online-users-count', getAllOnlineUsersInACommunity);


export default app
