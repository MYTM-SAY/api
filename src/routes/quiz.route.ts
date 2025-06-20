import express from 'express'
import { quizController } from '../controllers/quizController'
import { isAuthenticated } from '../middlewares/authMiddleware'
import validate from '../middlewares/validation'
import {
  CreateQuizWithQuestionsSchema,
  UpdateQuizSchema,
} from '../utils/zod/quizSchemes'
import {
  endQuizAttempt,
  getQuestionsByQuizId,
  startQuizAttempt,
  submitQuiz,
} from '../controllers/quizAttemptController'
import {
  EndQuizAttemptSchema,
  QuizAttemptedSchema,
  submitQuizSchema,
} from '../utils/zod/quizAttemptSchemes'

const router = express.Router()

router.use(isAuthenticated)

/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Create a new quiz with questions
 *     description: Creates a new quiz in the specified classroom, ensuring its time slot does not overlap with other quizzes. Includes associated questions with points. Requires OWNER or MODERATOR role in the community.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuizWithQuestionsInput'
 *     responses:
 *       201:
 *         description: Quiz created successfully
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
 *                   example: "Quiz created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Invalid input data or question IDs
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
 *                   example: "Invalid question IDs: 999. Questions either don't exist or don't belong to this classroom."
 *       403:
 *         description: Unauthorized to create quiz
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
 *                   example: "Unauthorized to modify quiz in this classroom"
 *       404:
 *         description: Classroom not found
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
 *                   example: "Classroom not found"
 *       409:
 *         description: Quiz time overlaps with an existing quiz
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
 *                   example: "Quiz time overlaps with an existing quiz in this classroom"
 *       500:
 *         description: Internal server error
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
 *                   example: "Internal server error"
 */
router.post(
  '/',
  validate(CreateQuizWithQuestionsSchema),
  quizController.createQuiz,
)

/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Get a quiz by ID
 *     description: Retrieves a specific quiz by its ID, including its associated questions. Requires user to be a member of the community.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the quiz to retrieve
 *     responses:
 *       200:
 *         description: Quiz retrieved successfully
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
 *                   example: "Quiz retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Invalid quiz ID
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
 *                   example: "Invalid quiz ID"
 *       403:
 *         description: Unauthorized to view quiz
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
 *                   example: "Unauthorized to view quizzes in this classroom"
 *       404:
 *         description: Quiz not found
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
 *                   example: "Quiz not found"
 *       500:
 *         description: Internal server error
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
 *                   example: "Internal server error"
 */
router.get('/:id', quizController.getQuizById)

/**
 * @swagger
 * /quizzes/{id}:
 *   patch:
 *     summary: Update a quiz
 *     description: Updates an existing quiz, optionally replacing its associated questions. Ensures the new time slot does not overlap with other quizzes. Requires OWNER or MODERATOR role in the community.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the quiz to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQuizInput'
 *     responses:
 *       200:
 *         description: Quiz updated successfully
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
 *                   example: "Quiz updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Invalid quiz ID or input data
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
 *                   example: "Invalid question IDs: 999. Questions either don't exist or don't belong to this classroom."
 *       403:
 *         description: Unauthorized to update quiz
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
 *                   example: "Unauthorized to modify quiz in this classroom"
 *       404:
 *         description: Quiz or classroom not found
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
 *                   example: "Quiz not found"
 *       409:
 *         description: New quiz time overlaps with an existing quiz
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
 *                   example: "Quiz time overlaps with an existing quiz in this classroom"
 *       500:
 *         description: Internal server error
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
 *                   example: "Internal server error"
 */
router.patch('/:id', validate(UpdateQuizSchema), quizController.updateQuiz)

/**
 * @swagger
 * /quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     description: Deletes a quiz by its ID. Requires OWNER or MODERATOR role in the community.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the quiz to delete
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
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
 *                   example: "Quiz deleted successfully"
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: Invalid quiz ID
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
 *                   example: "Invalid quiz ID"
 *       403:
 *         description: Unauthorized to delete quiz
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
 *                   example: "Unauthorized to modify quiz in this classroom"
 *       404:
 *         description: Quiz or classroom not found
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
 *                   example: "Quiz not found"
 *       500:
 *         description: Internal server error
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
 *                   example: "Internal server error"
 */
router.delete('/:id', quizController.deleteQuiz)

/**
 * @swagger
 * /quizzes/classroom/{classroomId}:
 *   get:
 *     summary: Get all quizzes for a classroom
 *     description: Retrieves all quizzes associated with a specific classroom, ordered by start date. Does not include associated questions. Requires user to be a member of the community.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the classroom to retrieve quizzes for
 *     responses:
 *       200:
 *         description: Quizzes retrieved successfully
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
 *                   example: "Quizzes retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuizWithoutQuestions'
 *       400:
 *         description: Invalid classroom ID
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
 *                   example: "Invalid classroom ID"
 *       403:
 *         description: Unauthorized to view quizzes
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
 *                   example: "Unauthorized to view quizzes in this classroom"
 *       404:
 *         description: Classroom not found
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
 *                   example: "Classroom not found"
 *       500:
 *         description: Internal server error
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
 *                   example: "Internal server error"
 */
router.get('/classroom/:classroomId', quizController.getQuizzesByClassroom)

/**
 * @swagger
 * /quizzes/community/{communityId}:
 *   get:
 *     summary: Get all quizzes for a community
 *     description: Retrieves all quizzes associated with a specific community, ordered by start date. Does not include associated questions. Requires user to be a member of the community.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the community to retrieve quizzes for
 *     responses:
 *       200:
 *         description: Quizzes retrieved successfully
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
 *                   example: "Quizzes retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuizWithoutQuestions'
 */
router.get('/community/:communityId', quizController.getQuizzesByCommunity)
/**
 * @swagger
 * /quizzes/{quizId}/quiz-questions:
 *   get:
 *     summary: Get quiz questions by quiz ID
 *     description: Returns the list of questions for a quiz along with an "attempted" flag to indicate if the user has already started it.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the quiz to retrieve questions for
 *     responses:
 *       200:
 *         description: Quiz questions retrieved successfully
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
 *                   example: "Quiz questions retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     attempted:
 *                       type: boolean
 *                       example: false
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           questionHeader:
 *                             type: string
 *                             nullable: true
 *                           options:
 *                             type: array
 *                             items:
 *                               type: string
 *                           type:
 *                             type: string
 *                             enum: [SINGLE, MULTI, TRUE_FALSE]
 *                           quizQuestionId:
 *                             type: integer
 *                           points:
 *                             type: integer
 */

router.get('/:quizId/quiz-questions', isAuthenticated, getQuestionsByQuizId)
/**
 * @swagger
 * /quizzes/{quizId}/start:
 *   post:
 *     summary: Start a quiz attempt
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: quizId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the quiz to start
 *     responses:
 *       201:
 *         description: Quiz attempt started
 *       403:
 *         description: Quiz cannot be started (already started or out of time)
 *       404:
 *         description: Quiz not found
 */
router.post('/:quizId/start', isAuthenticated, startQuizAttempt)
/**
 * @swagger
 * /quizzes/{quizId}/submit:
 *   post:
 *     summary: End a quiz attempt
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: quizId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the quiz to end
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                       example: 42
 *                     answer:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["A", "C"]
 *     responses:
 *       200:
 *         description: Quiz attempt ended
 *       403:
 *         description: Cannot end quiz (not in progress or time expired)
 *       404:
 *         description: Attempt not found
 */
router.post('/:quizId/submit', isAuthenticated, endQuizAttempt)

/**
 * @swagger
 * /quizzes/{quizId}/submit-quiz:
 *   post:
 *     summary: Submit a completed quiz (validate + store answers)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: quizId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the quiz to submit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                     answer:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       200:
 *         description: Quiz submitted successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Unauthorized or forbidden
 */
router.post(
  '/:quizId/submit-quiz',
  validate(submitQuizSchema),
  isAuthenticated,
  submitQuiz,
)
export default router
