import { prisma } from '../db/PrismaClient';

export const CommentRepo = {
  async findAll() {
    const results = await prisma.comment.findMany({});
    return results;
  },
};
