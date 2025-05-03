import { z } from 'zod'
import { prisma } from '../db/PrismaClient'
import { PostSchema, PostUpdateSchema } from '../utils/zod/postSchemes'
import { VoteType } from '@prisma/client'

export const PostRepo = {
  async findPostsByForumId(forumId: number) {
    // Fetch posts with additional details for each post
    const results = await prisma.post.findMany({
      where: { forumId },
      include: {
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
    })

    const transformedResults = results.map((result) => {
      const { _count, Author, ...postData } = result as {
        _count: { Comments: number }
        Author: {
          id: number
          username: string
          fullname: string
          UserProfile: {
            profilePictureURL: string
          }
        }
        [key: string]: any
      }

      const { UserProfile, ...authorProps } = Author

      const Authorfiltered = {
        ...authorProps,
        profilePictureURL: UserProfile.profilePictureURL,
      }

      return {
        ...postData,
        Authorfiltered,
        commentsCount: _count.Comments,
      }
    })

    return transformedResults
  },

  async findById(id: number) {
    const result = await prisma.post.findUnique({
      where: { id },
      include: {
        Comments: {},
        _count: {
          select: {
            Comments: true,
          },
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

    const { _count, Author, ...postData } = result as {
      _count: { Comments: number }
      Author: {
        id: number
        username: string
        fullname: string

        UserProfile: {
          profilePictureURL: string
        }
      }
      [key: string]: any
    }
    const { UserProfile, ...RestProfileData } = Author

    const Authorfiltered = {
      ...RestProfileData,
      profilePictureURL: Author.UserProfile.profilePictureURL,
    }

    const result2 = {
      ...postData,
      Authorfiltered,
      commentsCount: _count.Comments,
    }

    return result2
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

  async votedBefore(postId: number, userId: number) {
    const result = await prisma.postVote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })
    return result
  },
  async upVotePost(postId: number, userId: number, voteType: VoteType, by:number) {
    let result
    let post = await prisma.post.findUnique({
      where: { id: postId },
    })
    let voteCounter = post?.voteCounter || 0
    result = await prisma.postVote.upsert({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      update: { count: { increment: by }, type: voteType },
      create: { userId, postId, count: voteCounter + by, type: voteType },
    })
    await prisma.post.update({
      where: { id: postId },
      data: { voteCounter: voteCounter + by },
    })
    return result
  },

  async downVotePost(postId: number, userId: number, voteType: VoteType, by: number) {
    let result
    let post = await prisma.post.findUnique({
      where: { id: postId },
    })
    let voteCounter = post?.voteCounter || 0
    result = await prisma.postVote.upsert({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      update: { count: { decrement: by }, type: voteType },
      create: { userId, postId, count: voteCounter - by, type: voteType },
    })
    await prisma.post.update({
      where: { id: postId },
      data: { voteCounter: voteCounter - by },
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
      include: {
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
        PostVotes: {
          where: { userId },
          select: { count: true },
        },
      },
    })

    const transformedResults = results.map((result) => {
      // Destructure the post result to get _count, Author, and PostVotes
      const { _count, Author, PostVotes, ...postData } = result as {
        _count: { Comments: number }
        Author: {
          id: number
          username: string
          fullname: string
          email: string
          UserProfile: { profilePictureURL: string }
        }
        PostVotes: { count: number }[]
        [key: string]: any
      }

      const { UserProfile, ...authorRest } = Author

      const Authorfiltered = {
        ...authorRest,
        profilePictureURL: UserProfile?.profilePictureURL,
      }

      const votesCount = PostVotes.length > 0 ? PostVotes[0].count : 0

      return {
        ...postData,
        Authorfiltered,
        commentsCount: _count.Comments,
        votesCount,
      }
    })

    return transformedResults
  },
}
