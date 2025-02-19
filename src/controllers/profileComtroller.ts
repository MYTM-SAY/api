import { NextFunction, Request, Response } from 'express';
import { UserRepo} from '../repos/user.repo';


import APIError from '../errors/APIError';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';



export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await UserRepo.findById(Number(req.params.id));
    if (!user) throw new APIError('Post not found', 404);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

