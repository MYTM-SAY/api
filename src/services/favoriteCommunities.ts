import { FavoriteCommunityRepo } from '../repos/favoriteCommunities.repo'
import { CommunityRepo } from '../repos/community.repo'
import APIError from '../errors/APIError'

export const FavoriteCommunityService = {
  async toggleFavoriteCommunity(userId: number, communityId: number) {
    const communityExists = await CommunityRepo.findById(communityId)
    if (!communityExists) {
      throw new APIError('Community not found', 404)
    }

    const isFavorited = await FavoriteCommunityRepo.isCommunityFavorited(
      userId,
      communityId,
    )
    if (isFavorited) {
      await FavoriteCommunityRepo.removeFavoriteCommunity(userId, communityId)
      return { action: 'removed' }
    } else {
      const favorite = await FavoriteCommunityRepo.addFavoriteCommunity(
        userId,
        communityId,
      )
      return { action: 'added', favorite }
    }
  },

  async getFavoriteCommunities(userId: number) {
    return FavoriteCommunityRepo.getFavoriteCommunities(userId)
  },
}
