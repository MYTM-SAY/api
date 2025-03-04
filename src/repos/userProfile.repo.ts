import { prisma } from '../db/PrismaClient';

export const UserProfileRepo = {
  async findByUserId(userId: number) {
    const result = await prisma.userProfile.findUnique({
      where: { userId },
      select: { Tags: true },
    });
    return result;
  },
}; 