import { QuizRepo } from '../repos/quiz.repo'
import { QuizValidationService } from './quizValidationService'
import { z } from 'zod'
import {
  CreateQuizWithQuestionsSchema,
  UpdateQuizSchema,
} from '../utils/zod/quizSchemes'

export const QuizService = {
  async createQuiz(
    userId: number,
    data: z.infer<typeof CreateQuizWithQuestionsSchema>,
  ) {
    const { classroomId, startDate, endDate, quizQuestions } = data

    await QuizValidationService.validateClassroomAndPermissions(
      userId,
      classroomId,
    )

    await QuizValidationService.validateTimeOverlap(
      classroomId,
      startDate,
      endDate,
    )

    const questionIds = quizQuestions.map((q) => q.questionId)
    await QuizValidationService.validateQuestionIds(questionIds, classroomId)

    const quiz = await QuizRepo.createQuizWithQuestions(data)
    return { ...quiz, questionCount: quiz.QuizQuestions.length }
  },

  async updateQuiz(
    userId: number,
    id: number,
    data: z.infer<typeof UpdateQuizSchema>,
  ) {
    console.log(data)
    const currentQuiz = await QuizValidationService.validateQuizExists(id)

    await QuizValidationService.validateClassroomAndPermissions(
      userId,
      currentQuiz.classroomId,
    )

    const newStartDate = data.startDate || currentQuiz.startDate
    const newEndDate = data.endDate || currentQuiz.endDate

    await QuizValidationService.validateTimeOverlap(
      currentQuiz.classroomId,
      newStartDate,
      newEndDate,
      id,
    )

    if (data.quizQuestions) {
      const questionIds = data.quizQuestions.map((q) => q.questionId)
      await QuizValidationService.validateQuestionIds(
        questionIds,
        currentQuiz.classroomId,
      )
    }

    const updatedQuiz = await QuizRepo.updateQuiz(id, data)
    return {
      ...updatedQuiz,
      questionCount: updatedQuiz?.QuizQuestions?.length || 0,
    }
  },

  async deleteQuiz(userId: number, id: number) {
    const currentQuiz = await QuizValidationService.validateQuizExists(id)
    await QuizValidationService.validateClassroomAndPermissions(
      userId,
      currentQuiz.classroomId,
    )
    return QuizRepo.deleteQuiz(id)
  },

  async getQuizzesByClassroom(userId: number, classroomId: number) {
    await QuizValidationService.validateViewPermissions(userId, classroomId)
    return QuizRepo.getQuizzesByClassroom(classroomId)
  },

  async getQuizById(userId: number, id: number) {
    const quiz = await QuizValidationService.validateQuizExists(id)
    await QuizValidationService.validateViewPermissions(
      userId,
      quiz.classroomId,
    )
    return { ...quiz, questionCount: quiz.QuizQuestions.length }
  },
}
