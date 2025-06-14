import { z } from 'zod'

export const questionSchema = z
  .object({
    questionHeader: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
    answer: z.array(z.string().min(1)).min(1), // 👈 now always array
    classroomId: z.number().int().positive(),
    type: z.enum(['SINGLE', 'MULTI', 'TRUE_FALSE']),
  })
  .strict()
  .refine(
    (data) => {
      const answers = Array.isArray(data.answer) ? data.answer : [data.answer]
      return answers.every((a) => data.options.includes(a))
    },
    {
      message: 'All answers must be included in the options',
      path: ['answer'],
    },
  )

export type QuestionInput = z.infer<typeof questionSchema>
