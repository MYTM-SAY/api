import { Request, Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { asyncHandler } from '../utils/asyncHandler'
import { ResponseHelper } from '../utils/responseHelper'
import { UserProfileService } from '../services/userProfileService'
import { number } from 'zod'

// get profile, publicly available
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await UserProfileService.getUserProfile(+req.params.id)
  // add a dummy array of strings to the profile object to test the frontend

  res
    .status(200)
    .json(ResponseHelper.success('Profile retrieved successfully', profile))
})

// create profile
export const createProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    
    const {
      bio,
      twitter,
      facebook,
      instagram,
      linkedin,
      youtube,
      profilePictureURL,
      tags,
    } = req.body

    const userId = Number(req.claims?.id)

    // Call the service with the profile data and the userId separately.
    const profile = await UserProfileService.createUserProfile(
      {
        bio,
        twitter,
        facebook,
        instagram,
        linkedin,
        youtube,
        profilePictureURL,
        tags,
      },
      userId,
    )

    res
      .status(200)
      .json(ResponseHelper.success('Profile created successfully', profile))
  },
)

// update profile
export const updateProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const {
      bio,
      twitter,
      facebook,
      instagram,
      linkedin,
      youtube,
      profilePictureURL,
      tags,
    } = req.body

    const userId = Number(req.claims?.id)

    const profile = await UserProfileService.updateUserProfile(
      {
        bio,
        twitter,
        facebook,
        instagram,
        linkedin,
        youtube,
        profilePictureURL,
        tags,
      },
      userId,
    )

    res
      .status(200)
      .json(ResponseHelper.success('Profile updated successfully', profile))
  },
)

export const getContributions = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = Number(+req.params.id)
    const contributions = await UserProfileService.getUserContributions(
      userId,
    )
    res
      .status(200)
      .json(
        ResponseHelper.success('Contributions fetched Successfully!', [
          contributions,
        ]),
      )
  },
)
