import { z } from 'zod'

const BaseSectionSchema = z.object({
  name: z
    .string()
    .min(1, 'Section name is required')
    .max(100, 'Section name must be at most 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .nullable()
    .optional(),
  isCompleted: z.boolean().optional(),
})

export const UpdateSectionSchema = BaseSectionSchema.strict().partial()

export const CreateSectionSchema = BaseSectionSchema.extend({
  classroomId: z.number().int().positive(),
}).strict()

export const SectionSchema = CreateSectionSchema.extend({
  id: z.number().int().positive().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict()
