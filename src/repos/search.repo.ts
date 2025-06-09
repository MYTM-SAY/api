import { prisma } from "../db/PrismaClient";

export const SearchRepo = {
  async searchCommunities(searchTerm: string, tagNames?: string[]) {
    return prisma.community.findMany({
      where: {
        name: {
          contains: searchTerm.trim(), // Sanitize input
          mode: 'insensitive',
        },
        ...(tagNames?.length
          ? {
              Tags: {
                some: {
                  name: { in: tagNames }, // Filter by tag names
                },
              },
            }
          : {}),
      },
      include: {
        Tags: true,
      },
    });
  },

  async searchUsers(searchTerm: string) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: searchTerm.trim(), mode: 'insensitive' } },
          { fullname: { contains: searchTerm.trim(), mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        UserProfile: {
          select: {
            profilePictureURL: true,
          },
        },
      },
    });
  
return users.map(user => ({
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    profilePictureURL: user.UserProfile?.profilePictureURL ?? null,
  }));
  },
};