import { Role } from '@prisma/client'
import APIError from '../errors/APIError'
import { CommunityRepo } from '../repos/community.repo'
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

async function getAllMods(communityId: number) {
  const isExists = await CommunityMembersRepo.findCommunity(communityId)

  if (!isExists) throw new APIError('Community not found', 404)
  return await CommunityMembersRepo.getAllMods(communityId)
}

async function LeaveFromCommunity(userId: number, communityId: number) {
  console.log('LeaveFromCommunity called with:', userId, communityId);

  // Check if community exists
  const community = await CommunityRepo.findById(communityId);
  if (!community) throw new APIError('Community not found', 404);

  // Check if user is a member and their role
  const member = await CommunityMembersRepo.findByUserIdAndCommunityId(userId, communityId);
  if (!member) {
    return { message: 'You are not a member of this community' };
  }

  // Prevent owner from leaving
  if (member.Role === Role.OWNER) {
    throw new APIError('You cannot leave a community if you are the owner', 403);
  }

  // Delete the membership
  await CommunityMembersRepo.delete(userId, communityId);
  return { message: 'You have left the community successfully' };
}
export const CommunityMemberService = {
  getUserRoleInCommunity,
  getAllMods,
  LeaveFromCommunity,
}
