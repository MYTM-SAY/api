import express from 'express'
import {
  createLesson,
  deleteLesson,
  getLesson,
  getLessons,
  updateLesson,
} from '../controllers/lessonController'
import {
  hasCommunityRoleOrHigher,
  isAuthenticated,
} from '../middlewares/authTesting'

const router = express.Router()

router.use(isAuthenticated)
/**
 * @swagger
 * /api/v1/lessons/:
 *   get:
 *     summary: Get all lessons
 *     description: Fetches all lessons.
 *     tags: [Lessons]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of lessons.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *             example:
 *               - id: 1
 *                 name: "Introduction to Programming"
 *                 notes: "This is an introductory lesson."
 *                 materialId: 1
 *                 sectionId: 1
 *                 createdAt: "2023-01-01T00:00:00Z"
 *                 updatedAt: "2023-01-01T00:00:00Z"
 *                 Section:
 *                   id: 1
 *                   name: "Programming Basics"
 *       500:
 *         description: Server error.
 */
router.get('/', getLessons)

/**
 * @swagger
 * /api/v1/lessons/{id}:
 *   get:
 *     summary: Get a single lesson
 *     description: Fetches details of a specific lesson by its ID.
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the lesson to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved lesson.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *             example:
 *               id: 1
 *               name: "Introduction to Programming"
 *               notes: "This is an introductory lesson."
 *               materialId: 1
 *               sectionId: 1
 *               createdAt: "2023-01-01T00:00:00Z"
 *               updatedAt: "2023-01-01T00:00:00Z"
 *               Section:
 *                 id: 1
 *                 name: "Programming Basics"
 *       404:
 *         description: Lesson not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id', getLesson)

// Owner-only routes
router.use(hasCommunityRoleOrHigher(['OWNER']))
/**
 * @swagger
 * /api/v1/lessons/:
 *   post:
 *     summary: Create a new lesson
 *     description: Creates a new lesson. Requires owner role.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LessonCreate'
 *           example:
 *             name: "Advanced Programming"
 *             notes: "This lesson covers advanced topics."
 *             materialId: 2
 *             sectionId: 2
 *     responses:
 *       201:
 *         description: Lesson created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 lesson:
 *                   $ref: '#/components/schemas/Lesson'
 *             example:
 *               message: "Lesson created successfully"
 *               lesson:
 *                 id: 2
 *                 name: "Advanced Programming"
 *                 notes: "This lesson covers advanced topics."
 *                 materialId: 2
 *                 sectionId: 2
 *                 createdAt: "2023-01-02T00:00:00Z"
 *                 updatedAt: "2023-01-02T00:00:00Z"
 *       400:
 *         description: Validation failed or invalid data
 *       500:
 *         description: Server error.
 */
router.post('/', createLesson)

/**
 * @swagger
 * /api/v1/lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     description: Deletes a specific lesson by its ID.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the lesson to delete.
 *     responses:
 *       204:
 *         description: Lesson deleted successfully.
 *       404:
 *         description: Lesson not found.
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error.
 */
router.delete('/:id', deleteLesson)

/**
 * @swagger
 * /api/v1/lessons/{id}:
 *   patch:
 *     summary: Update a lesson
 *     description: Updates a specific lesson by its ID.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the lesson to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LessonUpdate'
 *           example:
 *             name: "Advanced Programming Updated"
 *             notes: "Updated notes for advanced topics."
 *     responses:
 *       200:
 *         description: Lesson updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 lesson:
 *                   $ref: '#/components/schemas/Lesson'
 *             example:
 *               message: "Lesson updated successfully"
 *               lesson:
 *                 id: 2
 *                 name: "Advanced Programming Updated"
 *                 notes: "Updated notes for advanced topics."
 *                 materialId: 2
 *                 sectionId: 2
 *                 createdAt: "2023-01-02T00:00:00Z"
 *                 updatedAt: "2023-01-02T00:00:00Z"
 *       404:
 *         description: Lesson not found.
 *       400:
 *         description: Validation failed or invalid data
 *       500:
 *         description: Server error.
 */
router.patch('/:id', updateLesson)

export default router