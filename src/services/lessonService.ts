import { LessonRepo } from '../repos/lesson.repo'
import APIError from '../errors/APIError'
import z from 'zod'
import {
  CreateLessonSchema,
  UpdateLessonSchema,
} from '../utils/zod/lessonSchema'
import { CreateMaterialSchema } from '../utils/zod/materialSchemes'

const getLessonsBySectionId = async (sectionId: number) => {
  return LessonRepo.findBySectionId(sectionId)
}

const getLessonById = async (id: number) => {
  const lesson = await LessonRepo.findById(id)
  if (!lesson) throw new APIError('Lesson not found', 404)
  return lesson
}

const createLessonWithNewMaterial = async (
  lessonData: z.infer<typeof CreateLessonSchema>,
  materialData: z.infer<typeof CreateMaterialSchema>,
) => {
  return LessonRepo.createWithMaterial(lessonData, materialData)
}

const deleteLesson = async (id: number) => {
  const lessonExists = await LessonRepo.findById(id)
  if (!lessonExists) throw new APIError('Lesson not found', 404)
  const lesson = await LessonRepo.delete(id)
  if (!lesson) throw new APIError('Lesson not found', 404)
  return lesson
}

const updateLesson = async (
  id: number,
  data: z.infer<typeof UpdateLessonSchema>,
) => {
  const lessonExists = await LessonRepo.findById(id)
  if (!lessonExists) throw new APIError('Lesson not found', 404)
  const updatedLesson = await LessonRepo.update(id, data)
  return updatedLesson
}

export const LessonService = {
  getLessonsBySectionId,
  getLessonById,
  createLessonWithNewMaterial,
  deleteLesson,
  updateLesson,
}
