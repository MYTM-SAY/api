import { z } from 'zod'
import { prisma } from '../db/PrismaClient'
import APIError from '../errors/APIError'
import { CommentSchema } from '../utils/zod/commentSchemes'
import { count } from 'console';
import {VoteType, CommentVote } from '@prisma/client';

export const CommentRepo = {
// comment.repo.ts
async findAll(postId: number) {
  const comments = await prisma.comment.findMany({
    where: {
      Post: { id: postId },
      parentId: null,
    },
    include: {
      Author: {
        select: {
          id: true,
          fullname: true,
          UserProfile: {
            select: {
              profilePictureURL: true,
            },
          },
        },
      },
      Children: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return comments;
},
async findComment(postId: number, commentId: number) {
console.log('findComment called with:', { postId, commentId });
  console.log('Stack trace:', new Error().stack); // Log the call stack
  if (isNaN(postId) || isNaN(commentId)) {
    throw new APIError('Invalid postId or commentId', 400);
  }

  const result = await prisma.comment.findUnique({
    where: {
      id: commentId,
      Post: {
        is: {
          id: { equals: postId },
        },
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
  });

  return result;
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
            id: true,
            UserProfile: {
              select: {
                profilePictureURL: true,
              },
            },
          },
        },
        Post: {
          select:{ Forum: {select  : {Community: {select : {id : true}}}}}
        }
        ,
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
      orderBy: {
        createdAt: 'desc',
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

  async votedBefore(commentId: number, userId: number): Promise<CommentVote | null> {
    return prisma.commentVote.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });
  },

  async getVoteCount(commentId: number): Promise<number> {
    const [up, down] = await Promise.all([
      prisma.commentVote.count({ where: { commentId, type: VoteType.UPVOTE } }),
      prisma.commentVote.count({ where: { commentId, type: VoteType.DOWNVOTE } }),
    ]);
    return up - down;
  },

  async setVote(
    commentId: number,
    userId: number,
    type: VoteType
  ): Promise<CommentVote> {
    return prisma.commentVote.upsert({
      where: { userId_commentId: { userId, commentId } },
      create: { userId, commentId, type },
      update: { type },
    });
  },

async getCommentVoteCount(commentId: number): Promise<number> {
  const [upvotes, downvotes] = await Promise.all([
    prisma.commentVote.count({ where: { commentId, type: VoteType.UPVOTE } }),
    prisma.commentVote.count({ where: { commentId, type: VoteType.DOWNVOTE } }),
  ]);
  return upvotes - downvotes;
},

async getUserVoteType(commentId: number, userId: number): Promise<VoteType | null> {
  const vote = await prisma.commentVote.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  return vote?.type ?? null;
},

  // get comment Auth and Role
  async getCommentAuthAndRole( userId: number,commentId: number,) {
    const result = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        authorId: true,
        Post: {
          select: {
            Forum: {
              select: {
                 Community: {
                  select: {
                    CommunityMembers: {
                      where: {
                        userId: userId,
                      },
                      select: {
                        Role: true,
                      },
                    }
                },
              },
            },
          },
        },
      },
    }})
    return result
  }, 

  
  async getPostAuthorAndCommunity(userId: number, postId: number) {
    const result = await prisma.post.findUnique({
      where: { id: postId },
      select: {

        Author: {
          select: { id: true },
        },
        Forum: {
          select: {
            Community: {
              select : {id : true}
            },
          },
        },
      }


    })
    return result
  },
  // get role by communityId and userId
  async getRoleByCommunityIdAndUserId(userId: number, communityId: number) {
    const result = await prisma.communityMembers.findUnique({
      where: {  communityId_userId: {
        communityId,
        userId,
      }, },
      select: {
        Role: true,
      },
    })
    return result
  },

  async getUserComments(userId: number) {
    const results = await prisma.comment.findMany({
      where: {
        authorId: userId,
      },
       include: {
        
      Author: {
        select: {
          fullname: true,
          UserProfile: {
            select: {
              profilePictureURL: true,
            },
          },
        },
      },
      Children: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
    return results
  },  
}
