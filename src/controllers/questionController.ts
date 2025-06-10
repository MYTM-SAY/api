import { Request, Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { asyncHandler } from '../utils/asyncHandler'
import { ResponseHelper } from '../utils/responseHelper'
import { QuestionService } from '../services/questionService'
export const CreateQuestion = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const question = await QuestionService.createQuestion(
      req.body,
      req.claims!.id,
    )
    return res
      .status(201)
      .json(ResponseHelper.success('users fetched successfully', question))
  },
)

export const GetAllQuestions = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const questions = await QuestionService.getAllQuestions(
      parseInt(req.params.classroomId),
      req.claims!.id,
    )
    return res
      .status(200)
      .json(ResponseHelper.success('Questions fetched successfully', questions))
  },
)

export const UpdateQuestion = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const question = await QuestionService.updateQuestion(
      parseInt(req.params.id),
      req.body,
      req.claims!.id,
    )
    return res
      .status(200)
      .json(ResponseHelper.success('Question updated successfully', question))
  },
)

export const DeleteQuestion = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    await QuestionService.deleteQuestion(
      parseInt(req.params.id),
      req.claims!.id,
    )
    return res
      .status(204)
      .json(ResponseHelper.success('Question deleted successfully', null))
  },
)
