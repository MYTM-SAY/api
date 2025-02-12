import { NextFunction, Request, Response } from 'express';
import { CommunityRepo } from '../repos/community.repo';
// import APIError from '../errors/APIError';

export const getCommunities = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const communities = await CommunityRepo.findAll();
    return res.json(communities);
  } catch (error) {
    next(error);
  }
};
