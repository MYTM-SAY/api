import { z } from 'zod'

export const SaveUserAnswerSchema = z.object({
  quizQuestionId: z.number().int().positive(),
  choosedAnswer: z.string().min(1),
})

export type SaveUserAnswerInput = z.infer<typeof SaveUserAnswerSchema>
