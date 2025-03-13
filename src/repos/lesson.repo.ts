import { z } from 'zod'
import { prisma } from '../db/PrismaClient'
import { LessonSchema } from '../utils'

export const LessonRepo = {
  async findAll() {
    const lessons = await prisma.lesson.findMany({
      include: {
        Section: true,
      },
    })
    return lessons
  },

  async findById(id: number) {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        Section: true,
      },
    })
    return lesson
  },

  async create(data: z.infer<typeof LessonSchema>) {
    const lesson = await prisma.lesson.create({
      data,
    })
    return lesson
  },

  async delete(id: number) {
    const lesson = await prisma.lesson.delete({
      where: {
        id,
      },
    })
    return lesson
  },

  async update(id: number, data: Partial<z.infer<typeof LessonSchema>>) {
    const updatedlesson = await prisma.lesson.update({
      where: { id },
      data,
    })
    return updatedlesson
  },
}
