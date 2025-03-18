import { CommunityRepo } from '../repos/community.repo'
import { UserProfileRepo } from '../repos/userProfile.repo'
import { MemberRolesRepo } from '../repos/memberRoles.repo'
import APIError from '../errors/APIError'
import { z } from 'zod'
import { CommunitySchema } from '../utils/zod/communitySchemes'

async function getAllCommunities() {
  return CommunityRepo.findAll()
}

async function discoverCommunities(
  userId: number | null,
  searchTerm?: string,
  tagIds?: number[],
) {
  if (searchTerm || (tagIds && tagIds.length > 0)) {
    return {
      data: await CommunityRepo.searchCommunities(searchTerm as string, tagIds),
      type: 'search',
    }
  }

  if (userId) {
    const userProfile = await UserProfileRepo.findByUserId(userId)
    if (!userProfile) throw new APIError('User profile not found', 404)

    if (userProfile.Tags?.length > 0) {
      const userTagIds = userProfile.Tags.map((tag) => tag.id)
      return {
        data: await CommunityRepo.getRecommendedCommunities(userTagIds),
        type: 'recommended',
      }
    }
  }

  return { data: await CommunityRepo.getPopularCommunities(), type: 'popular' }
}

async function getCommunityById(id: number) {
  if (!id || isNaN(id)) throw new APIError('Invalid Community ID', 400)

  const community = await CommunityRepo.findById(id)
  if (!community) throw new APIError('Community not found', 404)

  return community
}

async function createCommunity(
  data: Omit<z.infer<typeof CommunitySchema>, 'id'>,
  userId: number,
) {
  const validatedData = await CommunitySchema.parseAsync(data)
  return CommunityRepo.create(validatedData, userId)
}

async function updateCommunity(
  communityId: number,
  userId: number,
  data: Omit<z.infer<typeof CommunitySchema>, 'id'>,
) {
  const validatedData = await CommunitySchema.parseAsync(data)

  if (!validatedData) throw new APIError('Invalid data', 400)
  const community = await CommunityRepo.findById(communityId)

  if (!community) throw new APIError('Community not found', 404)
  return CommunityRepo.update(communityId, data)
}

async function deleteCommunity(communityId: number, userId: number) {
  console.log(communityId, userId)
  const community = await CommunityRepo.findById(communityId)

  if (!community) throw new APIError('Community not found', 404)

  await CommunityRepo.delete(communityId)
}

export const CommunityService = {
  getAllCommunities,
  discoverCommunities,
  getCommunityById,
  createCommunity,
  updateCommunity,
  deleteCommunity,
}
