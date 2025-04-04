import { z } from 'zod'

export const joinRequestSchema = z.object({
  userId: z.number().int().positive(),
  communityId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})
export const updateJoinRequestStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  communityId: z.number().int().positive(),
})
export type JoinRequestType = z.infer<typeof joinRequestSchema>
export type UpdateJoinRequestType = z.infer<
  typeof updateJoinRequestStatusSchema
>
