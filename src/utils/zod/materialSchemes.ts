import { z } from 'zod'

const MaterialTypeEnum = z.enum(['VIDEO', 'AUDIO', 'IMG', 'DOC', 'FILE'], {})

export const CreateMaterialSchema = z
  .object({
    materialType: MaterialTypeEnum,
    fileUrl: z.string().url().nullable(),
  })
  .strict()

export const UpdateMaterialSchema = CreateMaterialSchema.strict().partial()

export const MaterialSchema = CreateMaterialSchema.extend({
  id: z.number().int().positive().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict()
