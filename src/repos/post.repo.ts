import { Prisma } from '@prisma/client'
import { prisma } from '../db/PrismaClient'
import { z } from 'zod'
import { PostSchema, PostUpdateSchema } from '../utils/zod/postSchemes'
import APIError from '../errors/APIError'

export const PostRepo = {
  async findPostsByForumId(forumId: number) {
    const results = await prisma.post.findMany({ where: { forumId } })
    return results
  },

  async findById(id: number) {
    const result = await prisma.post.findUnique({
      where: { id },
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

  async upVotePost(
    postId: number,
    forumId: number,
    communityId: number,
    userId: number,
  ) {
    let result

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        forumId,
        Forum: {
          communityId,
        },
      },
    })
    if (!post) throw new APIError('Post not found', 404)

    const existingVote = await prisma.postVote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    if (existingVote) {
      result = await prisma.postVote.update({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
        data: {
          count: {
            increment: 1,
          },
        },
      })
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          voteCounter: result.count,
        },
      })
    } else {
      result = await prisma.postVote.create({
        data: {
          userId,
          postId,
          count: 1,
        },
      })
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          voteCounter: result.count,
        },
      })
    }
    return result
  },

  async downVotePost(
    postId: number,
    forumId: number,
    communityId: number,
    userId: number,
  ) {
    let result

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        forumId,
        Forum: {
          communityId,
        },
      },
    })
    if (!post) throw new APIError('Post not found', 404)

    const existingVote = await prisma.postVote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    if (existingVote) {
      result = await prisma.postVote.update({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
        data: {
          count: {
            decrement: 1,
          },
        },
      })
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          voteCounter: result.count,
        },
      })
    } else {
      result = await prisma.postVote.create({
        data: {
          userId,
          postId,
          count: -1,
        },
      })
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          voteCounter: result.count,
        },
      })
    }
    return result
  },
}
