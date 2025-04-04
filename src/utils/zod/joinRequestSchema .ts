import { z } from 'zod'

export const joinRequestSchema = z.object({
  userId: z.number().int().positive(),
  communityId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type JoinRequestType = z.infer<typeof joinRequestSchema>
