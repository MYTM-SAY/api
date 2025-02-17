import { NextFunction, Request, Response } from 'express';
import APIError from '../errors/APIError';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { CommunityRepo } from '../repos/community.repo';
import { UserRepo } from '../repos/user.repo';
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

export const createCommunity = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    let user = await UserRepo.findById(req.body.ownerId);
    if (!user) throw new APIError('user not found', 404);

    const community = await CommunityRepo.create(req.body);
    return res.status(201).json(community);
  } catch (error) {
    next(error);
  }
};

export const getCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const community = await CommunityRepo.findById(Number(req.params.id));
    if (!community) throw new APIError('Community not found', 404);
    return res.status(200).json(community);
  } catch (error) {
    next(error);
  }
};

export const updateCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const communityExist = await CommunityRepo.findById(Number(req.params.id));
    if (!communityExist) throw new APIError('Community not found', 404);
    const post = await CommunityRepo.update(+req.params.id, req.body);
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const deleteCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const communityExist = await CommunityRepo.findById(Number(req.params.id));
    if (!communityExist) throw new APIError('Community not found', 404);
    await CommunityRepo.delete(+req.params.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
