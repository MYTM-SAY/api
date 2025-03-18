import { CommentRepo } from '../repos/comment.repo'
import { CommunityRepo } from '../repos/community.repo'
import APIError from '../errors/APIError'
import { z } from 'zod'
import { CommentSchema } from '../utils/zod/commentSchemes'

async function findAllComments(postId: number) {
  const comments = await CommentRepo.findAll(postId)
  if (!comments) throw new APIError('Comments not found', 404)
  return comments
}

async function findComment(postId: number, commentId: number) {
  const comment = await CommentRepo.findComment(postId, commentId)
  if (!comment) throw new APIError('Comment not found', 404)
  return comment
}

async function createComment(data: z.infer<typeof CommentSchema>) {
  if (data.parentId) {
    const commenteExist = await CommentRepo.findComment(
      data.postId,
      data.parentId,
    )
    if (!commenteExist) throw new APIError('Parent Comment not found', 404)
  }
  return CommentRepo.createComment(data)
}

async function updateComment(
  commentId: number,
  data: Partial<z.infer<typeof CommentSchema>>,
) {
  return CommentRepo.updateComment(commentId, data)
}

async function deleteComment(commentId: number) {
  const comment = await CommentRepo.findCommentById(commentId)
  if (!comment) throw new APIError('Comment not found', 404)
  return CommentRepo.deleteComment(commentId)
}

async function getCommentsByUserIdAndCommunityId(
  userId: number,
  communityId: number,
) {
  if (!userId || !communityId)
    throw new APIError('Missing userId or communityId', 400)

  const community = await CommunityRepo.findById(communityId)
  if (!community) throw new APIError('Community not found', 404)

  return CommentRepo.getCommentsByUserIdAndCommunityId(userId, communityId)
}
async function upVoteComment(
  commentId: number,
  postId: number,
  userId: number,
) {
  if (!commentId || !postId || !userId)
    throw new APIError('Some parameter is missing', 400)
  const result = await CommentRepo.upVoteComment(commentId, postId, userId)
  return result
}

async function downVoteComment(
  commentId: number,
  postId: number,
  userId: number,
) {
  if (!commentId || !postId || !userId)
    throw new APIError('Some parameter is missing', 400)
  const result = await CommentRepo.downVoteComment(commentId, postId, userId)
  return result
}

export const CommentService = {
  findAllComments,
  findComment,
  createComment,
  updateComment,
  deleteComment,
  getCommentsByUserIdAndCommunityId,
  upVoteComment,
  downVoteComment,
}
