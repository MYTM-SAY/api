import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { asyncHandler } from '../utils/asyncHandler'
import { ResponseHelper } from '../utils/responseHelper'
import { Response } from 'express'
import { joinRequestSchema } from '../utils/zod/joinRequestSchema '
import { JoinRequestService } from '../services/joinRequestsService'
import APIError from '../errors/APIError'

export const createJoinRequstCommunity = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.claims!.id
    const communityId = +req.params.id

    if (!communityId || isNaN(communityId)) {
      throw new APIError('Invalid lesson ID', 400)
    }

    const joinRequest = await JoinRequestService.createJoinRequest({
      communityId: communityId,
      userId: userId,
    })

    if (!joinRequest)
      return res
        .status(201)
        .json(ResponseHelper.error('Joined community successfully'))

    return res
      .status(201)
      .json(
        ResponseHelper.success(
          'Join request created successfully',
          joinRequest,
        ),
      )
  },
)

export const getAllJoinRequests = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const communityId = +req.params.id
    if (!communityId || isNaN(communityId)) {
      throw new APIError('Invalid community ID', 400)
    }
    const joinRequests =
      await JoinRequestService.getAllPendingJoinRequests(communityId)

    return res
      .status(200)
      .json(
        ResponseHelper.success(
          'Join requests fetched successfully',
          joinRequests,
        ),
      )
  },
)
