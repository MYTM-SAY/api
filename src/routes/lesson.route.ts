import express from 'express'
import {
  getLessonsBySectionId,
  getLessonById,
  createLessonWithNewMaterial,
  deleteLesson,
  updateLesson,
} from '../controllers/lessonController'
import { isAuthenticated } from '../middlewares/authMiddleware'

const router = express.Router()

router.use(isAuthenticated)

/**
 * @swagger
 * /lessons/sections/{sectionId}:
 *   get:
 *     summary: Get all lessons by section ID
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the section to retrieve lessons for
 *     responses:
 *       200:
 *         description: Lessons retrieved successfully
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
 *                   example: "Lessons retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Invalid section ID
 *       500:
 *         description: Internal server error
 */
router.get('/sections/:sectionId', getLessonsBySectionId)

/**
 * @swagger
 * /lessons/{id}:
 *   get:
 *     summary: Get a single lesson by ID
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the lesson to retrieve
 *     responses:
 *       200:
 *         description: Lesson retrieved successfully
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
 *                   example: "Lesson retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Invalid lesson ID
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getLessonById)

/**
 * @swagger
 * /lessons:
 *   post:
 *     summary: Create a new lesson with new materials in a single operation
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lesson:
 *                 $ref: '#/components/schemas/CreateLessonInput'
 *               materials:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CreateMaterialInput'
 *     responses:
 *       201:
 *         description: Lesson created successfully
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
 *                   example: "Lesson created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/', createLessonWithNewMaterial)

/**
 * @swagger
 * /lessons/{id}:
 *   patch:
 *     summary: Update a lesson by ID
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the lesson to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLessonInput'
 *     responses:
 *       200:
 *         description: Lesson updated successfully
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
 *                   example: "Lesson updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Invalid lesson ID or input data
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', updateLesson)

/**
 * @swagger
 * /lessons/{id}:
 *   delete:
 *     summary: Delete a lesson by ID
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the lesson to delete
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
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
 *                   example: "Lesson deleted successfully"
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: Invalid lesson ID
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteLesson)

export default router