import { Prisma, User } from '@prisma/client'
import { prisma } from '../db/PrismaClient'

export const UserRepo = {
  async findById(id: number) {
    const result = await prisma.user.findUnique({
      where: { id },
    })
    return result
  },

  async findByEmail(email: string) {
    const result = await prisma.user.findUnique({
      where: { email },
    })
    return result
  },

  async findByUsername(username: string) {
    const result = await prisma.user.findUnique({
      where: { username },
    })
    return result
  },

  async createUser(userData: Prisma.UserUncheckedCreateInput) {
    return await prisma.user.create({
      data: { ...userData },
    })
  },

  async updateLastLogin(id: number) {
    const result = await prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    })
    return result
  },
}
