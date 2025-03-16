import { Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ message: 'Success', data: req.claims })
}
