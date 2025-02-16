import { prisma } from '../db/PrismaClient';

export const CommunityRepo = {
  async findAll() {
    const results = await prisma.community.findMany({
      include: {
        Classrooms: true,
      },
    });
    return results;
  },

  async getRecommendedCommunities(userId: number) {
    // Fetch the user's tag IDs
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
      select: {
        Tags: { select: { id: true } },
      },
    });

    if (!userProfile || !userProfile.Tags.length) {
      // Fallback: Return popular communities if the user has no tags
      return this.getPopularCommunities();
    }
    const userTagIds = userProfile.Tags.map((tag) => tag.id);

    // Query communities that share any of the user's tags
    const recommendedCommunities = await prisma.community.findMany({
      where: {
        Tags: {
          some: {
            id: { in: userTagIds },
          },
        },
      },
      include: { Tags: true },
    });
    return recommendedCommunities;
  },

  // Get popular communities (fallback if user has no tags).
  async getPopularCommunities() {
    return prisma.community.findMany({
      orderBy: [{ Members: { _count: 'desc' } }, { createdAt: 'desc' }],
      include: {
        Tags: true,
        Owner: true,
      },
    });
  },

  // Search by Name and Tags (if tags sended if not search by name only)
  async searchCommunities(name: string = '', tagIds: number[] = []) {
    if (!name && tagIds.length === 0) return this.getPopularCommunities();
    return prisma.community.findMany({
      where: {
        OR: [
          { name: { contains: name, mode: 'insensitive' } },
          { description: { contains: name, mode: 'insensitive' } },
        ],
        ...(tagIds && tagIds.length > 0
          ? { Tags: { some: { id: { in: tagIds } } } }
          : {}),
      },
      include: {
        Tags: true,
        Owner: true,
      },
    });
  },
};
