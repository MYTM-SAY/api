import { Response, NextFunction, Request } from 'express';
import { UserRepo } from '../repos/user.repo';
import { AuthObject, clerkClient } from '@clerk/express';
import { User } from '@prisma/client';
import { MemberRolesRepo } from '../repos/memberRoles.repo';

export interface AuthenticatedRequest extends Request {
  auth?: AuthObject;
  user?: User;
}

export const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'Unauthorized: Please log in.' });
    }

    if (!req.auth.sessionId) {
      return res
        .status(401)
        .json({ message: 'Session expired. Please log in again.' });
    }

    let user = await UserRepo.findUserByClerkId(req.auth.userId);

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(req.auth.userId);
      user = await UserRepo.createUser({
        email: clerkUser.emailAddresses[0].emailAddress,
        clerkId: clerkUser.id,
        username:
          clerkUser.username || clerkUser.emailAddresses[0].emailAddress,
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Authentication error', error });
  }
};

type AllowedRole = 'ADMIN' | 'MODERATOR' | 'OWNER' | 'MEMBER';

export const hasCommunityRole = (
  allowedRoles: AllowedRole[],
  communityIdParam = 'communityId', // Name of param/body field containing community ID
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const communityId = Number(
        req.params[communityIdParam] || req.body[communityIdParam],
      );

      if (!communityId) {
        return res.status(400).json({ message: 'community ID missing' });
      }

      const userRole = await MemberRolesRepo.getUserRoleInCommunity(
        req.user.id,
        communityId,
      );

      if (!userRole || !allowedRoles.includes(userRole as AllowedRole)) {
        return res.status(403).json({
          message: `Requires one of: ${allowedRoles.join(
            ', ',
          )} role in community`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: 'Role check failed', error });
    }
  };
};
