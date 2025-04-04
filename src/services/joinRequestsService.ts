import { JoinRequestRepo } from '../repos/JoinRequestRepo '
import { CommunityRepo } from '../repos/community.repo'
import APIError from '../errors/APIError'
import {
  JoinRequestType,
  UpdateJoinRequestType,
} from '../utils/zod/joinRequestSchema '
import { MemberRolesRepo } from '../repos/memberRoles.repo'
import { JoinRequestStatus, Role } from '@prisma/client'

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
    const isMember = await MemberRolesRepo.getUserRoleInCommunity(
      data.userId,
      data.communityId,
    )
    if (isMember) throw new APIError('Already a member of this community', 400)
    const CommunityMembers = await MemberRolesRepo.addUserToCommunity({
      userId: data.userId,
      communityId: data.communityId,
      Role: Role.MEMBER,
    })
    return null
  }
  const isSentRequest = await JoinRequestRepo.findById(data.userId)
  if (isSentRequest) throw new APIError('Join request already sent', 400)

  return JoinRequestRepo.create(data)
}

async function updateJoinRequestStatus(
  updateJoinRequestType: UpdateJoinRequestType,
  userId: number,
) {
  const { communityId, status } = updateJoinRequestType

  const existingRequest = await JoinRequestRepo.findByCommunityAndUser(
    communityId,
    userId,
  )

  if (!existingRequest) throw new APIError('Join request not found', 404)

  const updatedRequest = await JoinRequestRepo.updateStatus(
    communityId,
    userId,
    status,
  )
  return updatedRequest
}
export const JoinRequestService = {
  getAllPendingJoinRequests,
  createJoinRequest,
  updateJoinRequestStatus,
}
