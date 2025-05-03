import { z } from 'zod'
import APIError from '../errors/APIError'
import { ForumRepo } from '../repos/forum.repo'
import { PostRepo } from '../repos/post.repo'
import { PostSchema, PostUpdateSchema } from '../utils/zod/postSchemes'
import { UserRepo } from '../repos/user.repo'
import { VoteType } from '@prisma/client';

async function getPostsByForumId(forumId: number) {
  return await PostRepo.findPostsByForumId(forumId)
}

async function createPost(data: z.infer<typeof PostSchema>, authorId: number) {
  const forumExist = await ForumRepo.findById(data.forumId)
  if (!forumExist) throw new APIError('Forum not found', 404)
  return await PostRepo.create(data, authorId)
}

async function getPostById(postId: number) {
  const post = await PostRepo.findById(postId)

  if (!post) throw new APIError('Post not found', 404)

  return post
}

async function updatePost(
  postId: number,
  data: z.infer<typeof PostUpdateSchema>,
) {
  const validatedData = await PostUpdateSchema.parseAsync(data)
  const postExist = await PostRepo.findById(postId)
  if (!postExist) throw new APIError('Post not found', 404)
  return await PostRepo.update(postId, validatedData)
}

async function deletePost(postId: number) {
  const postExist = await PostRepo.findById(postId)
  if (!postExist) throw new APIError('Post not found', 404)
  await PostRepo.delete(postId)
}

async function upVotePost(postId: number, userId: number) {
  if (!postId || !userId) throw new APIError('Missing postId or userId', 404);

  const post = await PostRepo.findById(postId);
  if (!post) throw new APIError('Post not found', 404);

  const voted = await PostRepo.votedBefore(postId, userId);

  if (voted) {
    if (voted.type === VoteType.DOWNVOTE) {
      return await PostRepo.upVotePost(postId, userId, VoteType.UPVOTE, 2);
    } else if (voted.type === VoteType.UPVOTE) {
      return await PostRepo.downVotePost(postId, userId, VoteType.NONE, 1);
    } else {
      return await PostRepo.upVotePost(postId, userId, VoteType.UPVOTE, 1);
    }
  } else {
    return await PostRepo.upVotePost(postId, userId, VoteType.UPVOTE, 1);
  }
}

async function downVotePost(postId: number, userId: number) {
  if (!postId || !userId) throw new APIError('Missing postId or userId', 404);

  const post = await PostRepo.findById(postId);
  if (!post) throw new APIError('Post not found', 404);

  const voted = await PostRepo.votedBefore(postId, userId);

  if (voted) {
      if (voted.type === VoteType.UPVOTE) {
        return await PostRepo.downVotePost(postId, userId, VoteType.DOWNVOTE, 2);
      } else if (voted.type === VoteType.DOWNVOTE) {
        return await PostRepo.upVotePost(postId, userId, VoteType.NONE, 1);
      } else { 
        return await PostRepo.downVotePost(postId, userId, VoteType.DOWNVOTE, 1);
      }
    } else {
      return await PostRepo.downVotePost(postId, userId, VoteType.DOWNVOTE, 1);
    }
}


async function getAllPostContribByUser(userId: number) {
  if (!userId) throw new APIError('Missing userId', 404)
  const user = await UserRepo.findById(userId)
  if (!user) throw new APIError('User not found', 404)
  const posts = await PostRepo.getAllContribByUserId(userId)
  if (!posts) throw new APIError('Posts not found', 404)

  return posts
}

export const PostService = {
  getPostsByForumId,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  upVotePost,
  downVotePost,
  getAllPostContribByUser,
}
