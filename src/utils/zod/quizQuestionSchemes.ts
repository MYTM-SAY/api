import { z } from 'zod'

export const QuizQuestionSchema = z.object({
  questionId: z
    .number()
    .int()
    .positive('Question ID must be a positive integer'),
  points: z.number().int().positive('Points must be a positive integer'),
})

export const UpdateQuizQuestionSchema = QuizQuestionSchema.partial()
