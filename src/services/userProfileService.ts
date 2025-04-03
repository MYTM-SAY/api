import { UserProfileRepo } from '../repos/userProfile.repo';
import { UserRepo } from '../repos/user.repo';
import APIError from '../errors/APIError';
import { UserProfileSchema } from '../utils/zod/userProfileSchemes';
import { z } from 'zod';
import { UserSchema } from '../utils';

async function getUserProfile(userId: number) {

  if (!userId || isNaN(userId)) throw new APIError('Invalid User ID', 400);

  const user = await UserRepo.findById(userId);
  if (!user) throw new APIError('User not found', 404);

  const userProfile = await UserProfileRepo.getProfile(userId);
  if (!userProfile) throw new APIError('User profile not found', 404);

  
  return userProfile;
}

async function createUserProfile(
   profiledata: any, userId: number,

 ) {
   if (!profiledata || isNaN(userId)) throw new APIError('Invalid User ID', 400);
 
   const user = await UserRepo.findById(userId);
   if (!user) throw new APIError('User not found', 404);

   // if profile exists, throw an error
    const existingProfile = await UserProfileRepo.getProfile(userId);
    if (existingProfile) throw new APIError('Profile already exists', 400);
 
   const validatedData = await UserProfileSchema.parseAsync(profiledata);
   return await UserProfileRepo.createProfile(validatedData, userId);
 }

 async function updateUserProfile(
   profiledata: any, 
   userId: number,
 ) {
   if (!userId || isNaN(userId)) throw new APIError('Invalid User ID', 400);
 
   const user = await UserRepo.findById(userId);
   if (!user) throw new APIError('User not found', 404);


   const existingProfile = await UserProfileRepo.getProfile(userId);
    if (!existingProfile) throw new APIError('Profile not found', 404);
 
   const validatedData = await UserProfileSchema.parseAsync(profiledata);
 
   return await UserProfileRepo.updateProfile(validatedData, userId);
 }
 

export const UserProfileService = {
  getUserProfile,
  createUserProfile,
  updateUserProfile
};
