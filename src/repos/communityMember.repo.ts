// import { Prisma } from '@prisma/client';
import { Prisma, Role } from '@prisma/client'
import { prisma } from '../db/PrismaClient'

export const CommunityMembersRepo = {
  async addUserToCommunity(data: Prisma.CommunityMembersUncheckedCreateInput) {
    const communities = await prisma.communityMembers.create({
      data,
    });
    
    return communities
  },
  async assignModRole(userId: number, communityId: number) {
    const communities = await prisma.communityMembers.update({
      where: { communityId_userId: { communityId, userId } },
      data: { Role: 'MODERATOR' },
    })
    return communities
  },

  async delete(userId: number, communityId: number) {
    const member = await prisma.communityMembers.delete({
      where: { communityId_userId: { communityId, userId } },
    })
    return member
  },


  async getUserRoleInCommunity(userId: number, communityId: number) {
    const member = await prisma.communityMembers.findUnique({
      where: { communityId_userId: { communityId, userId } },
      select: { Role: true },
    })
    return member?.Role || null
  },

  async getUsersInCommunity(communityId: number) {
    const members = await prisma.communityMembers.findMany({
      where: {
        communityId: communityId,
      },
      select: {
        User: {
          select: {
            id: true,
            fullname: true,
            email: true,
            UserProfile: {
              select: {
                profilePictureURL: true
              }
            },
            CommunityMembers:
            {
              where: { communityId },
              select: {
                Role: true
              }
            }

          },
        },
      },
    });
    return members;
  }


}
