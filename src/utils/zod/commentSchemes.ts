import { z } from 'zod'

export const CommentSchema = z
  .object({
    id: z.number().int().positive().optional(),
    content: z
      .string()
      .max(1000, 'Content must be at most 1000 characters')
      .nullable(),
    parentId: z.number().int().positive().nullable().optional(),
    postId: z.number().int().positive(),
    authorId: z.number().int().positive().optional(),
  })
  .strict()
