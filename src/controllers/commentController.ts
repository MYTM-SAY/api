import { Response } from 'express'
import { CommentService } from '../services/commentService'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { asyncHandler } from '../utils/asyncHandler'
import { ResponseHelper } from '../utils/responseHelper'
import { CommentSchema } from '../utils/zod/commentSchemes'
import { upsertUserContribution } from '../services/contributionService'


export const findAllComments = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const comments = await CommentService.findAllComments(+req.params.postId)
    res
      .status(200)
      .json(ResponseHelper.success('Comments fetched successfully', comments))
  },
)

export const findComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const comment = await CommentService.findComment(
      +req.params.postId,
      +req.params.commentId,
    )
    res
      .status(200)
      .json(ResponseHelper.success('Comment fetched successfully', comment))
  },
)

export const createComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const validatedData = await CommentSchema.parseAsync(req.body)

    const comment = await CommentService.createComment({
      ...validatedData,
      authorId: req.claims!.id,
    });
    await upsertUserContribution(req.claims!.id);
    res
      .status(201)
      .json(ResponseHelper.success('Comment created successfully', comment))
  },
)

export const updateComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const validatedData = CommentSchema.partial().parse(req.body)

    const comment = await CommentService.updateComment(
      +req.params.id,
      validatedData,
    )
    res
      .status(200)
      .json(ResponseHelper.success('Comment updated successfully', comment))
  },
)

export const deleteComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const actualUserId = +req.claims!.id
    const commentId = +req.params.id
    await CommentService.deleteComment(actualUserId, commentId);
    res.status(200).json(ResponseHelper.success('Comment deleted successfully'))
  },
)

export const getCommentsByUserIdAndCommunityId = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.claims!.id
    const communityId = Number(req.params.id)

    const comments = await CommentService.getCommentsByUserIdAndCommunityId(
      userId,
      communityId,
    )
    return res
      .status(200)
      .json(ResponseHelper.success('Comments fetched successfully', true))
  },
)

export const upVoteComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const commentId = +req.params.commentId;
    const userId = +req.claims!.id;
    const result = await CommentService.upVoteComment(commentId, userId);
    await upsertUserContribution(userId);
    res
      .status(200)
      .json(ResponseHelper.success('Comment upvoted successfully', result));
  }
);

export const downVoteComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const commentId = +req.params.commentId;
    const userId = +req.claims!.id;
    const result = await CommentService.downVoteComment(commentId, userId);
    await upsertUserContribution(userId);
    res
      .status(200)
      .json(ResponseHelper.success('Comment downvoted successfully', result));
  }
);
