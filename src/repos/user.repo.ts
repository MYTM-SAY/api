import { Prisma } from '@prisma/client'
import { prisma } from '../db/PrismaClient'

export const UserRepo = {
  // find the user

  // find user by id
  async findById(id: number) {
    const result = await prisma.user.findUnique({
      where: { id },
    })
    return result
  },

  // find user by email
  async findByEmail(email: string) {
    const result = await prisma.user.findUnique({
      where: { email },
    })
    return result
  },

  // find user by username
  async findByUsername(username: string) {
    const result = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
      },
    })
    return result
  },

  // create User for the Authentication
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

  // update

  // update user fullname, dob by id
  async updateUser(id: number, fullname: string, dob: Date) {
    const result = await prisma.user.update({
      where: { id },
      data: { fullname, dob },
    })
    return result
  },

  // update last login by id
  async updateLastLogin(id: number) {
    const result = await prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    })
    return result
  },

  // Get the number of contributions (posts, comments, postVotes, commentVotes) by user id
  async getContributionsByUserId(id: number) {
    const result = await prisma.user.findUnique({
      where: { id },

      select: {
        _count: {
          select: {
            CommunityMembers: true,
            Post: true,
            Comment: true,
            PostVote: true,
            CommentVote: true,
          },
        },
      },
    })
    return result?._count
  }
  }
