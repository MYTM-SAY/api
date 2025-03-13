import { Response, NextFunction, Request } from 'express'
import { UserRepo } from '../repos/user.repo'
import { User } from '@prisma/client'
import { prisma } from '../db/PrismaClient'
import { JwtService } from '../services/jwtService'
import { TokenPayload } from '../interfaces/tokenPayload'

export interface AuthenticatedRequest extends Request {
  claims?: TokenPayload
  user?: User
}

const authenticationJwtToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  const payload = JwtService.verifyAccessToken(token)
  if (!payload) return res.status(401).json({ message: 'Unauthorized' })
  req.claims = payload as TokenPayload
  console.log(payload)
  next()
}

export const isAuthenticated = [authenticationJwtToken]

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
