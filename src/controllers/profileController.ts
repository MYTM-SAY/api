import e, { NextFunction, Request, Response } from 'express';
import { UserProfileRepo } from '../repos/userProfile.repo';
import { UserRepo } from '../repos/user.repo';
import APIError from '../errors/APIError';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import exp from 'constants';

// public profile
export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {

      const profile = await UserProfileRepo.getProfile(Number(+req.params.id));
      if (!profile) throw new APIError('Profile not found', 404);
   
      res.status(200).json({ data: profile });

  } catch (error) {
    next(error);
  }
};

// create profile if you are the user
export const createProfile = async (
  req: AuthenticatedRequest, res: Response, next: NextFunction,
) => {
  try {
      const { userId, bio, twitter, facebook, instagram, linkedin, youtube, profilePictureURL } = req.body;
      if (userId !== req.user?.id) {
         return res.status(403).json({ message: 'Forbidden: You can only create your profile' });
      }
      const profile = await UserProfileRepo.createProfile({ userId, bio, twitter, facebook, instagram, linkedin, youtube, profilePictureURL });
      res.status(201).json({ data: profile });
   } catch (error) {
      next(error); }};

// update profile if you are the user
export const updateProfile = async (
   req: AuthenticatedRequest, res: Response, next: NextFunction,
   ) => {
   try {
         const { userId, bio, twitter, facebook, instagram, linkedin, youtube, profilePictureURL } = req.body;
         console.log(userId);
         if (userId !== req.user?.id) {
          return res.status(403).json({ message: 'Forbidden: You can only update your profile' });
         }
         console.log(userId);
         const profile = await UserProfileRepo.updateProfile({ userId, bio, twitter, facebook, instagram, linkedin, youtube, profilePictureURL });
         res.status(200).json({ data: profile });
    } catch (error) {
         next(error); }}


// number of contributions by user : number of posts, comments, postvotes, commentvotes
export const contributionsOfUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const contributions = await UserRepo.contributionsOfUser(Number(+req.params.id));
    res.status(200).json({ data: contributions });
  } catch (error) {
    next(error);
  }
};
  // return the communities names and Ids that the user is asscioed to , also their count
export const userCommunities = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const communities = await UserRepo.getCommunitiesOfUser(Number(+req.params.id));
    res.status(200).json({ data: communities });
  } catch (error) {
    next(error);
  }
}


// make a fun that return json name , bio , profile picture , social media links, Last Active , num of contributions, number of communities
// you can use the above functions to get the data
export const userPublicProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const details = await UserRepo.getNameAndUsername(Number(+req.params.id));
    const profile = await UserProfileRepo.getProfile(Number(+req.params.id));
    const contributions = await UserRepo.contributionsOfUser(Number(+req.params.id));
    const communities = await UserRepo.getCommunitiesOfUser(Number(+req.params.id));

    // retrun also the last active date and joinnded date
    // calc the last active date using the last login date from user repo
    // calc the joined date using the created at date from user repo
    const lastActive = await UserRepo.getLastLoginDate(Number(+req.params.id));
    const joinedDate = await UserRepo.getJoinnedDate(Number(+req.params.id));

    res.status(200).json({ data: { details ,profile, contributions, communities, lastActive, joinedDate } });
  } catch (error) {
    next(error);
  }
};