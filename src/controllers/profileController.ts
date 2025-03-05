import { NextFunction, Request, Response } from 'express';
import { UserProfileRepo } from '../repos/userProfile.repo';
import APIError from '../errors/APIError';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';


export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

   //  const post = await PostRepo.findById(Number(req.params.id));
   //  if (!post) throw new APIError('Post not found', 404);
  
      const profile = await UserProfileRepo.getProfile(Number(req.params.id));
      if (!profile) throw new APIError('Profile not found', 404);
   
      res.status(200).json({ data: profile });

  } catch (error) {
    next(error);
  }
};
