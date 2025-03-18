// import { NextFunction, Response } from 'express'
// import { UserProfileRepo } from '../repos/userProfile.repo'
// import APIError from '../errors/APIError'
// import { AuthenticatedRequest } from '../middlewares/authMiddleware'

// // public profile
// export const getProfile = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const profile = await UserProfileRepo.getProfile(Number(+req.params.id))
//     if (!profile) throw new APIError('Profile not found', 404)

//     res.status(200).json({ data: profile })
//   } catch (error) {
//     next(error)
//   }
// }

// // create profile if you are the user
// export const createProfile = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const {
//       userId,
//       bio,
//       twitter,
//       facebook,
//       instagram,
//       linkedin,
//       youtube,
//       profilePictureURL,
//     } = req.body
//     if (userId !== req.claims?.id) {
//       return res
//         .status(403)
//         .json({ message: 'Forbidden: You can only create your profile' })
//     }
//     const profile = await UserProfileRepo.createProfile({
//       userId,
//       bio,
//       twitter,
//       facebook,
//       instagram,
//       linkedin,
//       youtube,
//       profilePictureURL,
//     })
//     res.status(201).json({ data: profile })
//   } catch (error) {
//     next(error)
//   }
// }

// // update profile if you are the user
// export const updateProfile = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const {
//       userId,
//       bio,
//       twitter,
//       facebook,
//       instagram,
//       linkedin,
//       youtube,
//       profilePictureURL,
//     } = req.body
//     if (userId !== req.claims?.id) {
//       return res
//         .status(403)
//         .json({ message: 'Forbidden: You can only update your profile' })
//     }
//     const profile = await UserProfileRepo.updateProfile({
//       userId,
//       bio,
//       twitter,
//       facebook,
//       instagram,
//       linkedin,
//       youtube,
//       profilePictureURL,
//     })
//     res.status(200).json({ data: profile })
//   } catch (error) {
//     next(error)
//   }
// }
// make service for the above controller


// repo 

// import { Prisma, User } from '@prisma/client'
// import { prisma } from '../db/PrismaClient'

// export const UserRepo = {
//   async findById(id: number) {
//     const result = await prisma.user.findUnique({
//       where: { id },
//     })
//     return result
//   },

//   async findByEmail(email: string) {
//     const result = await prisma.user.findUnique({
//       where: { email },
//     })
//     return result
//   },

//   async findByUsername(username: string) {
//     const result = await prisma.user.findUnique({
//       where: { username },
//     })
//     return result
//   },

//   async createUser(userData: Prisma.UserUncheckedCreateInput) {
//     return prisma.user.create({
//       data: {
//         username: userData.username,
//         email: userData.email,
//         dob: userData.dob,
//         hashedPassword: userData.hashedPassword,
//       },
//     })
//   },

//   async updateLastLogin(id: number) {
//     const result = await prisma.user.update({
//       where: { id },
//       data: { lastLogin: new Date() },
//     })
//     return result
//   },
// }

import { UserRepo } from '../repos/user.repo'
import { UserProfileRepo } from '../repos/userProfile.repo'
import { MemberRolesRepo } from '../repos/memberRoles.repo'
import APIError from '../errors/APIError'
import { z } from 'zod'
import { UserSchema } from '../utils/zod/userSchemes'
import { UserProfileSchema } from '../utils/zod/userProfileSchemes'

// service for user controller (CRUD)

async function getUserById(
   userId: number | null,

) {
   if(!userId || isNaN(userId)) throw new APIError('Invalid User ID', 400)

   if(userId) {
      const user = await UserRepo.findById(userId)
      if(!user) throw new APIError('User not found', 404)

      return user
   }
}


async function getUserByUsername(
   username: string
) {
   const user = await UserRepo.findByUsername(username)
   if(!user) throw new APIError('User not found', 404)

   return user
}

async function createUser(
   data: Omit<z.infer<typeof UserSchema>, 'id'>,
) {
   const validatedData = await UserSchema.parseAsync(data)
   return UserRepo.createUser(validatedData)
}

// user can update the fullname and the dob only
async function updateUser(
   userId: number,
   data: Omit<z.infer<typeof UserSchema>, 'id'>,
) {
   const validatedData = await UserSchema.parseAsync(data)
   return UserRepo.updateUser(userId, validatedData.fullname, validatedData.dob)
}


// update last login
async function updateLastLogin(
   userId: number
) {
   return UserRepo.updateLastLogin(userId)
}



