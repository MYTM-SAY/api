import { Request, Response } from 'express'
import { AuthService } from '../services/authService'
import { ResponseHelper } from '../utils/responseHelper'
import { asyncHandler } from '../utils/asyncHandler'

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { password, ...userData } = req.body
  const newUser = await AuthService.register({ ...userData, password })
  return res
    .status(201)
    .json(ResponseHelper.success('User registered successfully', newUser))
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  
  const { email, password } = req.body
  const result = await AuthService.login(email, password)
  return res
    .status(200)
    .json(ResponseHelper.success('User logged in successfully', result))
})

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken
    const result = await AuthService.refreshToken(refreshToken)
    return res
      .status(200)
      .json(ResponseHelper.success('Token refreshed successfully', result))
  },
)
