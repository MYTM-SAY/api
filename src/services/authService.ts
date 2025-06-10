import { Prisma } from '@prisma/client'
import { JwtService } from './jwtService'
import APIError from '../errors/APIError'
import { UserRepo } from '../repos/user.repo'
import bcrypt from 'bcrypt'

export const googleLogin = async (profile: any) => {
  // extract email from Google profile
  const email = profile.emails?.[0]?.value

  if (!email) {
    throw new APIError('No email received from Google', 400)
  }

  let user = await UserRepo.findByEmail(email)

  // if can not find the user, create one with a random password
  if (!user) {
    // TODO : this a temporary solution, it's horrible to do this
    const randomPassword = Math.random().toString(36).slice(-8) // generate a random password
    const hashedPassword = await bcrypt.hash(randomPassword, 10)
    const createdUser = await UserRepo.createUser({
      email,
      hashedPassword,
      username: profile.displayName || email.split('@')[0],
      fullname: profile.displayName || email.split('@')[0],
      dob: new Date(),
    })

    // Fetch the created user with UserProfile to ensure consistent type
    user = await UserRepo.findById(createdUser.id)
  }

  if (!user) {
    throw new APIError('Failed to create or find user', 500)
  }

  return {
    accessToken: JwtService.generateAccessToken(user),
    refreshToken: JwtService.generateRefreshToken(user),
  }
}

const login = async (email: string, password: string) => {
  const user = await UserRepo.findByEmail(email)
  if (!user) throw new APIError('User not found', 404)
  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)

  if (!isPasswordValid) throw new Error('Invalid password')
  return {
    accessToken: JwtService.generateAccessToken(user),
    refreshToken: JwtService.generateRefreshToken(user),
  }
}

const register = async (
  user: Prisma.UserCreateInput & { password: string },
) => {
  const existingEmail = await UserRepo.findByEmail(user.email)
  if (existingEmail) throw new Error('username already in use')
  const existingUsername = await UserRepo.findByUsername(user.username)

  if (existingUsername) throw new Error('username already in use')
  const hashedPassword = await bcrypt.hash(user.password, 10)

  user.hashedPassword = hashedPassword
  user.dob = new Date(user.dob)
  const createdUser = await UserRepo.createUser(user)

  // Fetch the created user with UserProfile to ensure consistent type
  const userWithProfile = await UserRepo.findById(createdUser.id)
  if (!userWithProfile) {
    throw new APIError('Failed to create user', 500)
  }

  return {
    accessToken: JwtService.generateAccessToken(userWithProfile),
    refreshToken: JwtService.generateRefreshToken(createdUser),
  }
}

const refreshToken = async (rt: string) => {
  const payload = JwtService.verifyRefreshToken(rt)
  if (!payload) throw new APIError('Invalid refresh token', 401)

  const user = await UserRepo.findById(payload.id)
  if (!user) throw new APIError('User not found', 404)

  return { accessToken: JwtService.generateAccessToken(user) }
}

const logout = async (userId: string) => {
  console.log(`User ${userId} logged out`)
}

export const AuthService = {
  login,
  register,
  logout,
  refreshToken,
  googleLogin,
}
