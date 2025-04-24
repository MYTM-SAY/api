import { z } from 'zod'
import { prisma } from '../db/PrismaClient'
import { UserProfileSchema } from '../utils/zod/userProfileSchemes'

export const UserProfileRepo = {
  async findByUserId(userId: number) {
    const result = await prisma.userProfile.findUnique({
      where: { userId },
      select: { Tags: true },
    })
    return result
  },

  async getProfile(userId: number) {
    const result = await prisma.userProfile.findUnique({
      where: { userId },
      select: {
        bio: true,
        twitter: true,
        facebook: true,
        instagram: true,
        linkedin: true,
        youtube: true,
        profilePictureURL: true,
        Tags: true,
      },
    })
    return result
  },

  async connectOrCreateTags(
    tagNames: string[],
    isCommunityOnly: boolean = false,
  ) {
    if (!tagNames) return []
    return tagNames.map((name) => ({
      where: { name },
      create: { name, isCommunityOnly },
    }))
  },

  async createProfile(
    profile: z.infer<typeof UserProfileSchema>,
    userId: number,
  ) {
    const { tags, ...profileData } = profile

    const tagsData = await this.connectOrCreateTags(tags || [])

    return prisma.userProfile.create({
      data: {
        userId,
        ...profileData,
        Tags: tags ? { connectOrCreate: tagsData } : undefined,
      },
      include: { Tags: true },
    })
  },

  async updateProfile(
    profile: z.infer<typeof UserProfileSchema>,
    userId: number,
  ) {
    const { tags, ...profileData } = profile

    const tagsData = await this.connectOrCreateTags(tags || [])

    return prisma.userProfile.update({
      where: { userId },
      data: {
        ...profileData,
        ...(tags
          ? {
              Tags: {
                set: [],
                connectOrCreate: tagsData,
              },
            }
          : {}),
      },
      include: { Tags: true },
    })
  },

  async getUserContributions(id: number) {
    const result = await prisma.user.findUnique({
      where: { id },
      select: {
        UserContributions: true,
      },
    })
    return result
  },
}
