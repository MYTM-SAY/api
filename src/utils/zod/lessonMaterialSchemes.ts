import { object } from 'zod'
import { CreateLessonSchema } from './lessonSchemes'
import { CreateMaterialSchema } from './materialSchemes'

export const CreateLessonWithMaterialSchema = object({
  lesson: CreateLessonSchema,
  material: CreateMaterialSchema,
}).strict()
