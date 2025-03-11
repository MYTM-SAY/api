import { NextFunction, Response } from 'express'
import APIError from '../errors/APIError'
import { MemberRolesRepo } from '../repos/memberRoles.repo'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'

export const promoteToModerator = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { communityId, userId } = req.params
    const requesterId = req.user?.id!

    if (isNaN(+communityId) || isNaN(+userId)) {
      return next(new APIError('Invalid communityId or userId', 400))
    }

    if (+userId === requesterId) {
      return res.status(403).json({ message: 'You are already a moderator' })
    }

    const updatedMember = await MemberRolesRepo.assignModRole(
      +userId,
      +communityId,
    )

    return res
      .status(200)
      .json({ message: 'User promoted to Moderator', updatedMember })
  } catch (error) {
    return next(error)
  }
}

export const demoteFromModerator = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { communityId, userId } = req.params
    const requesterId = req.user?.id!

    if (isNaN(+communityId) || isNaN(+userId)) {
      return next(new APIError('Invalid communityId or userId', 400))
    }

    if (+userId === requesterId) {
      return res.status(403).json({ message: "You can't remove your own role" })
    }

    const updatedMember = await MemberRolesRepo.removeModRole(
      +userId,
      +communityId,
    )

    return res
      .status(200)
      .json({ message: 'User removed as Moderator', updatedMember })
  } catch (error) {
    return next(error)
  }
}
