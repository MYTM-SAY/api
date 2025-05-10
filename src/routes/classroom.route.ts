import express from 'express'
import {
  getClassrooms as getClassroomsByCommunityId,
  getClassroom,
  createClassroom,
  deleteClassroom,
  updateClassroom,
} from '../controllers/classroomController'
import {
  hasRoles,
  isAuthenticated,
  isJoined,
} from '../middlewares/authMiddleware'
import { Role } from '@prisma/client'

const router = express.Router()
/**
 * @swagger
 * /classrooms/communities/{id}:
 *   get:
 *     summary: Get all classrooms by community ID
 *     tags: [Classrooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The community ID
 *     responses:
 *       200:
 *         description: List of all classrooms in the specified community
 */
router.get(
  '/communities/:id',
  isAuthenticated,
  getClassroomsByCommunityId,
)
/**
 * @swagger
 * /classrooms/{id}:
 *   get:
 *     summary: Get a specific classroom by ID
 *     tags: [Classrooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: section
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Whether to include the section relation
 *       - in: query
 *         name: lesson
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Whether to include the lesson relation
 *     responses:
 *       200:
 *         description: Returns the requested classroom
 *       400:
 *         description: Invalid query parameters
 *       404:
 *         description: Classroom not found
 */
router.get('/:id', isAuthenticated, getClassroom)
/**
 * @swagger
 * /classrooms:
 *   post:
 *     summary: Create a new classroom
 *     description: Adds a new classroom to the database.
 *     tags:
 *       - Classrooms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Math 101"
 *               description:
 *                 type: string
 *                 example: "Basic math class"
 *               coverImg:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               communityId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Classroom created successfully
 */
router.post(
  '/',
  isAuthenticated,
  createClassroom,
)
/**
 * @swagger
 * /classrooms/{id}:
 *   delete:
 *     summary: Delete a classroom
 *     tags: [Classrooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Classroom deleted successfully
 *       404:
 *         description: Classroom not found
 */
router.delete('/:id', isAuthenticated, deleteClassroom)
/**
 * @swagger
 * /classrooms/{id}:
 *   put:
 *     summary: Update a classroom
 *     tags: [Classrooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Math 101"
 *               description:
 *                 type: string
 *                 example: "Basic math class"
 *               coverImg:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Classroom updated successfully
 *       404:
 *         description: Classroom not found
 */
router.put('/:id', isAuthenticated, updateClassroom)

export default router
