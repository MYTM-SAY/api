import { z } from 'zod'
import APIError from '../errors/APIError'
import { ForumRepo } from '../repos/forum.repo'
import { PostRepo } from '../repos/post.repo'
import { PostSchema, PostUpdateSchema } from '../utils/zod/postSchemes'

async function getPostsByForumId(forumId: number) {
  return await PostRepo.findPostsByForumId(forumId)
}

async function createPost(
  data: Omit<z.infer<typeof PostSchema>, 'forumId'>,
  authorId: number,
  forumId: number,
) {
  const validatedData = await PostSchema.parseAsync(data)
  console.log(validatedData)
  const forumExist = await ForumRepo.findById(forumId)
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

async function upVotePost(
  postId: number,
  forumId: number,
  userId: number,
) {
  if (!postId || !forumId || !userId)
    throw new APIError('Some parameter is missing', 400)

  const result = PostRepo.upVotePost(postId, forumId, userId)
  return result
}

async function downVotePost(
  postId: number,
  forumId: number,
  userId: number,
) {
  if (!postId || !forumId || !userId)
    throw new APIError('Some parameter is missing', 400)

  const result = PostRepo.downVotePost(postId, forumId, userId)
  return result
}

export const PostService = {
  getPostsByForumId,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  upVotePost,
  downVotePost,
}
