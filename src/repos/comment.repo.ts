import { z } from 'zod'
import { prisma } from '../db/PrismaClient'
import APIError from '../errors/APIError'
import { CommentSchema } from '../utils/zod/commentSchemes'

export const CommentRepo = {
  async findAll(postId: number) {
    const results = await prisma.comment.findMany({
      where: {
        Post: {
          id: postId,
        },
        parentId: null,
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
        Children: true,
      },
    })
    return results
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
        Children: true,
      },
    })
    return result
  },

  async findCommentById(commentId: number) {
    const result = await prisma.comment.findUnique({
      where: {
        id: commentId,
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
        Children: true,
      },
    })
    return result
  },

  async createComment(data: z.infer<typeof CommentSchema>) {
    const result = await prisma.comment.create({
      data: {
        ...data,
        authorId: data.authorId!,
      },
    })
    return result
  },

  async updateComment(
    commentId: number,
    data: Partial<z.infer<typeof CommentSchema>>,
  ) {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    })
    if (!comment) throw new APIError('Comment not found', 404)
    const result = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data,
    })
    return result
  },

  async getCommentsByUserIdAndCommunityId(userId: number, communityId: number) {
    const comments = await prisma.comment.findMany({
      where: {
        authorId: userId,
        Post: {
          Forum: {
            communityId: communityId,
          },
        },
      },
      select: {
        id: true,
        content: true,
        postId: true,
        createdAt: true,
      },
    })

    return comments
  },

  async deleteComment(commentId: number) {
    const result = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    })

    return result
  },

  async upVoteComment(commentId: number, userId: number) {
    let result

    result = await prisma.commentVote.upsert({
      where: {
        userId_commentId: { userId, commentId },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        userId,
        commentId,
        count: 1,
      },
    })

    return result
  },

  async downVoteComment(commentId: number, userId: number) {
    let result

    result = await prisma.commentVote.upsert({
      where: {
        userId_commentId: { userId, commentId },
      },
      update: {
        count: { decrement: 1 },
      },
      create: {
        userId,
        commentId,
        count: 1,
      },
    })

    return result
  },
}
