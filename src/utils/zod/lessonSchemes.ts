import { z } from 'zod'
import { MaterialSchema } from './materialSchemes'

const BaseLessonSchema = z.object({
  name: z
    .string()
    .min(1, 'Lesson name is required')
    .max(100, 'Lesson name must be at most 100 characters'),
  notes: z
    .array(z.string())
     .optional(),
})

export const UpdateLessonSchema = BaseLessonSchema.strict().partial()

export const CreateLessonSchema = BaseLessonSchema.extend({
  sectionId: z.number().int().positive(),
}).strict()

export const LessonSchema = CreateLessonSchema.extend({
  id: z.number().int().positive().optional(),
  materials: z.array(MaterialSchema).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict()
