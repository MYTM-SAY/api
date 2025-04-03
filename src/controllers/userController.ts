import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { UserRepo } from '../repos/user.repo'
import { asyncHandler } from '../utils/asyncHandler'
import { UserService } from '../services/userService'
import { UserSchemaPublic } from '../utils/zod/userSchemes'
import { ResponseHelper } from '../utils/responseHelper';



export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ message: 'Success', data: req.claims })
}

// Get user , use response helper to send the response

export const getUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = +req.params.userId
    const user = await UserService.getUserById(userId)
    res.status(200).json(ResponseHelper.success('User retrieved successfully', user))
  }
)