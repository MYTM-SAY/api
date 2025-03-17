import { NextFunction, Request, Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { LeaderBoardService } from '../services/leaderBoardService'
import { ResponseHelper } from '../utils/responseHelper'
import { asyncHandler } from '../utils/asyncHandler'

export const getTopTenByScore = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await LeaderBoardService.getTopTenByScore(+req.params.communityId)
    res
      .status(200)
      .json(
        ResponseHelper.success('Top 10 students fetched successfully', result),
      )
  },
)
