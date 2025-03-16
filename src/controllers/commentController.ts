import { NextFunction, Request, Response } from 'express'
import { CommentService } from '../services/commentService'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { asyncHandler } from '../utils/asyncHandler'
import { ResponseHelper } from '../utils/responseHelper'

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
    const comment = await CommentService.createComment(req.body)
    res
      .status(201)
      .json(ResponseHelper.success('Comment created successfully', comment))
  },
)

export const updateComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const comment = await CommentService.updateComment(
      +req.params.commentId,
      req.body,
    )
    res
      .status(200)
      .json(ResponseHelper.success('Comment updated successfully', comment))
  },
)

export const deleteComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    await CommentService.deleteComment(+req.params.commentId)
    res.status(200).json(ResponseHelper.success('Comment deleted successfully'))
  },
)

export const getCommentsByUserIdAndCommunityId = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.claims!.id
    const communityId = Number(req.query.communityId)
    const comments = await CommentService.getCommentsByUserIdAndCommunityId(
      userId,
      communityId,
    )
    res
      .status(200)
      .json(ResponseHelper.success('Comments fetched successfully', comments))
  },
)

export const upVoteComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await CommentService.upVoteComment(
      +req.params.commentId,
      +req.params.postId,
      +req.params.userId,
    );
    res.status(200).json(ResponseHelper.success('Comment upvoted successfully', result));
  },
);


export const downVoteComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await CommentService.downVoteComment(
      +req.params.commentId,
      +req.params.postId,
      +req.params.userId,
    );
    res.status(200).json(ResponseHelper.success('Comment downvoted successfully', result));
  },
)
