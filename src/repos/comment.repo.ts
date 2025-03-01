import { prisma } from '../db/PrismaClient';

export const CommentRepo = {
  async findAll(postId: number) {
    const results = await prisma.comment.findMany({
      where : {
        Post: {
          id: postId,
        },
      },
      include:{
        Author: {
          select:{
            username: true,
          },
        },
      },
    });
    return results;
  },
};
