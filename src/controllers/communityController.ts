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

export const discoverCommunities = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, tagIds } = req.query;
    const tagIdsArray: number[] = tagIds
      ? tagIds.toString().split(',').map(Number)
      : [];

    // If search parameters are provided, run search logic.
    if (name || tagIdsArray.length) {
      const searchResults = await CommunityRepo.searchCommunities(
        name as string,
        tagIdsArray,
      );
      return res.json({ searchResults });
    }

    // Optionally, if the user is authenticated, provide recommended communities.
    // Otherwise, return popular communities as the default discover data.
    if (req.user) {
      const recommended = await CommunityRepo.getRecommendedCommunities(
        req.user.id,
      );
      return res.json({ recommended });
    }

    const popular = await CommunityRepo.getPopularCommunities();
    return res.json({ popular });
  } catch (error) {
    next(error);
  }
};
