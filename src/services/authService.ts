import { Prisma, User } from '@prisma/client'
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

const register = async (user: Prisma.UserCreateInput, password: string) => {
  const existingEmail = await UserRepo.findByEmail(user.email)
  if (existingEmail) throw new Error('username already in use')

  const existingUsername = await UserRepo.findByUsername(user.email)
  if (existingUsername) throw new Error('username already in use')
  const hashedPassword = await bcrypt.hash(password, 10)

  user.hashedPassword = hashedPassword
  user.dob = user.dob ? new Date(user.dob) : undefined
  console.log(user)
  const createdUser = await UserRepo.createUser(user)

  return {
    accessToken: JwtService.generateAccessToken(createdUser),
    refreshToken: JwtService.generateRefreshToken(createdUser),
  }
}

// const refreshToken = async (refreshToken: string) => {
//   const payload = JwtService.verifyRefreshToken(refreshToken)
//   if (!payload) throw new Error('Invalid refresh token')

//   const user = await prisma.user.findUnique({ where: { id: payload.id } })
//   if (!user) throw new Error('User not found')

//   return { accessToken: JwtService.generateAccessToken(user) }
// }

const logout = async (userId: string) => {
  console.log(`User ${userId} logged out`)
}

export const AuthService = { login, register, logout }
