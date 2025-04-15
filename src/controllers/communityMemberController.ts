import { NextFunction, Request, Response } from 'express'

import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { asyncHandler } from '../utils/asyncHandler'
import { CommunityMembersRepo } from '../repos/communityMember.repo'
import { Role } from '@prisma/client'
import { ResponseHelper } from '../utils/responseHelper'
import { CommunityAuthrizationService } from '../services/communityAuthrization'


export const getUsersInCommunity = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const communityId = +req.params.id
    const userId = req.claims!.id
    const isOwner = await CommunityAuthrizationService.hasRoles(userId, communityId, [Role.OWNER])
    if (!isOwner)
      return res.status(403).json(ResponseHelper.error('Access Denied'));

    const members = await CommunityAuthrizationService.getAllUsersInCommunity(communityId)

    return res.status(201).json(
      ResponseHelper.success('users fetched successfully', members),
    )
  },
)