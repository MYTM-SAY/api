import { NextFunction, Request, Response } from 'express';
import APIError from '../errors/APIError';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { MemberRolesRepo } from '../repos/memberRoles.repo';

export const promoteToModerator = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { communityId, userId } = req.body;
    const requesterId = req.user?.id; 

    if (!userId || !communityId) {
      return next(new APIError('Missing communityId or userId', 400));
    }

    if (!requesterId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (userId === requesterId) {
      return res.status(403).json({ message: 'You cannot promote yourself' });
    }

    const [isAdmin, isOwner, userIsMod] = await Promise.all([
      MemberRolesRepo.isCommunityAdmin(requesterId, communityId),
      MemberRolesRepo.isCommunityOwner(requesterId, communityId),
      MemberRolesRepo.isCommunityMod(userId, communityId),
    ]);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: 'Forbidden: Only an admin or owner can assign moderators',
      });
    }

    if (userIsMod) {
      return res.status(403).json({ message: 'User is already a Moderator' });
    }

    const updatedMember = await MemberRolesRepo.assignModRole(
      userId,
      communityId,
    );

    return res
      .status(200)
      .json({ message: 'User promoted to Moderator', updatedMember });
  } catch (error) {
    return next(error);
  }
};

export const demoteFromModerator = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { communityId, userId } = req.body;
    const requesterId = req.user?.id;

    if (!userId || !communityId) {
      return next(new APIError('Missing communityId or userId', 400));
    }

    if (!requesterId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (userId === requesterId) {
      return res.status(403).json({ message: 'You cannot remove your own role' });
    }

    const [isAdmin, isOwner, userIsMod] = await Promise.all([
      MemberRolesRepo.isCommunityAdmin(requesterId, communityId),
      MemberRolesRepo.isCommunityOwner(requesterId, communityId),
      MemberRolesRepo.isCommunityMod(userId, communityId),
    ]);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: 'Forbidden: Only an admin or owner can remove moderators',
      });
    }

    if (!userIsMod) {
      return res.status(400).json({ message: 'User is not a Moderator' });
    }

    const updatedMember = await MemberRolesRepo.removeModRole(userId, communityId);

    return res
      .status(200)
      .json({ message: 'User removed as Moderator', updatedMember });
  } catch (error) {
    return next(error);
  }
};
