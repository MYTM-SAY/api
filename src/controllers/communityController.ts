import { NextFunction, Request, Response } from 'express'
import APIError from '../errors/APIError'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { CommunityRepo } from '../repos/community.repo'
import { UserProfileRepo } from '../repos/userProfile.repo'
import { z } from 'zod'
import { CommunitySchema } from '../utils'
import { MemberRolesRepo } from '../repos/memberRoles.repo'

export const getCommunities = async (
  _: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const communities = await CommunityRepo.findAll()
    return res.status(200).json(communities)
  } catch (error) {
    next(error)
  }
}

export const discoverCommunities = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { searchTerm, tagIds } = req.query
    const tagIdsArray: number[] = tagIds
      ? tagIds.toString().split(',').map(Number)
      : []

    // If search parameters are provided, return search results
    if (searchTerm || tagIdsArray.length > 0) {
      const communities = await CommunityRepo.searchCommunities(
        searchTerm as string,
        tagIdsArray,
      )
      return res.json({ data: communities, type: 'search' })
    }

    // For authenticated users, return recommended communities
    if (req.user) {
      const userProfile = await UserProfileRepo.findByUserId(req.user.id)
      if (!userProfile) {
        throw new APIError('User profile not found', 404)
      }
      if (userProfile.Tags?.length > 0) {
        const userTagIds = userProfile.Tags.map((tag) => tag.id)
        const communities =
          await CommunityRepo.getRecommendedCommunities(userTagIds)
        return res.json({ data: communities, type: 'recommended' })
      }
    }
    // Fallback: Return popular communities
    const communities = await CommunityRepo.getPopularCommunities()
    return res.json({ data: communities, type: 'popular' })
  } catch (error) {
    next(error)
  }
}

export const getCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req?.params?.id || isNaN(+req?.params?.id)) {
      throw new APIError('Community not found', 404)
    }

    const community = await CommunityRepo.findById(+req.params.id)
    if (!community) throw new APIError('Community not found', 404)
    return res.status(200).json(community)
  } catch (error) {
    next(error)
  }
}

export const createCommunity = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const community = req.body as Omit<z.infer<typeof CommunitySchema>, 'id'>

    const newCommunity = await CommunityRepo.create({
      ...community,
      Owner: { connect: { id: req.user?.id } },
    })

    return res.status(201).json(newCommunity)
  } catch (error) {
    next(error)
  }
}

export const updateCommunity = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const requesterId = req.user?.id!
    if (!req?.params?.id || isNaN(+req?.params?.id)) {
      throw new APIError('Community not found', 404)
    }

    const community = await CommunityRepo.findById(+req.params.id)
    if (!community) throw new APIError('Community not found', 404)

    // TODO: make the sure the user is the owner of the community or a mod
    const [isAdmin, isOwner, isMod] = await Promise.all([
      MemberRolesRepo.isCommunityAdmin(requesterId, community.id),
      MemberRolesRepo.isCommunityOwner(requesterId, community.id),
      MemberRolesRepo.isCommunityMod(requesterId, community.id),
    ])

    if (!isAdmin && !isOwner && !isMod) {
      throw new APIError('Community not found', 404)
    }

    const communityUpdated = req.body as Omit<
      z.infer<typeof CommunitySchema>,
      'id'
    >
    const post = await CommunityRepo.update(+req.params.id, communityUpdated)

    return res.status(200).json(post)
  } catch (error) {
    next(error)
  }
}

export const deleteCommunity = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const commId = +req?.params?.id
    const requesterId = req.user?.id!

    if (!commId || isNaN(commId)) {
      throw new APIError('Community not found', 404)
    }

    const comm = await CommunityRepo.findById(commId)
    if (!comm) throw new APIError('Community not found', 404)

    const [isAdmin, isOwner] = await Promise.all([
      MemberRolesRepo.isCommunityAdmin(requesterId, commId),
      MemberRolesRepo.isCommunityOwner(requesterId, commId),
    ])

    if (!isOwner && !isAdmin) {
      throw new APIError('Unauthorized', 401)
    }

    await CommunityRepo.delete(+req.params.id)

    return res.status(204).end()
  } catch (error) {
    next(error)
  }
}
