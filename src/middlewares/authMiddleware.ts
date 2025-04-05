import { Response, NextFunction, Request } from 'express'
import { prisma } from '../db/PrismaClient'
import { MemberRolesRepo } from '../repos/memberRoles.repo'
import { JwtService } from '../services/jwtService'
import { TokenPayload } from '../interfaces/tokenPayload'
import { Role } from '@prisma/client'
import { ResponseHelper } from '../utils/responseHelper'
import { JoinRequestRepo } from '../repos/JoinRequestRepo '
import { CommunityRepo } from '../repos/community.repo'

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

export const hasRoles = (requiredRoles: Role[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { communityId } = req.body || req.params

      if (!communityId) {
        return res
          .status(400)
          .json(ResponseHelper.error('Missing community ID', 400))
      }

      if (requiredRoles.includes(Role.OWNER)) {
        const community = await CommunityRepo.findById(+communityId)

        if (!community || community.ownerId !== req.claims!.id)
          return res
            .status(403)
            .json(ResponseHelper.error('Access denied', 403))
        else return next()
      }

      const userRole = await MemberRolesRepo.getUserRoleInCommunity(
        +communityId,
        req.claims!.id,
      )

      if (!userRole)
        return res.status(403).json(ResponseHelper.error('Access denied', 403))

      if (!requiredRoles.includes(userRole))
        return res.status(403).json(ResponseHelper.error('Access denied', 403))

      next()
    } catch (error) {
      res
        .status(500)
        .json(ResponseHelper.error('Internal server error', 500, error))
    }
  }
}
