import { z } from 'zod'

export const questionSchema = z
  .object({
    questionHeader: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
    answer: z.string().min(1),
    classroomId: z.number().int().positive(),
  })
  .strict()
  .refine((data) => data.options.includes(data.answer), {
    message: 'Answer must be one of the options',
  })

export type QuestionInput = z.infer<typeof questionSchema>
