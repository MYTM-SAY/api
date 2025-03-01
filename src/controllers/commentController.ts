import { NextFunction, Request, Response } from 'express';
import { CommentRepo } from '../repos/comment.repo';
import APIError from '../errors/APIError';

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const comments = await CommentRepo.findAll(+req.params.postId);
    if (!comments) throw new APIError('Comments not found', 404);
    return res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
