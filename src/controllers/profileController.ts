import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { UserProfileRepo } from '../repos/userProfile.repo';
import { UserRepo } from '../repos/user.repo';
import APIError from '../errors/APIError';
import { asyncHandler } from '../utils/asyncHandler';
import { ResponseHelper } from '../utils/responseHelper';
import { UserProfileService } from '../services/userProfileService';

export const getProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = await UserProfileService.getUserProfile(+req.params.id);
    res
      .status(200)
      .json(
        ResponseHelper.success('Profile retrieved successfully', profile)
      );
  }
);
export const createProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const {
      userId,
      bio,
      twitter,
      facebook,
      instagram,
      linkedin,
      youtube,
      profilePictureURL,
    } = req.body;

    if (userId !== req.claims?.id) {
      return res
        .status(403)
        .json(
          ResponseHelper.error('Forbidden: You can only create your own profile')
        );
    }



    // Call the service with the profile data and the userId separately.
    const profile = await UserProfileService.createUserProfile(
      
      {bio,
      twitter,
      facebook,
      instagram,
      linkedin,
      youtube,
      profilePictureURL},userId,
    );

    res
      .status(200)
      .json(
        ResponseHelper.success('Profile created successfully', profile));
      
  }
);


export const updateProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const {
      userId,
      bio,
      twitter,
      facebook,
      instagram,
      linkedin,
      youtube,
      profilePictureURL,
    } = req.body;

    if (userId !== req.claims?.id) {
      return res
        .status(403)
        .json(
          ResponseHelper.error('Forbidden: You can only update your profile')
        );
    }

    const profile = await UserProfileService.updateUserProfile(
      
      {bio,
      twitter,
      facebook,
      instagram,
      linkedin,
      youtube,
      profilePictureURL},userId,
    );

    res
      .status(200)
      .json(
        ResponseHelper.success('Profile updated successfully', profile)
      );
  }
);
