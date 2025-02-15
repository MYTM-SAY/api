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
};
