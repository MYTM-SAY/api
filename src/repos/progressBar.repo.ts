import { prisma } from '../db/PrismaClient';
import APIError from '../errors/APIError';

export const progressBarRepo = {
  async changeLessonStatus(communityId: number, classroomId: number, lessonId: number, userId: number) {
    try {
      const lesson = await prisma.lesson.findUnique({
        where: {
          id: lessonId,
          Section: {
            classroomId,
            Classroom: {
              communityId,
            },
          },
        },
      });

      if (!lesson) throw new APIError('Lesson not found', 404);

      const existingCompletion = await prisma.completedLessons.findUnique({
        where: {
          userId_lessonId_communityId_classroomId: {
            userId,
            lessonId,
            communityId,
            classroomId,
          },
        },
      });

      if (existingCompletion) {
        await prisma.completedLessons.delete({
          where: {
            userId_lessonId_communityId_classroomId: {
              userId,
              lessonId,
              communityId,
              classroomId,
            },
          },
        });
        return { message: 'Lesson status reverted to incomplete' };
      }

      await prisma.completedLessons.create({
        data: { userId, lessonId, communityId, classroomId },
      });

      return { message: 'Lesson marked as completed' };
    } catch (error) {
      if (error instanceof Error) {
        throw new APIError(error.message || 'Error changing lesson status', 500);
      }
      throw new APIError('Error changing lesson status', 500);
    }
  },

  async updateClassroomProgress(communityId: number, classroomId: number, userId: number) {
    try {
      const classroom = await prisma.classroom.findUnique({ where: { id: classroomId, communityId } });
      if (!classroom) throw new APIError('Classroom not found', 404);

      const totalLessons = await prisma.lesson.count({ where: { Section: { classroomId } } });
      const completedLessons = await prisma.completedLessons.count({
        where: {
          userId,
          communityId,
          Lesson: { Section: { classroomId } },
        },
      });

      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      const updatedProgress = await prisma.progress.upsert({
        where: { userId_classroomId: { userId, classroomId } },
        update: { progress },
        create: { userId, classroomId, progress },
      });

      return { progress: updatedProgress.progress, message: 'Progress updated successfully' };
    } catch (error) {
      throw new APIError((error as any).message || 'Error updating classroom progress', 500);
    }
  },
};
