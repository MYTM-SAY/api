import { Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { LessonService } from '../services/lessonService'
import { ResponseHelper } from '../utils/responseHelper'
import { asyncHandler } from '../utils/asyncHandler'
import APIError from '../errors/APIError'
import {
  CreateLessonSchema,
  UpdateLessonSchema,
} from '../utils/zod/lessonSchema'
import { CreateMaterialSchema } from '../utils/zod/materialSchemes'

export const getLessonsBySectionId = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const sectionId = +req.params.sectionId
    if (!sectionId || isNaN(sectionId)) {
      throw new APIError('Invalid section ID', 400)
    }

    const lessons = await LessonService.getLessonsBySectionId(sectionId)
    return res
      .status(200)
      .json(ResponseHelper.success('Lessons retrieved successfully', lessons))
  },
)

export const getLessonById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = +req.params.id
    if (!id || isNaN(id)) {
      throw new APIError('Invalid lesson ID', 400)
    }

    const lesson = await LessonService.getLessonById(id)
    return res
      .status(200)
      .json(ResponseHelper.success('Lesson retrieved successfully', lesson))
  },
)

export const createLessonWithNewMaterial = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const validatedLessonData = CreateLessonSchema.parse(req.body.lesson)
    const validatedMaterialData = CreateMaterialSchema.parse(req.body.material)

    const newLesson = await LessonService.createLessonWithNewMaterial(
      validatedLessonData,
      validatedMaterialData,
    )

    return res
      .status(201)
      .json(ResponseHelper.success('Lesson created successfully', newLesson))
  },
)

export const deleteLesson = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = +req.params.id
    if (!id || isNaN(id)) {
      throw new APIError('Invalid lesson ID', 400)
    }

    await LessonService.deleteLesson(id)
    return res
      .status(200)
      .json(ResponseHelper.success('Lesson deleted successfully'))
  },
)

export const updateLesson = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = +req.params.id
    if (!id || isNaN(id)) {
      throw new APIError('Invalid lesson ID', 400)
    }

    const validatedUpdateData = UpdateLessonSchema.parse(req.body)

    const updatedLesson = await LessonService.updateLesson(
      id,
      validatedUpdateData,
    )
    return res
      .status(200)
      .json(
        ResponseHelper.success('Lesson updated successfully', updatedLesson),
      )
  },
)
