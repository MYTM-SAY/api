import { z } from 'zod'
import { prisma } from '../db/PrismaClient'
import {
  CreateLessonSchema,
  UpdateLessonSchema,
} from '../utils/zod/lessonSchema'
import { MaterialSchema } from '../utils/zod/materialSchemes'

export const LessonRepo = {
  async findBySectionId(id: number) {
    const lessons = await prisma.lesson.findMany({
      where: {
        sectionId: id,
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

  async createWithMaterial(
    lessonData: z.infer<typeof CreateLessonSchema>,
    materialData: z.infer<typeof MaterialSchema>,
  ) {
    return prisma.$transaction(async (tx) => {
      const material = await tx.material.create({ data: materialData })
      const lesson = await tx.lesson.create({
        data: {
          ...lessonData,
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
