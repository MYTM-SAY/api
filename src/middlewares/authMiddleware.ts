import { Response, NextFunction, Request } from 'express'
import { UserRepo } from '../repos/user.repo'
import { AuthObject, clerkClient, getAuth, requireAuth } from '@clerk/express'
import { User } from '@prisma/client'
import { MemberRolesRepo } from '../repos/memberRoles.repo'
import { prisma } from '../db/PrismaClient'

export interface AuthenticatedRequest extends Request {
  auth?: AuthObject
  user?: User
}

type Role = 'ADMIN' | 'OWNER' | 'MODERATOR' | 'MEMBER'
const roleLevels = {
  MEMBER: 1,
  MODERATOR: 2,
  OWNER: 3,
  ADMIN: 4,
}

export const requestWithParsedUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auth = getAuth(req)

    if (!auth.userId) {
      return res.status(401).json({ message: 'unauthorized' })
    }

    let user = await UserRepo.findUserByClerkId(auth.userId)

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(auth.userId)
      user = await UserRepo.createUser({
        email: clerkUser.emailAddresses[0].emailAddress,
        clerkId: clerkUser.id,
        username:
          clerkUser.username || clerkUser.emailAddresses[0].emailAddress,
      })
    }

    req.auth = auth
    req.user = user

    next()
  } catch (error) {
    return res.status(500).json({ message: 'Authentication error', error })
  }
}

export const isAuthenticated = [requireAuth(), requestWithParsedUser]

export const isOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userRole = await prisma.memberRoles.findFirst({
      where: {
        userId: req.user?.id,
        Role: 'OWNER',
      },
    })

    if (!userRole) {
      return res.status(403).json({ message: 'Access denied' })
    }

    next()
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

function getRoleLevel(role: Role | null): number {
  return role ? roleLevels[role] || 0 : 0
}

export const hasCommunityRoleOrHigher = (
  minimumRoles: Role[],
  communityIdParam = 'communityId',
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      const communityId = Number(
        req.params[communityIdParam] ||
          req.body[communityIdParam] ||
          req.query[communityIdParam],
      )
      if (!communityId) {
        return res.status(400).json({ message: 'community ID missing' })
      }
      const globalRoleLevel = getRoleLevel(req.user.globalRole)
      const communityRole = await MemberRolesRepo.getUserRoleInCommunity(
        req.user.id,
        communityId,
      )
      const communityRoleLevel = getRoleLevel(communityRole)
      const effectiveLevel = Math.max(
        globalRoleLevel ?? 0,
        communityRoleLevel ?? 0,
      )
      for (const minRole of minimumRoles) {
        if (effectiveLevel >= getRoleLevel(minRole)) {
          return next()
        }
      }
      return res.status(403).json({ message: 'Insufficient role' })
    } catch (error) {
      return res.status(500).json({ message: 'Role check failed', error })
    }
  }
}
