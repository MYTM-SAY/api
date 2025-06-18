import { JoinRequestRepo } from '../repos/JoinRequestRepo '
import { CommunityRepo } from '../repos/community.repo'
import APIError from '../errors/APIError'
import {
  JoinRequestType,
  UpdateJoinRequestType,
} from '../utils/zod/joinRequestSchema '
import { CommunityMembersRepo } from '../repos/communityMember.repo'
import { JoinRequestStatus, Role } from '@prisma/client'
import { UserRepo } from '../repos/user.repo'

async function getAllPendingJoinRequests(communityId: number) {
  console.log('communityId', communityId)
  return JoinRequestRepo.findAllPendingByCommunityId(
    communityId,
    JoinRequestStatus.PENDING,
  )
}

async function createJoinRequest(data: JoinRequestType) {
  //userId: from token
  const community = await CommunityRepo.findById(data.communityId)

  if (!community) throw new APIError('Community not found', 404)

  if (community.isPublic) {
    const isMember = await CommunityMembersRepo.getUserRoleInCommunity(
      data.userId,
      data.communityId,
    )

    if (isMember) throw new APIError('Already a member of this community', 409)
    const CommunityMembers = await CommunityMembersRepo.addUserToCommunity({
      userId: data.userId,
      communityId: data.communityId,
      Role: Role.MEMBER,
    })
    return null
  }
  const isSentRequest = await JoinRequestRepo.findByUserAndCommunity(
    data.userId,
    data.communityId,
  )
  if (isSentRequest?.status === JoinRequestStatus.REJECTED)
    throw new APIError('Join request already rejected', 400)
  if (isSentRequest) throw new APIError('Join request already sent', 400)

  return JoinRequestRepo.create(data)
}

async function updateJoinRequestStatus(
  updateJoinRequestType: UpdateJoinRequestType,
  id: number,
  userId: number,
) {
  const { status } = updateJoinRequestType

  const existingRequest = await JoinRequestRepo.findById(id)

  if (!existingRequest) throw new APIError('Join request not found', 404)

  const userRole = await CommunityMembersRepo.getUserRoleInCommunity(
    userId,
    existingRequest.communityId,
  )
  if (userRole !== Role.MODERATOR && userRole !== Role.OWNER) {
    throw new APIError('You do not have permission to update this request', 403)
  }

  const updatedRequest = await JoinRequestRepo.updateStatus(id, status)

  if (status === 'APPROVED') {
    // Check if the user is already a member of the community
    const isAlreadyMember = await CommunityMembersRepo.getUserRoleInCommunity(
      existingRequest.userId,
      existingRequest.communityId,
    )
    if (isAlreadyMember) {
      throw new APIError('User is already a member of this community', 400)
    }
    if (!isAlreadyMember) {
      // Only add the user if they are not already a member
      await CommunityMembersRepo.addUserToCommunity({
        userId: existingRequest.userId,
        communityId: existingRequest.communityId,
        Role: Role.MEMBER,
      })
    }
  }

  return updatedRequest
}
export const JoinRequestService = {
  getAllPendingJoinRequests,
  createJoinRequest,
  updateJoinRequestStatus,
}
