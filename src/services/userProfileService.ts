import { UserProfileRepo } from '../repos/userProfile.repo';
import { UserRepo } from '../repos/user.repo';
import APIError from '../errors/APIError';
import { UserProfileSchema } from '../utils/zod/userProfileSchemes';
import { z } from 'zod';

async function getUserProfile(userId: number) {
  if (!userId || isNaN(userId)) throw new APIError('Invalid User ID', 400);

  const userProfile = await UserProfileRepo.findByUserId(userId);
  if (!userProfile) throw new APIError('User profile not found', 404);

  return userProfile;
}

async function createUserProfile(
   data: Omit<z.infer<typeof UserProfileSchema>, 'Id'>,
   userId: number,
 ) {
   if (!userId || isNaN(userId)) throw new APIError('Invalid User ID', 400);
 
   const user = await UserRepo.findById(userId);
   if (!user) throw new APIError('User not found', 404);
 
   const validatedData = await UserProfileSchema.parseAsync(data);
   
   return await UserProfileRepo.createProfile(validatedData, userId);
 }

 async function updateUserProfile(
   data: Omit<z.infer<typeof UserProfileSchema>, 'Id'>,
   userId: number,
 ) {
   if (!userId || isNaN(userId)) throw new APIError('Invalid User ID', 400);
 
   const user = await UserRepo.findById(userId);
   if (!user) throw new APIError('User not found', 404);
 
   const validatedData = await UserProfileSchema.parseAsync(data);
 
   return await UserProfileRepo.updateProfile(validatedData, userId);
 }
 

export const UserProfileService = {
  getUserProfile,
  createUserProfile,
  updateUserProfile
};
