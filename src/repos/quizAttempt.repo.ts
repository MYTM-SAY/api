import { QuizAttempted, QuizStatus } from '@prisma/client'
import { prisma } from '../db/PrismaClient'
import { UpdateQuizAttemptedInput } from '../utils/zod/quizAttemptSchemes'

export const QuizAttemptRepo = {
  // ...existing methods...

  async startQuiz(
    userId: number,
    quizId: number,
    startDate: Date,
    endDate: Date,
    status: QuizStatus = QuizStatus.InProgress,
  ) {
    console.log(startDate, endDate, status)
    return prisma.quizAttempted.create({
      data: {
        status: status,
        userId,
        score: 0,
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
    data: Partial<UpdateQuizAttemptedInput>,
  ) {
    return prisma.quizAttempted.update({
      where: { id: QuizAttemptedId },
      data: {
        ...data,
      },
    })
  },
}
