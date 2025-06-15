import { Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { QuizService } from '../services/quizService'
import { asyncHandler } from '../utils/asyncHandler'
import { ResponseHelper } from '../utils/responseHelper'

export const quizController = {
  createQuiz: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.claims!.id
    const data = req.body
    const quiz = await QuizService.createQuiz(userId, data)
    return res
      .status(201)
      .json(ResponseHelper.success('Quiz created successfully', quiz))
  }),

  getQuizById: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.claims!.id
      const id = +req.params.id
      if (isNaN(id)) {
        return res.status(400).json(ResponseHelper.error('Invalid quiz ID'))
      }
      const quiz = await QuizService.getQuizById(userId, id)
      return res
        .status(200)
        .json(ResponseHelper.success('Quiz retrieved successfully', quiz))
    },
  ),

  updateQuiz: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.claims!.id
    const id = +req.params.id
    if (isNaN(id)) {
      return res.status(400).json(ResponseHelper.error('Invalid quiz ID'))
    }
    const data = req.body
    const updatedQuiz = await QuizService.updateQuiz(userId, id, data)
    return res
      .status(200)
      .json(ResponseHelper.success('Quiz updated successfully', updatedQuiz))
  }),

  deleteQuiz: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.claims!.id
    const id = +req.params.id
    if (isNaN(id)) {
      return res.status(400).json(ResponseHelper.error('Invalid quiz ID'))
    }
    await QuizService.deleteQuiz(userId, id)
    return res
      .status(200)
      .json(ResponseHelper.success('Quiz deleted successfully'))
  }),

  getQuizzesByClassroom: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.claims!.id
      const classroomId = +req.params.classroomId
      if (isNaN(classroomId)) {
        return res
          .status(400)
          .json(ResponseHelper.error('Invalid classroom ID'))
      }
      const quizzes = await QuizService.getQuizzesByClassroom(
        userId,
        classroomId,
      )
      return res
        .status(200)
        .json(ResponseHelper.success('Quizzes retrieved successfully', quizzes))
    },
  ),

  getQuizzesByCommunity: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.claims!.id
      const communityId = +req.params.communityId
      if (isNaN(communityId)) {
        return res
          .status(400)
          .json(ResponseHelper.error('Invalid community ID'))
      }
      const quizzes = await QuizService.getQuizzesByCommunity(
        userId,
        communityId,
      )
      return res
        .status(200)
        .json(ResponseHelper.success('Quizzes retrieved successfully', quizzes))
    },
  ),
}
