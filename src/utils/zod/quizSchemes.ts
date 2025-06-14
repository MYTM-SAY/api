import { z } from 'zod'
import { QuizQuestionSchema } from '../zod/quizQuestionSchemes'

const QuizValidations = {
  validateDurationEndDate: (
    data: { startDate?: Date; endDate?: Date; duration?: number },
    isRequired = true,
  ) => {
    const { startDate, endDate, duration } = data

    if (isRequired) {
      if (!startDate || !endDate || !duration) return false
      const endDuration = new Date(startDate.getTime() + duration * 60000)
      return endDuration <= endDate
    } else {
      if (startDate && endDate && duration) {
        const endDuration = new Date(startDate.getTime() + duration * 60000)
        return endDuration <= endDate
      }
      return true
    }
  },

  validateUniqueQuestions: (
    data: { quizQuestions?: Array<{ questionId: number }> },
    isRequired = true,
  ) => {
    const { quizQuestions } = data

    if (isRequired) {
      if (!quizQuestions || quizQuestions.length === 0) return false
      const questionIds = quizQuestions.map((q) => q.questionId)
      return new Set(questionIds).size === questionIds.length
    } else {
      if (quizQuestions && quizQuestions.length > 0) {
        const questionIds = quizQuestions.map((q) => q.questionId)
        return new Set(questionIds).size === questionIds.length
      }
      return true
    }
  },

  validateFutureDate: (data: { startDate?: Date }, isRequired = true) => {
    const { startDate } = data

    if (isRequired) {
      if (!startDate) return false
      return startDate.getTime() >= Date.now()
    } else {
      if (startDate) {
        return startDate.getTime() >= Date.now()
      }
      return true
    }
  },
}

const BaseQuizSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters'),
    duration: z.number().int().positive('Duration must be a positive integer'),
    startDate: z.string().transform((val) => new Date(val)),
    endDate: z.string().transform((val) => new Date(val)),
    classroomId: z
      .number()
      .int()
      .positive('Classroom ID must be a positive integer'),
    active: z.boolean(),
    quizQuestions: z.array(QuizQuestionSchema),
  })
  .strict()

export const CreateQuizWithQuestionsSchema = BaseQuizSchema.refine(
  (data) => QuizValidations.validateDurationEndDate(data, true),
  {
    message:
      'The calculated end time of the quiz exceeds the specified end date.',
    path: ['duration', 'endDate'],
  },
)
  .refine((data) => QuizValidations.validateUniqueQuestions(data, true), {
    message:
      'Duplicate question IDs found. Each question can only be added once',
    path: ['quizQuestions'],
  })
  .refine((data) => QuizValidations.validateFutureDate(data, true), {
    message: 'Start date must be in the future.',
    path: ['startDate'],
  })

export const UpdateQuizSchema = BaseQuizSchema.omit({ classroomId: true })
  .partial()
  .refine((data) => QuizValidations.validateDurationEndDate(data, false), {
    message:
      'The calculated end time of the quiz exceeds the specified end date.',
    path: ['duration'],
  })
  .refine((data) => QuizValidations.validateUniqueQuestions(data, false), {
    message:
      'Duplicate question IDs found. Each question can only be added once',
    path: ['quizQuestions'],
  })
  .refine((data) => QuizValidations.validateFutureDate(data, false), {
    message: 'Start date must be in the future.',
    path: ['startDate'],
  })
