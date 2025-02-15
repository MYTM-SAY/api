import { Prisma } from '@prisma/client';
import { prisma } from '../db/PrismaClient';

export const CommentRepo = {
  async findAll() {
    const results = await prisma.comment.findMany({});
    return results;
  },

  async findById(id: number) {
    const result = await prisma.comment.findUnique({
      where: { id },
    });
    return result;
  },

  async create(comment: Prisma.CommentCreateInput) {
    const result = await prisma.comment.create({
      data: comment,
    });
    return result;
  },

  async update(id: number, comment: Prisma.CommentUpdateInput) {
    const result = await prisma.comment.update({
      where: { id },
      data: comment,
    });
    return result;
  },

  async delete(id: number) {
    const result = await prisma.comment.delete({
      where: { id },
    });
    return result;
  },
};
