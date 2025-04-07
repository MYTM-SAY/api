import { z } from 'zod'
import APIError from '../errors/APIError'
import { ForumRepo } from '../repos/forum.repo'
import { PostRepo } from '../repos/post.repo'
import { PostSchema, PostUpdateSchema } from '../utils/zod/postSchemes'
import { UserRepo } from '../repos/user.repo'

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
  if (!postId || !userId)
    throw new APIError('Missing postId or userId', 404);
  const post = await PostRepo.findById(postId);
  if(!post) throw new APIError("Post not found", 404);
  const result = PostRepo.upVotePost(postId, userId)
  return result
}

async function downVotePost(postId: number, userId: number) {
  if (!postId || !userId)
    throw new APIError('Missing postId or userId', 404);
  const post = await PostRepo.findById(postId);
  if(!post) throw new APIError("Post not found", 404);
  const result = PostRepo.downVotePost(postId, userId)
  return result
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
