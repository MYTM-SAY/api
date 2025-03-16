import { PostRepo } from '../repos/post.repo'
import APIError from '../errors/APIError'
import { PostSchema, PostUpdateSchema } from '../utils/zod/postSchemes'
import { z } from 'zod'
import { ForumRepo } from '../repos/forum.repo'

async function getPostsByForumId(forumId: number) {
  return await PostRepo.findPostsByForumId(forumId)
}

async function createPost(data: z.infer<typeof PostSchema>, authorId: number) {
  const validatedData = await PostSchema.parseAsync(data)
  console.log(validatedData)
  const forumExist = await ForumRepo.findById(validatedData.forumId)
  if (!forumExist) throw new APIError('Forum not found', 404)
  return await PostRepo.create(validatedData, authorId)
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

export const PostService = {
  getPostsByForumId,
  createPost,
  getPostById,
  updatePost,
  deletePost,
}
