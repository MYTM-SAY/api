// src/routes/lesson.route.ts
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
 *             example:
 *               success: true
 *               message: "Lessons retrieved successfully"
 *               data:
 *                 - id: 1
 *                   name: "Introduction to Prisma"
 *                   notes: "This lesson covers the basics of Prisma ORM."
 *                   materialId: 5
 *                   sectionId: 1
 *                   createdAt: "2023-10-01T10:00:00Z"
 *                   updatedAt: "2023-10-01T10:00:00Z"
 *                   Section:
 *                     id: 1
 *                     name: "Prisma Basics"
 *                     description: "An introduction to Prisma ORM."
 *                     isCompleted: false
 *                     classroomId: 1
 *                     createdAt: "2023-10-01T10:00:00Z"
 *                     updatedAt: "2023-10-01T10:00:00Z"
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
 *                   $ref: '#/components/schemas/LessonWithSection'
 *             example:
 *               success: true
 *               message: "Lesson retrieved successfully"
 *               data:
 *                 id: 2
 *                 name: "Advanced Algebra"
 *                 notes: "Exploring advanced algebraic concepts."
 *                 materialId: 10
 *                 sectionId: 1
 *                 createdAt: "2023-10-01T10:00:00Z"
 *                 updatedAt: "2023-10-01T10:00:00Z"
 *                 Section:
 *                   id: 1
 *                   name: "Mathematics Fundamentals"
 *                   description: "A comprehensive guide to foundational math topics."
 *                   isCompleted: true
 *                   classroomId: 1
 *                   createdAt: "2023-10-01T10:00:00Z"
 *                   updatedAt: "2023-10-01T10:00:00Z"
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
 *     summary: Create a new lesson with a new material in a single transaction
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
 *               material:
 *                 $ref: '#/components/schemas/CreateMaterialInput'
 *           example:
 *             lesson:
 *               name: "Intro to Algebra"
 *               notes: "Basic concepts"
 *               sectionId: 1
 *             material:
 *               materialType: "VIDEO"
 *               fileUrl: "https://example.com/video.mp4"
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
 *                   $ref: '#/components/schemas/LessonWithMaterial'
 *             example:
 *               success: true
 *               message: "Lesson created successfully"
 *               data:
 *                 id: 131
 *                 name: "Intro to Algebra"
 *                 notes: "Basic concepts"
 *                 materialId: 121
 *                 sectionId: 1
 *                 createdAt: "2023-10-01T10:00:00Z"
 *                 updatedAt: "2023-10-01T10:00:00Z"
 *                 Material:
 *                   id: 121
 *                   materialType: "VIDEO"
 *                   fileUrl: "https://example.com/video.mp4"
 *                   createdAt: "2023-10-01T10:00:00Z"
 *                   updatedAt: "2023-10-01T10:00:00Z"
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
 *           example:
 *             name: "Updated Lesson Name"
 *             notes: "Updated notes for this lesson."
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
 *             example:
 *               success: true
 *               message: "Lesson updated successfully"
 *               data:
 *                 id: 2
 *                 name: "Updated Lesson Name"
 *                 notes: "Updated notes for this lesson."
 *                 materialId: 10
 *                 sectionId: 1
 *                 createdAt: "2023-10-01T10:00:00Z"
 *                 updatedAt: "2023-10-02T12:00:00Z"
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
 *             example:
 *               success: true
 *               message: "Lesson deleted successfully"
 *       400:
 *         description: Invalid lesson ID
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteLesson)

export default router
