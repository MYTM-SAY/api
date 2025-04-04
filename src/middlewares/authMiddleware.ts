import { Response, NextFunction, Request } from 'express'
import { prisma } from '../db/PrismaClient'
import { MemberRolesRepo } from '../repos/memberRoles.repo'
import { JwtService } from '../services/jwtService'
import { TokenPayload } from '../interfaces/tokenPayload'

export interface AuthenticatedRequest extends Request {
  claims?: TokenPayload
}

const authenticationJwtToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const tokenFromcookies = req.cookies.accessToken
  const tokenFromHeader = req.headers.authorization?.split(' ')[1]
  let token
  if (tokenFromHeader) token = tokenFromHeader
  else if (tokenFromcookies) token = tokenFromcookies
  const payload = JwtService.verifyAccessToken(token)
  if (!payload) return res.status(401).json({ message: 'Unauthorized' })
  req.claims = payload
  next()
}

export const isAuthenticated = [authenticationJwtToken]

//TODO: don't remove this

// type Role = 'ADMIN' | 'OWNER' | 'MODERATOR' | 'MEMBER'
// const roleLevels = {
//   MEMBER: 1,
//   MODERATOR: 2,
//   OWNER: 3,
//   ADMIN: 4,
// }

// function getRoleLevel(role: Role | null): number {
//   return role ? roleLevels[role] || 0 : 0
// }
// export const hasCommunityRoleOrHigher = (
//   minimumRoles: Role[],
//   communityIdParam = 'communityId',
// ) => {
//   return async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction,
//   ) => {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ message: 'Unauthorized' })
//       }
//       const communityId = Number(
//         req.params[communityIdParam] ||
//           req.body[communityIdParam] ||
//           req.query[communityIdParam],
//       )
//       if (!communityId) {
//         return res.status(400).json({ message: 'community ID missing' })
//       }
//       const globalRoleLevel = getRoleLevel(req.user.globalRole)
//       const communityRole = await MemberRolesRepo.getUserRoleInCommunity(
//         req.user.id,
//         communityId,
//       )
//       const communityRoleLevel = getRoleLevel(communityRole)
//       const effectiveLevel = Math.max(
//         globalRoleLevel ?? 0,
//         communityRoleLevel ?? 0,
//       )
//       for (const minRole of minimumRoles) {
//         if (effectiveLevel >= getRoleLevel(minRole)) {
//           return next()
//         }
//       }
//       return res.status(403).json({ message: 'Insufficient role' })
//     } catch (error) {
//       return res.status(500).json({ message: 'Role check failed', error })
//     }
//   }
// }

export const isOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userRole = await prisma.communityMembers.findFirst({
      where: {
        userId: req.claims?.id,
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
