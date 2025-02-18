import { prisma } from '../db/PrismaClient';

export const UserProfileRepo = {
  async findByUserId(userId: number) {
    // Fetch the user's tag IDs
    const result = await prisma.userProfile.findUnique({
      where: { userId },
      select: { Tags: true },
    });
    return result;
  },
};
