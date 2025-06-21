import { Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { QuestionService } from '../services/questionService'
import { ResponseHelper } from '../utils/responseHelper'
import { QuizService } from '../services/quizService'

export const getQuestionsByQuizId = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.claims!.id
    const quizId = Number(req.params.quizId)

    const result = await QuestionService.getQuestionsByQuizId(quizId, userId)

    return res
      .status(200)
      .json(
        ResponseHelper.success('Quiz questions retrieved successfully', result),
      )
  },
)

export const startQuizAttempt = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.claims!.id
    const quizId = Number(req.params.quizId)
    const result = await QuizService.startAttempt(userId, quizId)

    return res
      .status(201)
      .json(ResponseHelper.success('Quiz attempt started', result))
  },
)

export const endQuizAttempt = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.claims!.id
    const quizId = Number(req.params.quizId)

    const result = await QuizService.endAttempt(req.body, userId, quizId)

    return res
      .status(200)
      .json(ResponseHelper.success('Quiz attempt ended', result))
  },
)

export const submitQuiz = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.claims!.id
    const quizId = Number(req.params.quizId)
    const result = await QuizService.submitQuiz(req.body, userId, quizId)

    return res
      .status(200)
      .json(ResponseHelper.success('Quiz attempt submited', result))
  },
)
