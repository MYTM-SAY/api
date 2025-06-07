import { Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { ClassroomService } from '../services/classroomService'
import { ResponseHelper } from '../utils/responseHelper'
import { asyncHandler } from '../utils/asyncHandler'
import { CommunityRepo } from '../repos/community.repo'
import APIError from '../errors/APIError'
import { ParsedQs } from 'qs'
import { querySchema } from '../utils'
import { Role } from '@prisma/client'
import { CommunityMemberService } from '../services/communityMemberService'
import { CommunityMembersRepo } from '../repos/communityMember.repo'
import { ClassroomRepo } from '../repos/classroom.repo'

export const getClassrooms = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const classrooms = await ClassroomService.getClassroomsByCommunityId(
      +req.params.id,
      req.claims!.id,
    )
    res
      .status(200)
      .json(
        ResponseHelper.success('Classrooms retrieved successfully', classrooms),
      )
  },
)

export const getClassroom = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const includes = await querySchema.parseAsync(req.query)
    const classroom = await ClassroomService.getClassroomById(
      +req.params.id,
      includes,
    )

    res
      .status(200)
      .json(
        ResponseHelper.success('Classroom retrieved successfully', classroom),
      )
  },
)

export const createClassroom = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const newClassroom = await ClassroomService.createClassroom(
      req.body,
      req.claims!.id,
    )

    res
      .status(201)
      .json(
        ResponseHelper.success('Classroom created successfully', newClassroom),
      )
  },
)

export const deleteClassroom = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    await ClassroomService.deleteClassroom(+req.params.id, req.claims!.id)

    res
      .status(200)
      .json(ResponseHelper.success('Classroom deleted successfully'))
  },
)

export const updateClassroom = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const updatedClassroom = await ClassroomService.updateClassroom(
      +req.params.id,
      req.claims!.id,
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

export const classroomProgress = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const progress = await ClassroomService.classroomProgress(
      +req.params.id,
      +req.claims!.id,
    )
    res
      .status(200)
      .json(
        ResponseHelper.success(
          'Classroom progress retrieved successfuly',
          progress,
        ),
      )
  },
)
