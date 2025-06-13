// make get reminder route
import express from 'express'
import {
  getRemindersForJoinedCommunities
} from '../controllers/reminderController'
import { isAuthenticated } from '../middlewares/authMiddleware'

const router = express.Router()


/**
 * @swagger
 * /reminders:
 *   get:
 *     summary: Fetches reminders for communities the user has joined
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched reminders
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
 *                   example: "Reminders fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 7
 *                       title:
 *                         type: string
 *                         example: "Community Meeting Tomorrow"
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-02T19:43:02.054Z"
 *                       communityId:
 *                         type: integer
 *                         example: 12
 *                       communityName:
 *                         type: string
 *                         example: "Local Book Club"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
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
 *                   example: "Authentication required"
 *       403:
 *         description: Forbidden - User doesn't have permission to access reminders
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
 *                   example: "Insufficient permissions"
 *       404:
 *         description: No reminders found for joined communities
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
 *                   example: "No reminders found"
 *                 data:
 *                   type: array
 *                   example: []
 */
router.get('/', isAuthenticated, getRemindersForJoinedCommunities);
export default router
