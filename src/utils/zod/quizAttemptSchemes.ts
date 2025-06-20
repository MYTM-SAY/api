import { QuizStatus } from '@prisma/client'
import { stat } from 'fs'
import { z } from 'zod'

// Output type for reference
export const QuizAttemptedSchema = z.object({
  status: z.enum([
    QuizStatus.InProgress,
    QuizStatus.Completed,
    QuizStatus.TimedOut,
  ]),
})

export const submitQuizSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
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
export type submitQuizInput = z.infer<typeof submitQuizSchema>
