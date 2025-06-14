import express from 'express'
import { isAuthenticated } from '../middlewares/authMiddleware'
import {
  CreateQuestion,
  DeleteQuestion,
  GetAllQuestions,
  ParseQuestionFile,
  UpdateQuestion,
} from '../controllers/questionController'
import multer from 'multer'
import { storage } from 'googleapis/build/src/apis/storage'
import { uploadFile } from '../middlewares/uploadMiddleware'

const router = express.Router()

/**
 * @swagger
 * /questions:
 *   post:
 *     tags: [Questions]
 *     summary: Create a new question
 *     description: Create a question with options and correct answers
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
 *         - type
 *       properties:
 *         questionHeader:
 *           type: string
 *           example: "What is 2+2?"
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           minItems: 2
 *           example: ["3", "4", "5"]
 *         answer:
 *           type: array
 *           items:
 *             type: string
 *           minItems: 1
 *           example: ["4"]
 *           description: Must be included in the options
 *         classroomId:
 *           type: integer
 *           example: 1
 *         type:
 *           type: string
 *           enum: [SINGLE, MULTI, TRUE_FALSE]
 *           example: SINGLE
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
/**
 * @swagger
 * /questions/bulk-questions/classrooms/{classroomId}:
 *   post:
 *     tags: [Questions]
 *     summary: Upload bulk questions via file for a classroom
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Questions uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid file or request
 *       401:
 *         description: Unauthorized
 */

router.post(
  '/bulk-questions/classrooms/:classroomId',
  uploadFile.single('file'),
  isAuthenticated,
  ParseQuestionFile,
)
export default router
