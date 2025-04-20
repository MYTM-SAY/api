import { z } from 'zod'
import { prisma } from '../db/PrismaClient'
import { ClassroomSchema } from '../utils'

export const ClassroomRepo = {
  async findAll() {
    const classrooms = await prisma.classroom.findMany({
      include: {
        Community: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return classrooms
  },

  async findbyId(id: number) {
    const classroom = await prisma.classroom.findUnique({
      where: { id },
      include: {
        Community: true,
      },
    })
    return classroom
  },

  async findByCommunityId(communityId: number) {
    const classrooms = await prisma.classroom.findMany({
      where: { communityId },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return classrooms
  },

  async create(data: z.infer<typeof ClassroomSchema>) {
    const classroom = await prisma.classroom.create({
      data,
    })
    return classroom
  },

  async delete(id: number) {
    const classroom = await prisma.classroom.delete({
      where: {
        id,
      },
    })
    return classroom
  },

  async update(id: number, data: Partial<z.infer<typeof ClassroomSchema>>) {
    const updatedClassroom = await prisma.classroom.update({
      where: { id },
      data,
    })

    return updatedClassroom
  },
}
