import { Response, NextFunction, Request } from 'express'
import { prisma } from '../db/PrismaClient'
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
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  const payload = JwtService.verifyAccessToken(token)
  if (!payload) return res.status(401).json({ message: 'Unauthorized' })
  req.claims = payload
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
