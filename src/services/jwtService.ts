import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { User } from '@prisma/client'
import { TokenPayload } from '../interfaces/tokenPayload'

dotenv.config()
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || 'default_access_secret'
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret'

const generateRefreshToken = (user: User): string =>
  jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload
  } catch (error) {
    return null
  }
}

const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload
  } catch (error) {
    return null
  }
}
const decodeToken = (token: string): TokenPayload | null =>
  (jwt.decode(token) as TokenPayload) || null

const generateAccessToken = (
  user: User & { UserProfile?: { profilePictureURL?: string | null } | null },
): string => {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    username: user.username,
    fullname: user.fullname,
    profilePictureURL: user.UserProfile?.profilePictureURL || null,
  }
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

export const JwtService = {
  generateAccessToken,
  verifyRefreshToken,
  verifyAccessToken,
  generateRefreshToken,
  decodeToken,
}
