import express from 'express'
import {
  modifiedLessons,
  updatedProgress,
} from '../controllers/progressBarController'

const router = express.Router()
/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Endpoints for managing lesson status and progress tracking
 */

/**
 * @swagger
 * /progress/change-lesson-status/{communityId}/{classroomId}/{lessonId}/{userId}:
 *   post:
 *     summary: Toggle lesson completion status
 *     tags: [Progress]
 *     description: Marks a lesson as completed or reverts it to incomplete for a given user.
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the community
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the classroom
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the lesson
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully updated lesson status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server error
 */
router.post(
  '/change-lesson-status/:communityId/:classroomId/:lessonId/:userId',
  modifiedLessons,
)
/**
 * @swagger
 * /progress/update-progress/{communityId}/{classroomId}/{userId}:
 *   post:
 *     summary: Update user's classroom progress
 *     tags: [Progress]
 *     description: Calculates and updates the user's progress for a given classroom.
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the community
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the classroom
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully updated classroom progress
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     progress:
 *                       type: integer
 *                       description: The user's progress percentage
 *       404:
 *         description: Classroom not found
 *       500:
 *         description: Server error
 */

router.post(
  '/update-progress/:communityId/:classroomId/:userId',
  updatedProgress,
)

export default router
