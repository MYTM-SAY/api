import { z } from 'zod'
import { prisma } from '../db/PrismaClient'
import APIError from '../errors/APIError'
import { ClassroomSchema, QuerySchema } from '../utils'

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

  async findbyId(id: number, includes?: QuerySchema) {
    console.log('includes', includes)
    const classroom = await prisma.classroom.findUnique({
      where: { id },
      include: {
        Community: true,
        Sections: includes?.section
          ? {
              include: {
                Lessons: includes?.lesson
                  ? { include: { Materials: true } }
                  : false,
              },
            }
          : false,
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


  async countLessons(classroomId: number) {
    const count = await prisma.lesson.count({
      where: { Section: { classroomId } },
    })
    return count
  },
  async countCompletedLessons(userId: number) {
    const count = await prisma.completedLessons.count({
      where: { userId },
    })
    return count
  },
}
