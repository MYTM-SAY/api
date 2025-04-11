import { z } from 'zod'
import { prisma } from '../db/PrismaClient'
import APIError from '../errors/APIError'
import { PostSchema, PostUpdateSchema } from '../utils/zod/postSchemes'

export const PostRepo = {
  async findPostsByForumId(forumId: number) {
    const results = await prisma.post.findMany({ where: { forumId } })
    return results
  },

  async findById(id: number) {
    const result = await prisma.post.findUnique({
      where: { id },
      include: {
    
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
              select: {profilePictureURL: true},
          },

        },
      },
    }})

    const { _count,Author ,...postData } = result as {
      _count: { Comments: number };
      Author: {
        id: number;
        username: string;
        fullname: string;

        UserProfile: {
          profilePictureURL: string;
        };
      };
      [key: string]: any;
    };
    const {UserProfile, ...rest_stuff} = Author

    const Authorfiltered = {
      ...rest_stuff,
      profilePictureURL: Author.UserProfile.profilePictureURL,
    }
    
  
    const result2 = {
      ...postData, Authorfiltered,
      commentsCount: _count.Comments,
    };


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

  // get all the posts wether they are upvoted or downvoted or posted or commented or commentvoteup or commentVoteDown  by the user
  async getAllContribByUserId(userId: number) {

    const result = await prisma.post.findMany({

      where: {  OR : [
        {authorId: userId},
        { PostVotes: { some: { userId } } },
        { Comments: { some: { authorId: userId } } },
        { Comments: { some: { CommentVotes: {some :{ userId }} } } },

      ] },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        PostVotes: {
          where: { userId },
          select: { count: true },
        },}

    });

    return result;
  },

}
