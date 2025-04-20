import { z } from 'zod'
import { prisma } from '../db/PrismaClient'
import { UpdateLessonSchema } from '../utils/zod/lessonSchemes'
import { CreateLessonWithMaterialSchema } from '../utils/zod/lessonMaterialSchemes'

export const LessonRepo = {
  async findBySectionId(id: number) {
    const lessons = await prisma.lesson.findMany({
      where: {
        sectionId: id,
      },
      include: {
        Material: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return lessons
  },

  async findById(id: number) {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        Material: true,
      },
    })
    return lesson
  },

  async createWithMaterial(
    data: z.infer<typeof CreateLessonWithMaterialSchema>,
  ) {
    return prisma.$transaction(async (tx) => {
      const material = await tx.material.create({ data: data.material })
      const lesson = await tx.lesson.create({
        data: {
          ...data.lesson,
          materialId: material.id,
        },
        include: { Material: true },
      })
      return lesson
    })
  },

  async delete(id: number) {
    const lesson = await prisma.lesson.delete({
      where: {
        id,
      },
    })
    return lesson
  },

  async update(id: number, data: z.infer<typeof UpdateLessonSchema>) {
    const updatedlesson = await prisma.lesson.update({
      where: { id },
      data,
    })
    return updatedlesson
  },
}
