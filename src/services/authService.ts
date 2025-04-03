import { Prisma } from '@prisma/client'
import { JwtService } from './jwtService'
import APIError from '../errors/APIError'
import { UserRepo } from '../repos/user.repo'
import bcrypt from 'bcrypt'

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

  return {
    accessToken: JwtService.generateAccessToken(createdUser),
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

export const AuthService = { login, register, logout, refreshToken }
