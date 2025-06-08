import { JoinRequestStatus, Prisma, Role } from '@prisma/client'
import { prisma } from '../db/PrismaClient'
import { JoinRequestType } from '../utils/zod/joinRequestSchema '

export const JoinRequestRepo = {
  async findAllPendingByCommunityId(
    communityId: number,
    status: JoinRequestStatus,
  ) {
    return await prisma.joinRequest.findMany({
      where: {
        status: status,
        communityId: communityId,
      },
    })
  },

  async create(joinRequest: JoinRequestType) {
    return await prisma.joinRequest.create({
      data: joinRequest,
    })
  },

  async findById(id: number) {
    return await prisma.joinRequest.findUnique({
      where: { id },
      include: {
        User: true,
        Community: true,
      },
    })
  },

  async findByUser(userId: number) {
    return await prisma.joinRequest.findMany({
      where: { userId },
      include: { Community: true },
    })
  },

  async findByCommunity(communityId: number) {
    return await prisma.joinRequest.findMany({
      where: { communityId },
      include: { User: true },
    })
  },

  async delete(id: number) {
    return await prisma.joinRequest.delete({
      where: { id },
    })
  },

  async findByCommunityAndUser(communityId: number, userId: number) {
    return await prisma.joinRequest.findFirst({
      where: {
        communityId,
        userId,
      },
    })
  },

  async updateStatus(
    id: number,
    status: JoinRequestStatus,
  ) {
    return await prisma.joinRequest.update({
      where: {
        id,
      },
      data: {
        status: status,
      },
    })
  },
}
