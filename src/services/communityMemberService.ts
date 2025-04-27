import APIError from '../errors/APIError'
import { CommunityMembersRepo } from '../repos/communityMember.repo'
import { asyncHandler } from '../utils/asyncHandler'

async function getUserRoleInCommunity(userId: number, communityId: number) {
  const user = await CommunityMembersRepo.findUser(userId)
  const community = await CommunityMembersRepo.findCommunity(communityId)
  if (!user) throw new APIError('User not found', 404)
  if (!community) throw new APIError('Community not found', 404)

  const memberRole = await CommunityMembersRepo.getUserRoleInCommunity(
    userId,
    communityId,
  )
  return memberRole
}

export const CommunityMemberService = {
  getUserRoleInCommunity,
}
