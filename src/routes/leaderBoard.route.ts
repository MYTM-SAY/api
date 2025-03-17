import express from 'express'
import { getTopTenByScore } from '../controllers/leaderBoardController'

const app = express.Router()

/**
 * @swagger
 * /leaderboard/quiz-score/{communityId}:
 *   get:
 *     summary: Get the top 10 students by score
 *     description: Retrieves the top 10 students based on quiz scores within a specific community.
 *     tags:
 *       - Leaderboard
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the community to fetch leaderboard data from.
 *     responses:
 *       200:
 *         description: Successfully retrieved top 10 students
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
 *                   example: "Top 10 students fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: "john_doe"
 *                       fullname:
 *                         type: string
 *                         example: "John Doe"
 *                       score:
 *                         type: integer
 *                         example: 95
 *       400:
 *         description: Invalid community ID
 *       500:
 *         description: Server error
 */
app.get('/quiz-score/:communityId', getTopTenByScore)

export default app
