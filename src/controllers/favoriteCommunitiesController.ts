import { Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { FavoriteCommunityService } from '../services/favoriteCommunities'
import { asyncHandler } from '../utils/asyncHandler'
import { ResponseHelper } from '../utils/responseHelper'

export const toggleFavoriteCommunity = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.claims!.id

    const communityId = Number(req.params.communityId)
    if (isNaN(communityId)) {
      return res.status(400).json(ResponseHelper.error('Invalid communityId'))
    }

    const result = await FavoriteCommunityService.toggleFavoriteCommunity(
      userId,
      communityId,
    )
    const message =
      result.action === 'added'
        ? 'Community added to favorites'
        : 'Community removed from favorites'
    return res
      .status(result.action === 'added' ? 201 : 200)
      .json(ResponseHelper.success(message, result.favorite))
  },
)

export const getFavoriteCommunities = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.claims!.id
    const favorites =
      await FavoriteCommunityService.getFavoriteCommunities(userId)
    return res
      .status(200)
      .json(ResponseHelper.success('Favorite communities retrieved', favorites))
  },
)
