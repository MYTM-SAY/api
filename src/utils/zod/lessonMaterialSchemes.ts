import { z } from 'zod'
import { CreateLessonSchema } from './lessonSchemes'
import { CreateMaterialSchema } from './materialSchemes'

export const CreateLessonWithMaterialSchema = z
  .object({
    lesson: CreateLessonSchema,
    materials: z.array(CreateMaterialSchema),
  })
  .strict()
