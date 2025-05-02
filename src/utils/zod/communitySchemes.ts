import { z } from 'zod'

export const CommunitySchema = z
  .object({
    name: z.string().min(1, 'Community name is required').max(100),
    description: z.string().max(500),
    bio: z.string().max(200),
    createdAt: z.union([z.string().datetime(), z.date()]).optional(),
    updatedAt: z.union([z.string().datetime(), z.date()]).optional(),
    coverImgURL: z.string().url().optional().nullable(),
    logoImgURL: z.string().url().optional().nullable(),
    Tags: z
      .array(z.string().min(1, 'Tag must be at least 1 character'))
      .optional(),
    isPublic: z.boolean().optional(),
  })
  .strict()
