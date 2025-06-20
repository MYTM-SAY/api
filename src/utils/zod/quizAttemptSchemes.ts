import { QuizStatus } from '@prisma/client'
import { z } from 'zod'

// Output type for reference
export const QuizAttemptedSchema = z.object({
  status: z.enum([
    QuizStatus.InProgress,
    QuizStatus.Completed,
    QuizStatus.TimedOut,
  ]),
})

export const UpdateQuizAttemptedSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z
    .enum([QuizStatus.InProgress, QuizStatus.Completed, QuizStatus.TimedOut])
    .optional(),
  score: z.number().int().nonnegative().optional(),
})

export const EndQuizAttemptSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.number().int().positive(),
      answer: z.array(z.string().min(1)).nonempty(), // nonempty array of non-empty strings
    }),
  ),
})

export type EndQuizAttemptInput = z.infer<typeof EndQuizAttemptSchema>
export type UpdateQuizAttemptedInput = z.infer<typeof UpdateQuizAttemptedSchema>
