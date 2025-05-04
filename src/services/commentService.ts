import { CommentRepo } from '../repos/comment.repo'
import { CommunityRepo } from '../repos/community.repo'
import APIError from '../errors/APIError'
import { z } from 'zod'
import { CommentSchema } from '../utils/zod/commentSchemes'
import { VoteType, CommentVote } from '@prisma/client';

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
  console.log('userId', userId, 'communityId', communityId)
  const community = await CommunityRepo.findById(communityId)
  if (!community) throw new APIError('Community not found', 404)

  return CommentRepo.getCommentsByUserIdAndCommunityId(userId, communityId)
}
 async function upVoteComment(
  commentId: number,
  userId: number
): Promise<{ vote: CommentVote; voteCount: number }> {
  const existing = await CommentRepo.votedBefore(commentId, userId);
  let newType: VoteType = VoteType.UPVOTE;

  if (existing) {
    if (existing.type === VoteType.UPVOTE) {
      newType = VoteType.NONE;
    } else if (existing.type === VoteType.DOWNVOTE) {
      newType = VoteType.UPVOTE;
    }
  }

  const vote = await CommentRepo.setVote(commentId, userId, newType);
  const voteCount = await CommentRepo.getVoteCount(commentId);
  return { vote, voteCount };
}

 async function downVoteComment(
  commentId: number,
  userId: number
): Promise<{ vote: CommentVote; voteCount: number }> {
  const existing = await CommentRepo.votedBefore(commentId, userId);
  let newType: VoteType = VoteType.DOWNVOTE;

  if (existing) {
    if (existing.type === VoteType.DOWNVOTE) {
      newType = VoteType.NONE;
    } else if (existing.type === VoteType.UPVOTE) {
      newType = VoteType.DOWNVOTE;
    }
  }

  const vote = await CommentRepo.setVote(commentId, userId, newType);
  const voteCount = await CommentRepo.getVoteCount(commentId);
  return { vote, voteCount };
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
