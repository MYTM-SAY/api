import { CommunityRepo } from '../repos/community.repo'
import { UserProfileRepo } from '../repos/userProfile.repo'
import APIError from '../errors/APIError'
import { z } from 'zod'
import { CommunitySchema } from '../utils/zod/communitySchemes'
import { ForumRepo } from '../repos/forum.repo'
import { CommunityMembersRepo } from '../repos/communityMember.repo'
import { JoinRequestStatus, Role } from '@prisma/client'
import { JoinRequestRepo } from '../repos/JoinRequestRepo '

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

async function getCommunityById(communityId: number, userId: number) {
  validateCommunityId(communityId)

  const community = await CommunityRepo.findById(communityId)
  if (!community) throw new APIError('Community not found', 404)

  const forumId = getForumId(community)
  const membersCount = await CommunityRepo.getAllUsersInACommunity(communityId)
  const onlineMembers =
    await CommunityRepo.getAllOnlineUsersInACommunity(communityId)
  const role = await CommunityMembersRepo.getUserRoleInCommunity(
    userId,
    communityId,
  )

  const response = {
    ...omitForums(community),
    forumId,
    membersCount,
    onlineMembers,
    role,
  }
  let isPendingRequest = false
  if (role === null) {
    const joinRequest = await JoinRequestRepo.findByCommunityAndUser(
      communityId,
      userId,
    )
    if (joinRequest?.status === JoinRequestStatus.PENDING) {
      isPendingRequest = true
    }
  }

  return { ...response, isPendingRequest }
}

function validateCommunityId(id: number) {
  if (!id || isNaN(id)) throw new APIError('Invalid Community ID', 400)
}

function getForumId(community: any) {
  return community.Forums?.[0]?.id ?? null
}

function omitForums(community: any) {
  const { Forums, ...rest } = community
  return rest
}

async function createDefaultForumForCommuinity(communityId: number) {
  const forum = await ForumRepo.create(
    {
      title: 'Default Forum',
      description: 'Default Forum Description',
    },
    communityId,
  )

  return forum
}

async function createCommunity(
  data: Omit<z.infer<typeof CommunitySchema>, 'id'>,
  userId: number,
) {
  const validatedData = await CommunitySchema.parseAsync(data)
  const createCommunity = await CommunityRepo.create(validatedData, userId)
  await CommunityMembersRepo.addUserToCommunity({
    communityId: createCommunity.id,
    userId: userId,
    Role: Role.OWNER,
  })
  const defaultForum = await createDefaultForumForCommuinity(createCommunity.id)

  if (!defaultForum) throw new APIError('Default Forum not found', 404)
  return createCommunity
}

async function updateCommunity(
  communityId: number,
  userId: number,
  data: Omit<z.infer<typeof CommunitySchema>, 'id'>,
) {
  const validatedData = await CommunitySchema.partial().parse(data)
  if (!validatedData) throw new APIError('Invalid data', 400)

  const role = await CommunityMembersRepo.getUserRoleInCommunity(
    userId,
    communityId,
  )
  if (role != Role.OWNER) throw new APIError('You must be an Owner to edit it')

  const community = await CommunityRepo.findById(communityId)
  if (!community) throw new APIError('Community not found', 404)

  return CommunityRepo.update(communityId, validatedData)
}

async function deleteCommunity(communityId: number, userId: number) {
  const community = await CommunityRepo.findById(communityId)
  if (!community) throw new APIError('Community not found', 404)

  const role = await CommunityMembersRepo.getUserRoleInCommunity(
    userId,
    communityId,
  )
  if (role != Role.OWNER) throw new APIError('You must be an Owner to edit it')

  await CommunityRepo.delete(communityId)
}

async function getJoinedCommunities(userId: number) {
  if (!userId || isNaN(userId)) throw new APIError('Invalid User ID', 400)
  const joinedCommunities = await CommunityRepo.joinedCommunities(userId)
  if (!joinedCommunities) throw new APIError('No communities found', 404)

  // Transform and remove _count from the response
  const formattedCommunities = joinedCommunities.map(({ Role, Community }) => {
    const { _count, ...rest } = Community
    return {
      Role,
      Community: {
        ...rest,
        MembersCount: _count?.CommunityMembers ?? 0,
      },
    }
  })
  return formattedCommunities
}

async function getAllUsersInACommunity(id: number) {
  const community = await CommunityRepo.findById(id)
  if (!community) throw new APIError('Community not found', 404)

  const usersCount = await CommunityRepo.getAllUsersInACommunity(id)
  return usersCount
}

async function getAllOnlineUsersInACommunity(id: number) {
  const community = await CommunityRepo.findById(id)
  if (!community) throw new APIError('Community not found', 404)

  const usersCount = await CommunityRepo.getAllOnlineUsersInACommunity(id)
  return usersCount
}

export const CommunityService = {
  getAllCommunities,
  discoverCommunities,
  getCommunityById,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  getJoinedCommunities,
  getAllUsersInACommunity,
  getAllOnlineUsersInACommunity,
}
