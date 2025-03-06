import { prisma } from '../db/PrismaClient';
import APIError from '../errors/APIError';
import { UserRepo } from './user.repo';

export const UserProfileRepo = {

  async findByUserId(userId: number) {
    const result = await prisma.userProfile.findUnique({
      where: { userId },
      select: { Tags: true },
    });
    return result;
  },

  // get details of a user profile
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

  // create profile (insert) and link it to a user 

  async createProfile({
    userId,
    bio,
    twitter,
    facebook,
    instagram,
    linkedin,
    youtube,
    profilePictureURL,
  }: {
    userId: number;
    bio: string;
    twitter: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    profilePictureURL: string;
  }) {
    const user = await UserRepo.findById(userId);
    if (!user) throw new APIError('User not found', 404);

    const result = await prisma.userProfile.create({
      data: {
        userId,
        bio,
        twitter,
        facebook,
        instagram,
        linkedin,
        youtube,
        profilePictureURL,
      },
    });
    return result;
  },
  
  // update profile
  async updateProfile({ userId, bio, twitter, facebook, instagram, linkedin, youtube, profilePictureURL }: {
    userId: number; bio: string; twitter: string; facebook: string; instagram: string; linkedin: string; youtube: string; profilePictureURL: string;
  }) {
    const user = await UserRepo.findById(userId);
    if (!user) throw new APIError('User not found', 404);

    const result = await prisma.userProfile.update({
      where: { userId },
      data: { bio, twitter, facebook, instagram, linkedin, youtube, profilePictureURL },
    });
    return result;
  },

  
 
};