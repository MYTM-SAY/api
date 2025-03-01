import { prisma } from '../db/PrismaClient';

export const CommentRepo = {
  async findAll(postId: number) {
    const results = await prisma.comment.findMany({
      where: {
        Post: {
          id: postId,
        },
      },
      include: {
        Author: {
          select: {
            username: true,
            UserProfile: {
              select: {
                profilePictureURL: true,
              },
            },
          },
        },
      },
    });
    return results;
  },

  async findComment(postId: number, commentId: number) {
    const result = await prisma.comment.findUnique({
      where: {
        id: commentId,
        Post: {
          id: postId,
        },
      },
      include: {
        Author: {
          select: {
            username: true,
            UserProfile: {
              select: {
                profilePictureURL: true,
              },
            },
          },
        },
      },
    });
    return result;
  },
};
