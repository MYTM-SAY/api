import { QuizRepo } from '../repos/quiz.repo'
import { QuizValidationService } from './quizValidationService'
import { z } from 'zod'
import {
  CreateQuizWithQuestionsSchema,
  UpdateQuizSchema,
} from '../utils/zod/quizSchemes'
import { QuizAttemptRepo } from '../repos/quizAttempt.repo'
import APIError from '../errors/APIError'
import { Question, QuizQuestion, QuizStatus } from '@prisma/client'
import {
  EndQuizAttemptInput,
  submitQuizInput,
} from '../utils/zod/quizAttemptSchemes'
import { QuestionRepo } from '../repos/question.repo.'
type CorrectAnswerEntry = {
  correctAnswers: string[]
  points: number
}

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
  async getQuizzesByCommunity(userId: number, communityId: number) {
    await QuizValidationService.validateViewPermissions(userId, communityId)
    return QuizRepo.getQuizzesByCommunity(communityId)
  },
  async getQuizById(userId: number, id: number) {
    const quiz = await QuizValidationService.validateQuizExists(id)
    await QuizValidationService.validateViewPermissions(
      userId,
      quiz.classroomId,
    )
    const attempt = await QuizAttemptRepo.findAttempt(userId, id)
    const finalScore = getfinalScore(quiz.QuizQuestions)
    const isAttempted =
      attempt && attempt.status != QuizStatus.InProgress ? true : false

    return {
      ...quiz,
      questionCount: quiz.QuizQuestions.length,
      finalScore,
      isAttempted,
    }
  },

  async startAttempt(userId: number, quizId: number) {
    const quiz = await QuizValidationService.validateQuizExists(quizId)

    const now = new Date()
    if (now < quiz.startDate)
      throw new APIError('Quiz has not started yet', 403)
    if (now > quiz.endDate) throw new APIError('Quiz has already ended', 403)

    const existingAttempt = await QuizAttemptRepo.findAttempt(userId, quizId)
    if (existingAttempt && existingAttempt.status === QuizStatus.InProgress)
      throw new APIError('You have already started this quiz', 409)
    if (existingAttempt)
      throw new APIError('You have already started or completed this quiz', 403)

    const endDateForUser = new Date(
      quiz.endDate.getTime() + quiz.duration * 60 * 1000,
    )

    const attempt = await QuizAttemptRepo.startQuiz(
      userId,
      quizId,
      now,
      endDateForUser,
    )

    return attempt
  },

  async endAttempt(data: submitQuizInput, userId: number, quizId: number) {
    const quiz = await QuizValidationService.validateQuizExists(quizId)
    const attempt = await QuizAttemptRepo.findAttempt(userId, quizId)

    if (attempt) throw new APIError('You attempted the quiz before', 404)
    const questions = await QuestionRepo.getQuestionsByQuizId(quizId)
    const finalScore = getfinalScore(questions)
    const endAttempt = await QuizAttemptRepo.startQuiz(
      userId,
      quizId,
      data.startDate,
      data.endDate,
    )

    return {
      id: endAttempt.id,
      score: endAttempt.score,
      finalScore,
      studySuggestions: 'KYS',
    }
  },

  async submitQuiz(data: submitQuizInput, userId: number, quizId: number) {
    const quiz = await QuizValidationService.validateQuizExists(quizId)
    const attempt = await QuizAttemptRepo.findAttempt(userId, quizId)

    if (attempt) throw new APIError('You attempted the quiz before', 409)
    const questions = await QuestionRepo.getQuestionsByQuizId(quizId)
    const finalScore = getfinalScore(questions)

    if (data.score > finalScore)
      throw new APIError(
        `Score cannot be greater than the final score of ${finalScore}`,
        400,
      )

    const updatedAttempt = await QuizAttemptRepo.startQuiz(
      userId,
      quizId,
      data.startDate,
      data.endDate,
      data.score,
      QuizStatus.Completed,
    )

    return {
      id: updatedAttempt.id,
      score: updatedAttempt.score,
      finalScore,
      studySuggestions: 'KYS',
    }
  },
}

//the final day to work on this project so i tired for a long time to make it into seperated files
// ──────────── Helpers ───────────── //
function getfinalScore(questions: QuizQuestion[]): number {
  return questions.reduce((total, q) => total + (q.points ?? 0), 0)
}

function buildCorrectAnswersMap(
  quizQuestions: any[],
): Map<number, CorrectAnswerEntry> {
  return new Map(
    quizQuestions.map((q) => [
      q.questionId,
      {
        correctAnswers: q.Question.answer,
        points: q.points,
      },
    ]),
  )
}

function calculateScore(
  submittedAnswers: { questionId: number; answer: string[] }[],
  correctAnswersMap: Map<number, CorrectAnswerEntry>,
): number {
  let score = 0

  for (const submitted of submittedAnswers) {
    const correctEntry = correctAnswersMap.get(submitted.questionId)

    if (
      correctEntry &&
      isAnswerCorrect(submitted.answer, correctEntry.correctAnswers)
    )
      score += correctEntry.points
  }

  return score
}

function isAnswerCorrect(submitted: string[], correct: string[]): boolean {
  const submittedSet = new Set(submitted.map((a) => a.trim().toLowerCase()))
  const correctSet = new Set(correct.map((a) => a.trim().toLowerCase()))

  if (submittedSet.size !== correctSet.size) return false

  for (const val of correctSet) {
    if (!submittedSet.has(val)) return false
  }

  return true
}

async function validateActiveAttempt(userId: number, quizId: number) {
  const attempt = await QuizAttemptRepo.findAttempt(userId, quizId)

  if (!attempt || attempt.status !== QuizStatus.InProgress)
    throw new APIError('No active attempt found', 404)

  const now = new Date()
  if (now > attempt.endDate)
    throw new APIError('Time is up. You cannot submit the quiz anymore.', 403)

  return attempt
}
