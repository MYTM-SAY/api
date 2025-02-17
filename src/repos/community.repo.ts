import { Prisma } from '@prisma/client';
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

  async create(community: Prisma.CommunityCreateInput) {
    const result = await prisma.community.create({
      data: community,
    });
    return result;
  },

  async findById(id: number) {
    const result = await prisma.community.findUnique({
      where: { id },
    });
    return result;
  },

  async update(id: number, post: Prisma.CommunityUpdateInput) {
    const result = await prisma.community.update({
      where: { id },
      data: post,
    });
    return result;
  },

  async delete(id: number) {
    const result = await prisma.community.delete({
      where: { id },
    });
    return result;
  },
};
