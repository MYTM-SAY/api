import { Request, Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { CommunityService } from '../services/communityService'
import { asyncHandler } from '../utils/asyncHandler'
import { ResponseHelper } from '../utils/responseHelper'

export const getCommunities = asyncHandler(
  async (_: Request, res: Response) => {
    const communities = await CommunityService.getAllCommunities()
    res
      .status(200)
      .json(
        ResponseHelper.success(
          'Communities retrieved successfully',
          communities,
        ),
      )
  },
)

export const discoverCommunities = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { searchTerm, tagIds } = req.query
    const tagIdsArray: number[] = tagIds
      ? tagIds.toString().split(',').map(Number)
      : []
    const userId = req.claims?.id || null

    const communities = await CommunityService.discoverCommunities(
      userId,
      searchTerm as string,
      tagIdsArray,
    )
    res
      .status(200)
      .json(
        ResponseHelper.success(
          'Communities discovered successfully',
          communities,
        ),
      )
  },
)

export const getCommunity = asyncHandler(
  async (req: Request, res: Response) => {
    const community = await CommunityService.getCommunityById(+req.params.id)
    res
      .status(200)
      .json(
        ResponseHelper.success('Community retrieved successfully', community),
      )
  },
)

export const createCommunity = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const newCommunity = await CommunityService.createCommunity(
      req.body,
      req.claims!.id,
    )
    res
      .status(201)
      .json(
        ResponseHelper.success('Community created successfully', newCommunity),
      )
  },
)

export const updateCommunity = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const updatedCommunity = await CommunityService.updateCommunity(
      +req.params.id,
      req.claims!.id,
      req.body,
    )
    res
      .status(200)
      .json(
        ResponseHelper.success(
          'Community updated successfully',
          updatedCommunity,
        ),
      )
  },
)

export const deleteCommunity = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    await CommunityService.deleteCommunity(+req.params.id, req.claims!.id)
    res.status(204).end()
  },
)
