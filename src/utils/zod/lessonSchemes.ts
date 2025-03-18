import { z } from 'zod'

const BaseLessonSchema = z.object({
  name: z
    .string()
    .min(1, 'Lesson name is required')
    .max(100, 'Lesson name must be at most 100 characters'),
  notes: z
    .string()
    .max(5000, 'Notes must be at most 5000 characters')
    .nullable()
    .optional(),
})

export const UpdateLessonSchema = BaseLessonSchema.strict().partial()

export const CreateLessonSchema = BaseLessonSchema.extend({
  sectionId: z.number().int().positive(),
}).strict()

export const LessonSchema = CreateLessonSchema.extend({
  id: z.number().int().positive().optional(),
  materialId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict()
