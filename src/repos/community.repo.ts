import { Prisma } from '@prisma/client'
import { prisma } from '../db/PrismaClient'
import { CommunitySchema } from '../utils/zod/communitySchemes'
import { z } from 'zod'

export const CommunityRepo = {
  async findAll() {
    const results = await prisma.community.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return results
  },
  // get community by fourm id
  async findByForumId(forumId: number) {
    const result = await prisma.forum.findUnique({
      where: { id: forumId },
      include: {
        Community: {
          include: {
            Tags: true,
            Owner: true,
          },
        },
      },
    })
    return result?.Community
  },

  async create(community: z.infer<typeof CommunitySchema>, userId: number) {
    const { Tags, ...rest } = community

    const result = await prisma.community.create({
      data: {
        ...rest,
        ownerId: userId,
        ...(Tags && {
          Tags: {
            connectOrCreate: Tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        }),
      },
      include: {
        Tags: true,
      },
    })

    return result
  },

  async findById(communityId: number) {
    const result = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        Forums: {
          select: {
            id: true,
            title: true,
          },
        },
        Tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    return result
  },

  async update(id: number, post: Partial<z.infer<typeof CommunitySchema>>) {
    const { Tags, ...rest } = post

    const updateData: Prisma.CommunityUpdateInput = {
      ...rest,
      ...(Tags && {
        Tags: {
          set: [],
          connectOrCreate: Tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      }),
    }

    const result = await prisma.community.update({
      where: { id },
      data: updateData,
      include: { Tags: true },
    })

    return result
  },

  async delete(id: number) {
    const result = await prisma.community.delete({
      where: { id: id },
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
      orderBy: {
        createdAt: 'desc',
      },
    })
    return recommendedCommunities
  },

  async getPopularCommunities() {
    return prisma.community.findMany({
      orderBy: [
        { CommunityMembers: { _count: 'desc' } },
        { createdAt: 'desc' },
      ],
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
      orderBy: {
        createdAt: 'desc',
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
    const communitiesForUser = await prisma.communityMembers.findMany({
      where: { userId: id },
      select: {
        Role: true,
        Community: {
          include: {
            _count: {
              select: {
                CommunityMembers: true,
              },
            },
            Owner: {
              select: {
                id: true,
                fullname: true,
                username: true,
              },
            },
          },
        },
      },
    })

    return communitiesForUser
  },

  async getAllUsersInACommunity(id: number) {
    const usersCount = await prisma.communityMembers.count({
      where: {
        communityId: id,
      },
    })
    return usersCount
  },

  async getAllOnlineUsersInACommunity(id: number) {
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000)

    const usersCount = await prisma.communityMembers.count({
      where: {
        communityId: id,
        User: {
          lastLogin: {
            gte: threeMinutesAgo,
          },
        },
      },
    })
    return usersCount
  },
}
