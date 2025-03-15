import { NextFunction, Response } from 'express'
import { UserProfileRepo } from '../repos/userProfile.repo'
import APIError from '../errors/APIError'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'

// public profile
export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await UserProfileRepo.getProfile(Number(+req.params.id))
    if (!profile) throw new APIError('Profile not found', 404)

    res.status(200).json({ data: profile })
  } catch (error) {
    next(error)
  }
}

// create profile if you are the user
export const createProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      userId,
      bio,
      twitter,
      facebook,
      instagram,
      linkedin,
      youtube,
      profilePictureURL,
    } = req.body
    if (userId !== req.claims?.id) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You can only create your profile' })
    }
    const profile = await UserProfileRepo.createProfile({
      userId,
      bio,
      twitter,
      facebook,
      instagram,
      linkedin,
      youtube,
      profilePictureURL,
    })
    res.status(201).json({ data: profile })
  } catch (error) {
    next(error)
  }
}

// update profile if you are the user
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      userId,
      bio,
      twitter,
      facebook,
      instagram,
      linkedin,
      youtube,
      profilePictureURL,
    } = req.body
    if (userId !== req.claims?.id) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You can only update your profile' })
    }
    const profile = await UserProfileRepo.updateProfile({
      userId,
      bio,
      twitter,
      facebook,
      instagram,
      linkedin,
      youtube,
      profilePictureURL,
    })
    res.status(200).json({ data: profile })
  } catch (error) {
    next(error)
  }
}
