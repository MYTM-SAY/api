import { Response, NextFunction, Request } from 'express'
import { MemberRolesRepo } from '../repos/memberRoles.repo'
import { JwtService } from '../services/jwtService'
import { TokenPayload } from '../interfaces/tokenPayload'
import { UserService } from '../services/userService'
// each time update last login
import { Role } from '@prisma/client'
import { ResponseHelper } from '../utils/responseHelper'
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
  await UserService.updateLastLogin(payload.id)

  next()
}

export const isAuthenticated = [authenticationJwtToken]

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

export const isJoined = (parameterName: string) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const communityId =
      req.body[parameterName] ||
      req.params[parameterName] ||
      req.query[parameterName]

    if (!communityId) {
      return res
        .status(400)
        .json(ResponseHelper.error('Missing community ID', 400))
    }
    const community = await CommunityRepo.findById(+communityId)

    if (!community || community.ownerId === req.claims!.id) return next()

    const userRole = await MemberRolesRepo.getUserRoleInCommunity(
      +communityId,
      req.claims!.id,
    )

    if (!userRole)
      return res.status(403).json(ResponseHelper.error('Access denied', 403))

    next()
  }
}
