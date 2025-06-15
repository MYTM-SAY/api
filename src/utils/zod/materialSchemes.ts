import { z } from 'zod'

const MaterialTypeEnum = z.enum(['VIDEO', 'AUDIO', 'IMG', 'DOC', 'FILE'], {})

export const CreateMaterialSchema = z
  .object({
    materialType: MaterialTypeEnum,
    fileUrl: z.string().url().nullable(),
    duration: z.number().int().positive().nullable().optional(),
  })
  .strict()

export const UpdateMaterialSchema = CreateMaterialSchema.strict().partial()

export const MaterialSchema = CreateMaterialSchema.extend({
  id: z.number().int().positive().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict()

export const CreateMaterialWithLessonSchema = CreateMaterialSchema.extend({
  lessonId: z.number().int().positive(),
})
