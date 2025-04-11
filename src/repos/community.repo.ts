import { Prisma } from '@prisma/client'
import { prisma } from '../db/PrismaClient'
import { CommunitySchema } from '../utils/zod/communitySchemes'
import { z } from 'zod'
import { join } from 'path'

export const CommunityRepo = {
  async findAll() {
    const results = await prisma.community.findMany()
    return results
  },

  async create(community: z.infer<typeof CommunitySchema>, userId: number) {
    const result = await prisma.community.create({
      data: {
        ...community,
        ownerId: userId,
      },
    })
    return result
  },

  async findById(id: number) {
    const result = await prisma.community.findUnique({
      where: { id },
      include: {
        Classrooms: true,
        Forums: {
          select: {
            Posts: true,
          },
        },
      },
    })
    return result
  },

  async update(id: number, post: Prisma.CommunityUpdateInput) {
    const result = await prisma.community.update({
      where: { id },
      data: post,
    })
    return result
  },

  async delete(id: number) {
    const result = await prisma.community.delete({
      where: { id },
    })
    return result
  },

  async getRecommendedCommunities(userTagIds: number[]) {
    // Query communities that share any of the user's tags
    const recommendedCommunities = await prisma.community.findMany({
      where: {
        Tags: {
          some: {
            id: { in: userTagIds },
          },
        },
      },
      include: { Tags: true, Owner: true },
    })
    return recommendedCommunities
  },

  async getPopularCommunities() {
    return prisma.community.findMany({
      orderBy: [{ Members: { _count: 'desc' } }, { createdAt: 'desc' }],
      include: {
        Tags: true,
        Owner: true,
      },
    })
  },

  // Search by Name and Tags (if tags sended if not search by name only)
  async searchCommunities(
    searchTerm: string = '',
    filterTagIds: number[] = [],
  ) {
    return prisma.community.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
        ...(filterTagIds && filterTagIds.length > 0
          ? { Tags: { some: { id: { in: filterTagIds } } } }
          : {}),
      },
      include: {
        Tags: true,
        Owner: true,
      },
    })
  },

  // number of joined communties
  async numberOfJoinedCommunties(id: number) {
    const result = await prisma.user.findUnique({
      where: { id },

      select: {
        _count: {
          select: {
            CommunityMembers: true,
          },
        },
      },
    })
  },
  async joinedCommunities(id: number) {
    // get all joined communities (id, name) by user id
    const communitiesForUser = await prisma.communityMembers.findMany({
      where: { userId: id },
      select: {
        Role: true,

        Community: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return communitiesForUser
  },
}
