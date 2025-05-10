import { Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { SectionService } from '../services/sectionService'
import { ResponseHelper } from '../utils/responseHelper'
import { asyncHandler } from '../utils/asyncHandler'
import APIError from '../errors/APIError'
import {
  CreateSectionSchema,
  UpdateSectionSchema,
} from '../utils/zod/sectionSchemes'

export const getSectionsByClassroomId = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const classroomId = +req.params.classroomId
    if (!classroomId || isNaN(classroomId)) {
      throw new APIError('Invalid classroom ID', 400)
    }

    const sections = await SectionService.getSectionsByClassroomId(classroomId, req.claims!.id)
    return res
      .status(200)
      .json(ResponseHelper.success('Sections retrieved successfully', sections))
  },
)

export const getSectionById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = +req.params.id
    if (!id || isNaN(id)) {
      throw new APIError('Invalid section ID', 400)
    }

    const section = await SectionService.getSectionById(id, req.claims!.id)
    return res
      .status(200)
      .json(ResponseHelper.success('Section retrieved successfully', section))
  },
)

export const createSection = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const validatedData = CreateSectionSchema.parse(req.body)

    const newSection = await SectionService.createSection(validatedData, req.claims!.id)
    return res
      .status(201)
      .json(ResponseHelper.success('Section created successfully', newSection))
  },
)

export const deleteSection = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = +req.params.id
    if (!id || isNaN(id)) {
      throw new APIError('Invalid section ID', 400)
    }

    await SectionService.deleteSection(id, req.claims!.id)
    return res
      .status(200)
      .json(ResponseHelper.success('Section deleted successfully'))
  },
)

export const updateSection = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = +req.params.id
    if (!id || isNaN(id)) {
      throw new APIError('Invalid section ID', 400)
    }
    const validatedUpdateData = UpdateSectionSchema.parse(req.body)
    const updatedSection = await SectionService.updateSection(
      id,
      req.claims!.id,
      validatedUpdateData,
    )

    return res
      .status(200)
      .json(
        ResponseHelper.success('Section updated successfully', updatedSection),
      )
  },
)
