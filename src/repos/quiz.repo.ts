import { prisma } from '../db/PrismaClient'
import { z } from 'zod'
import {
  CreateQuizWithQuestionsSchema,
  UpdateQuizSchema,
} from '../utils/zod/quizSchemes'
import { SaveUserAnswerInput } from '../utils/zod/SaveUserAnswerSchema '
import { IsCorrect } from '@prisma/client'

export const QuizRepo = {
  async createQuizWithQuestions(
    data: z.infer<typeof CreateQuizWithQuestionsSchema>,
  ) {
    const { quizQuestions, ...quizWithoutQuestions } = data

    return prisma.quiz.create({
      data: {
        ...quizWithoutQuestions,
        QuizQuestions: {
          create: quizQuestions,
        },
      },
      include: {
        QuizQuestions: {
          include: {
            Question: true,
          },
        },
      },
    })
  },

  async getQuizById(id: number) {
    return prisma.quiz.findUnique({
      where: { id },
      include: {
        QuizQuestions: {
          include: {
            Question: true,
          },
        },
      },
    })
  },

  async updateQuiz(id: number, data: z.infer<typeof UpdateQuizSchema>) {
    const { quizQuestions, ...quizData } = data

    return prisma.$transaction(async (tx) => {
      await tx.quiz.update({
        where: { id },
        data: quizData,
      })

      if (quizQuestions && quizQuestions.length > 0) {
        await tx.quizQuestion.deleteMany({
          where: { quizId: id },
        })

        await tx.quizQuestion.createMany({
          data: quizQuestions.map((q) => ({
            quizId: id,
            questionId: q.questionId,
            points: q.points,
          })),
        })
      }

      return tx.quiz.findUnique({
        where: { id },
        include: {
          QuizQuestions: {
            include: {
              Question: true,
            },
          },
        },
      })
    })
  },

  async deleteQuiz(id: number) {
    return prisma.quiz.delete({
      where: { id },
    })
  },

  async getQuizzesByClassroom(classroomId: number) {
    return prisma.quiz.findMany({
      where: { classroomId },
      orderBy: { startDate: 'asc' },
    })
  },
  async getQuizzesByCommunity(communityId: number) {
    return prisma.quiz.findMany({
      where: {
       communityId
      },
      orderBy: { startDate: 'asc' },
    })
  },
async   findAttemptsForUser(userId: number, quizIds: number[]) {
  return prisma.quizAttempted.findMany({
    where: {
      userId,
      quizId: { in: quizIds },
    },
    select: {
      quizId: true,
      status: true,
    },
  })
},

  async hasOverlappingQuiz(
    classroomId: number,
    startDate: Date,
    endDate: Date,
    excludeId?: number,
  ) {
    const where = {
      classroomId,
      ...(excludeId && { id: { not: excludeId } }),
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    }
    const count = await prisma.quiz.count({ where })
    return count > 0
  },

  async hasUserAnswered(userId: number, quizQuestionId: number) {
    return prisma.userAnswer.findFirst({
      where: { userId, quizQuestionId },
    })
  },

  async saveUserAnswer(
    data: SaveUserAnswerInput,
    userId: number,
    isCorrect: IsCorrect,
  ) {
    return prisma.userAnswer.create({
      data: {
        userId,
        ...data,
        isCorrect: isCorrect,
      },
    })
  },
}
