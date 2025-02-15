import { Response, NextFunction, Request } from 'express';
import { UserRepo } from '../repos/user.repo';
import { AuthObject, clerkClient } from '@clerk/express';
import { User } from '@prisma/client';
import { prisma } from '../db/PrismaClient';


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


export const isOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {

    const userRole = await prisma.memberRoles.findFirst({
      where: {
        userId: req.user?.id,
        Role:'OWNER',
      },
    });

    if (!userRole) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
