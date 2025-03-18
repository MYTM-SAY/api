import { Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { ClassroomService } from '../services/classroomService'
import { ResponseHelper } from '../utils/responseHelper'
import { asyncHandler } from '../utils/asyncHandler'
import { CommunityRepo } from '../repos/community.repo'
import APIError from '../errors/APIError'

export const getClassrooms = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = +req.params.id
    const community = await CommunityRepo.findById(id)

    if (!community) throw new APIError('Community not found', 404)

    const classrooms = await ClassroomService.getClassroomsByCommunityId(id)
    res
      .status(200)
      .json(
        ResponseHelper.success('Classrooms retrieved successfully', classrooms),
      )
  },
)

export const getClassroom = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const classroom = await ClassroomService.getClassroomById(+req.params.id)
    res
      .status(200)
      .json(
        ResponseHelper.success('Classroom retrieved successfully', classroom),
      )
  },
)

export const createClassroom = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const newClassroom = await ClassroomService.createClassroom(req.body)
    res
      .status(201)
      .json(
        ResponseHelper.success('Classroom created successfully', newClassroom),
      )
  },
)

export const deleteClassroom = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    await ClassroomService.deleteClassroom(+req.params.id)
    res
      .status(200)
      .json(ResponseHelper.success('Classroom deleted successfully'))
  },
)

export const updateClassroom = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const updatedClassroom = await ClassroomService.updateClassroom(
      +req.params.id,
      req.body,
    )
    res
      .status(200)
      .json(
        ResponseHelper.success(
          'Classroom updated successfully',
          updatedClassroom,
        ),
      )
  },
)
