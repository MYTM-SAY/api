import { prisma } from '../db/PrismaClient'

export const FavoriteCommunityRepo = {
  async addFavoriteCommunity(userId: number, communityId: number) {
    return prisma.favoriteCommunities.create({
      data: {
        userId,
        communityId,
      },
    })
  },

  async removeFavoriteCommunity(userId: number, communityId: number) {
    await prisma.favoriteCommunities.delete({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    })
  },

  async getFavoriteCommunities(userId: number) {
    return prisma.favoriteCommunities.findMany({
      where: { userId },
      include: {
        Community: {
          select: {
            id: true,
            name: true,
            description: true,
            bio: true,
            coverImgURL: true,
            logoImgURL: true,
            isPublic: true,
            createdAt: true,
          },
        },
      },
    })
  },

  async isCommunityFavorited(userId: number, communityId: number) {
    const favorite = await prisma.favoriteCommunities.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    })
    return !!favorite
  },
}
