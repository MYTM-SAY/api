import express from 'express'
import { isAuthenticated } from '../middlewares/authMiddleware'
import {
  CreateQuestion,
  DeleteQuestion,
  GetAllQuestions,
  UpdateQuestion,
} from '../controllers/questionController'

const router = express.Router()

/**
 * @swagger
 * /questions:
 *   post:
 *     tags: [Questions]
 *     summary: Create a new question
 *     description: Create a question with options and correct answer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionInput'
 *     responses:
 *       201:
 *         description: Question created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * components:
 *   schemas:
 *     QuestionInput:
 *       type: object
 *       required:
 *         - questionHeader
 *         - options
 *         - answer
 *         - classroomId
 *       properties:
 *         questionHeader:
 *           type: string
 *           example: "What is 2+2?"
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           example: ["3", "4", "5"]
 *         answer:
 *           type: string
 *           example: "4"
 *         classroomId:
 *           type: integer
 *           example: 1
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Question created successfully"
 *         data:
 *           $ref: '#/components/schemas/QuestionInput'
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/', isAuthenticated, CreateQuestion)
/**
 * @swagger
 * /questions/{id}:
 *   put:
 *     tags: [Questions]
 *     summary: Update a question
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionInput'
 *     responses:
 *       200:
 *         description: Question updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 */
router.put('/:id', isAuthenticated, UpdateQuestion)
/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     tags: [Questions]
 *     summary: Delete a question
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question
 *     responses:
 *       200:
 *         description: Question deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 */
router.delete('/:id', isAuthenticated, DeleteQuestion)
/**
 * @swagger
 * /questions/classrooms/{classroomId}:
 *   get:
 *     tags: [Questions]
 *     summary: Get all questions for a classroom
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the classroom
 *     responses:
 *       200:
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/classrooms/:classroomId', isAuthenticated, GetAllQuestions)
export default router
