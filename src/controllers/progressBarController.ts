import { NextFunction, Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { ProgressBarService } from '../services/progressBarService'
import { ResponseHelper } from '../utils/responseHelper'
import { asyncHandler } from '../utils/asyncHandler'
import { progressBarRepo } from '../repos/progressBar.repo'

export const modifiedLessons = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const lesson = await ProgressBarService.changeLessonStatus(
      +req.params.communityId,
      +req.params.classroomId,
      +req.params.lessonId,
      +req.params.userId,
    )

    res
      .status(200)
      .json(
        ResponseHelper.success('Lesson status updated successfully', lesson),
      )
  },
)

export const updatedProgress = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const updatedClassroomProgress =
      await ProgressBarService.updateClassroomProgress(
        +req.params.communityId,
        +req.params.classroomId,
        +req.params.userId,
      )

    res
      .status(200)
      .json(
        ResponseHelper.success(
          'Progress updated successfully',
          updatedClassroomProgress,
        ),
      )
  },
)
