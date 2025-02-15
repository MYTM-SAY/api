import { NextFunction, Request, Response } from 'express';
// import APIError from '../errors/APIError';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { CommunityRepo } from '../repos/community.repo';

export const getCommunities = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const communities = await CommunityRepo.findAll();
    return res.status(200).json(communities);
  } catch (error) {
    next(error);
  }
};


export const getCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = +req.params.id;
  try {
    const community = await CommunityRepo.findCommunity(id);

    if (!community) {
      return res.status(404).json({ message: 'No community found' });
    }
    return res.json(community);
  } catch (error) {
    next(error);
  }
};
