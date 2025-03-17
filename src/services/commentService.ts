import { CommentRepo } from '../repos/comment.repo'
import { UserRepo } from '../repos/user.repo'
import { CommunityRepo } from '../repos/community.repo'
import { CommentSchema } from '../utils'
import APIError from '../errors/APIError'

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

async function createComment(data: any, postId: number, authorId: number) {
  const validatedData = CommentSchema.parse({ ...data, postId, authorId });
  return await CommentRepo.createComment(validatedData, postId, authorId);
}


async function updateComment(commentId: number, data: any) {
  const validatedData = CommentSchema.partial().parse(data)
  return await CommentRepo.updateComment(commentId, validatedData)
}

async function deleteComment(commentId: number) {
  return await CommentRepo.deleteComment(commentId)
}

async function getCommentsByUserIdAndCommunityId(
  userId: number,
  communityId: number,
) {
  if (!userId || !communityId)
    throw new APIError('Missing userId or communityId', 400)

  const user = await UserRepo.findById(userId)
  if (!user) throw new APIError('User not found', 404)

  const community = await CommunityRepo.findById(communityId)
  if (!community) throw new APIError('Community not found', 404)

  return await CommentRepo.getCommentsByUserIdAndCommunityId(
    userId,
    communityId,
  )
}

async function upVoteComment(
  commentId: number,
  postId: number,
  userId: number,
) {
  if (!commentId || !postId || !userId)
    throw new APIError('Some parameter is missing', 400)
  const result = await CommentRepo.upVoteComment(
    commentId,
    postId,
    userId,
  )
  return result;
}

async function downVoteComment(
  commentId: number,
  postId: number,
  userId: number,
) {
  if (!commentId || !postId || !userId)
    throw new APIError('Some parameter is missing', 400)
  const result = await CommentRepo.downVoteComment(
    commentId,
    postId,
    userId,
  )
  return result;
}

export const CommentService = { 
  findAllComments,
  findComment,
  createComment,
  updateComment,
  deleteComment,
  getCommentsByUserIdAndCommunityId,
  upVoteComment,
  downVoteComment
}
