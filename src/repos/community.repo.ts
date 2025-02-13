import { prisma } from '../db/PrismaClient';

export const CommunityRepo = {
  async findAll() {
    const communities = await prisma.community.findMany({
      include: {
        Classrooms: true,
      },
    });

    return communities;
  },

  async findCommunity(id: number) {
    const community = await prisma.community.findUniqueOrThrow({
      where :{ id },
      include:{
        Members: true,
      },
    });
    return community;
  },
};
