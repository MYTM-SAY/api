import { z } from 'zod'
import { prisma } from '../db/PrismaClient'
import { PostSchema, PostUpdateSchema } from '../utils/zod/postSchemes'

export const PostRepo = {
  async findPostsByForumId(forumId: number) {
    // may need changes in the future ISA
    const results = await prisma.post.findMany({
      where: { forumId },
      select: {
        id: true,
        title: true,
        content: true,
        voteCounter: true,         
        attachments: true,       
        forumId: true,              
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { Comments: true }, 
        },
        Author: {
          select: {
            id: true,
            username: true,
            fullname: true,
            UserProfile: {
              select: { profilePictureURL: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return results
  },
  async findById(id: number) {
    const result = await prisma.post.findUnique({

      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        voteCounter: true,         
        attachments: true,       
        forumId: true,              
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { Comments: true }, 
        },
        Author: {
          select: {
            id: true,
            username: true,
            fullname: true,
            UserProfile: {
              select: { profilePictureURL: true },
            },
          },
        },
      },
    
    })
    return result
  },

  async create(post: z.infer<typeof PostSchema>, authorId: number) {
    const result = await prisma.post.create({
      data: { ...post, authorId },
    })
    return result
  },

  async update(id: number, post: z.infer<typeof PostUpdateSchema>) {
    const result = await prisma.post.update({
      where: { id },
      data: post,
    })
    return result
  },

  async delete(id: number) {
    const result = await prisma.post.delete({
      where: { id },
    })
    return result
  },

  async upVotePost(postId: number, userId: number) {
    let result

    result = await prisma.postVote.upsert({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      update: { count: { increment: 1 } },
      create: { userId, postId, count: 1 },
    })

    return result
  },

  async downVotePost(postId: number, userId: number) {
    let result

    result = await prisma.postVote.upsert({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      update: { count: { decrement: 1 } },
      create: { userId, postId, count: -1 },
    })

    return result
  },

  async getAllContribByUserId(userId: number) {
    const results = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: userId },
          { PostVotes: { some: { userId } } },
          { Comments: { some: { authorId: userId } } },
          { Comments: { some: { CommentVotes: { some: { userId } } } } },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        voteCounter: true,         
        attachments: true,       
        forumId: true,              
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { Comments: true }, 
        },
        Author: {
          select: {
            id: true,
            username: true,
            fullname: true,
            email: true,
            UserProfile: {
              select: { profilePictureURL: true },
            },
          },
        },

      },
    })

    return results
  },
}
