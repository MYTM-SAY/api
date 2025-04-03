import { Prisma } from '@prisma/client'
import { prisma } from '../db/PrismaClient'

export const ForumRepo = {
  async create(
    forum: Omit<Prisma.ForumCreateInput, 'Community'>,
    communityId: number,
  ) {
    const result = await prisma.forum.create({
      data: { ...forum, communityId }, // TypeScript will enforce no community property
    })
    return result
  },
  async findAll() {
    const results = await prisma.forum.findMany({})
    return results
  },

  async findById(id: number) {
    const result = await prisma.forum.findUnique({
      where: { id },
    })
    return result
  },

  async update(id: number, forum: Prisma.ForumUpdateInput) {
    const result = await prisma.forum.update({
      where: { id },
      data: forum,
    })
    return result
  },

  async delete(id: number) {
    const result = await prisma.forum.delete({
      where: { id },
    })
    return result
  },
}
