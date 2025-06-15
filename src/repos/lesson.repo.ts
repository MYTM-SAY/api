import { z } from 'zod'
import { prisma } from '../db/PrismaClient'
import { UpdateLessonSchema } from '../utils/zod/lessonSchemes'
import { CreateLessonWithMaterialSchema } from '../utils/zod/lessonMaterialSchemes'

export const LessonRepo = {
  async findBySectionId(id: number, userId: number) {
    const lessons = await prisma.lesson.findMany({
      where: {
        sectionId: id,
      },
      include: {
        Materials: true,
        CompletedLessons: {
          where: {
            userId, // This should be replaced with the actual user ID from the context
          },
        },
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
        Materials: true,
        Section: {
          include: {
            Classroom: true,
          },
        },
      },
    })
    return lesson
  },

  async createWithMaterial(
    data: z.infer<typeof CreateLessonWithMaterialSchema>,
  ) {
    const lesson = await prisma.lesson.create({
      data: {
        ...data.lesson,
        Materials: {
          create: data.materials,
        },
      },
      include: { Materials: true },
    })
    return lesson
  },

  async delete(id: number) {
    await prisma.completedLessons.deleteMany({
      where: {
        lessonId: id,
      },
    })
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
      include: { Materials: true },
    })
    return updatedlesson
  },

  async findCompletedLessonForUser(lessonId: number, userId: number) {
    const completedLesson = await prisma.completedLessons.findFirst({
      where: {
        lessonId,
        userId,
      },
    })
    return completedLesson
  },

  async toggleUnCompleted(lessonId: number, userId: number) {
    await prisma.completedLessons.delete({
      where: {
        userId_lessonId: {
          lessonId,
          userId,
        },
      },
    })
  },

  async toggleCompleted(lessonId: number, userId: number) {
    await prisma.completedLessons.create({
      data: {
        lessonId,
        userId,
      },
    })
  },
}
