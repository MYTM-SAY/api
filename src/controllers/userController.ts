import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { UserRepo } from '../repos/user.repo'
import { asyncHandler } from '../utils/asyncHandler'
import { UserService } from '../services/userService'
import { ResponseHelper } from '../utils/responseHelper';



// if you want to test claims
export const getMe = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {  
    res.status(200).json(ResponseHelper.success('User retrieved successfully', req.claims))
  }
)

// controller to get user data by ID, publicly available
export const getUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = +req.params.userId
    const user = await UserService.getUserById(userId)
    res.status(200).json(ResponseHelper.success('User retrieved successfully', user))
  }
)