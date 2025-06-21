import { QuizAttempted, QuizStatus } from '@prisma/client'
import { prisma } from '../db/PrismaClient'
import { submitQuizInput } from '../utils/zod/quizAttemptSchemes'

export const QuizAttemptRepo = {
  // ...existing methods...

  async startQuiz(
    userId: number,
    quizId: number,
    startDate: Date,
    endDate: Date,
    score: number = 0,
    status: QuizStatus = QuizStatus.InProgress,
  ) {
    return prisma.quizAttempted.create({
      data: {
        status: status,
        userId,
        score: score,
        startDate,
        endDate,
        quizId,
      },
    })
  },

  async findAttempt(userId: number, quizId: number) {
    return prisma.quizAttempted.findFirst({
      where: { userId, quizId },
    })
  },

  async updateQuizAttempt(
    QuizAttemptedId: number,
    data: Partial<submitQuizInput>,
  ) {
    return prisma.quizAttempted.update({
      where: { id: QuizAttemptedId },
      data: {
        ...data,
      },
    })
  },
}
