// import { Prisma } from '@prisma/client';
import { Prisma, Role } from '@prisma/client'
import { prisma } from '../db/PrismaClient'

export const MemberRolesRepo = {
  async addUserToCommunity(data: Prisma.CommunityMembersUncheckedCreateInput) {
    const communities = await prisma.communityMembers.create({
      data,
    })
    return communities
  },
  async assignModRole(userId: number, communityId: number) {
    const communities = await prisma.communityMembers.update({
      where: { communityId_userId: { communityId, userId } },
      data: { Role: 'MODERATOR' },
    })
    return communities
  },

  async removeModRole(userId: number, communityId: number) {
    const communities = await prisma.communityMembers.update({
      where: { communityId_userId: { communityId, userId } },
      data: { Role: 'MEMBER' },
    })
    return communities
  },

  async getUserRoleInCommunity(userId: number, communityId: number) {
    const member = await prisma.communityMembers.findUnique({
      where: { communityId_userId: { communityId, userId } },
      select: { Role: true },
    })
    return member?.Role || null
  },

  async hasAnyCommunityRole(userId: number, communityId: number) {
    return !!(await this.getUserRoleInCommunity(userId, communityId))
  },

  async hasCommunityRoleOrHigher(userId: number, communityId: number) {
    return (await this.getUserRoleInCommunity(userId, communityId)) === 'MEMBER'
  },

  async isCommunityOwner(userId: number, communityId: number) {
    return (await this.getUserRoleInCommunity(userId, communityId)) === 'OWNER'
  },

  async isCommunityMod(userId: number, communityId: number) {
    return (
      (await this.getUserRoleInCommunity(userId, communityId)) === 'MODERATOR'
    )
  },
}
