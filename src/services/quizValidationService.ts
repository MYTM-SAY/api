// quizValidation.service.ts
import APIError from '../errors/APIError'
import { CommunityMembersRepo } from '../repos/communityMember.repo'
import { QuizRepo } from '../repos/quiz.repo'
import { Role } from '@prisma/client'
import { prisma } from '../db/PrismaClient'

export const QuizValidationService = {
  async validateClassroomAndPermissions(userId: number, classroomId: number) {
    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
      include: { Community: true },
    })
    if (!classroom) {
      throw new APIError('Classroom not found', 404)
    }

    const role = await CommunityMembersRepo.getUserRoleInCommunity(
      userId,
      classroom.Community.id,
    )
    if (role === Role.MEMBER) {
      throw new APIError('Unauthorized to modify quiz in this classroom', 403)
    }

    return classroom
  },

  async validateQuestionIds(questionIds: number[], classroomId: number) {
    if (!questionIds || questionIds.length === 0) {
      return // No questions to validate
    }

    const validQuestions = await prisma.question.findMany({
      where: {
        id: { in: questionIds },
        classroomId: classroomId,
      },
      select: { id: true },
    })

    if (validQuestions.length !== questionIds.length) {
      const validIds = new Set(validQuestions.map((q) => q.id))
      const invalidIds = questionIds.filter((id) => !validIds.has(id))

      throw new APIError(
        `Invalid question IDs: ${invalidIds.join(', ')}. ` +
          "Questions either don't exist or don't belong to this classroom.",
        400,
      )
    }
  },

  async validateTimeOverlap(
    classroomId: number,
    startDate: Date,
    endDate: Date,
    excludeQuizId?: number,
  ) {
    const hasOverlap = await QuizRepo.hasOverlappingQuiz(
      classroomId,
      startDate,
      endDate,
      excludeQuizId,
    )
    if (hasOverlap) {
      throw new APIError(
        'Quiz time overlaps with an existing quiz in this classroom',
        409,
      )
    }
  },

  async validateQuizExists(id: number) {
    const quiz = await QuizRepo.getQuizById(id)
    if (!quiz) {
      throw new APIError('Quiz not found', 404)
    }
    return quiz
  },

  async validateViewPermissions(userId: number, classroomId: number) {
    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
      include: { Community: true },
    })
    if (!classroom) {
      throw new APIError('Classroom not found', 404)
    }

    // const isAuthorized = await CommunityMembersRepo.getUserRoleInCommunity(
    //   userId,
    //   classroom.Community.id,
    // )
    // if (!isAuthorized) {
    //   throw new APIError('Unauthorized to view quizzes in this classroom', 403)
    // }

    return classroom
  },
}
