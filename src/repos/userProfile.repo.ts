import { prisma } from '../db/PrismaClient';
import APIError from '../errors/APIError';
import { UserRepo } from './user.repo';
import { UserProfileSchema } from '../utils/zod/userProfileSchemes';
import { z } from 'zod';

export const UserProfileRepo = {
  async findByUserId(userId: number,) {
    const result = await prisma.userProfile.findUnique({
      where: { userId },
      select: { Tags: true },
    });
    return result;
  },

  async getProfile(userId: number) {
    const result = await prisma.userProfile.findUnique({
      where: { userId },
      select: {
        bio: true,
        twitter: true,
        facebook: true,
        instagram: true,
        linkedin: true,
        youtube: true,
        profilePictureURL: true,
      },
    });
    return result;
  },

  async createProfile(
    profile: z.infer<typeof UserProfileSchema>,
    userId: number,
  ) {
 
    const result = await prisma.userProfile.create({
      data: {
        userId,
        ...profile,
      },
    });
    return result;
  },

  async updateProfile(
    profile: z.infer<typeof UserProfileSchema>,
    userId: number,
  ) {
    
    const result = await prisma.userProfile.update({
      where: { userId },
      data: {
        ...profile,
      },
    });
    return result;
  },
};
