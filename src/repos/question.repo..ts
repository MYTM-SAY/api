import { prisma } from '../db/PrismaClient'
import { getQuestionsByQuizId } from '../services/questionService'
import { QuestionInput } from '../utils/zod/questionSchemes'

export const QuestionRepo = {
  async Create(data: QuestionInput) {
    return await prisma.question.create({
      data: data,
    })
  },
  async findById(id: number) {
    return await prisma.question.findUnique({
      where: { id },
    })
  },
  async findAllByClassroom(classroomId: number) {
    return await prisma.question.findMany({
      where: { classroomId },
    })
  },
  async update(id: number, data: Partial<QuestionInput>) {
    return await prisma.question.update({
      where: { id },
      data: data,
    })
  },
  async delete(id: number) {
    return await prisma.question.delete({
      where: { id },
    })
  },

  async getQuestionsByQuizId(quizId: number) {
    return await prisma.quizQuestion.findMany({
      where: { quizId },
      include: {
        Question: true,
      },
    })
  },
}
