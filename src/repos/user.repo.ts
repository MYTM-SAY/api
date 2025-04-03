import { Prisma } from '@prisma/client'
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
    return prisma.user.create({
      data: {
        username: userData.username,
        fullname: userData.fullname,
        email: userData.email,
        dob: userData.dob,
        hashedPassword: userData.hashedPassword,
      },
    })
  },

  async updateUser(id: number, fullname: string, dob: Date ) { // update user name,dob by id
    const result = await prisma.user.update({
      where: { id },
      data: { fullname, dob },
    })
    return result
      }
  ,



  async updateLastLogin(id: number) {
    const result = await prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    })
    return result
  },
}
