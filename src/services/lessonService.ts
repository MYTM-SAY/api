import { LessonRepo } from '../repos/lesson.repo'
import APIError from '../errors/APIError'
import z from 'zod'
import { UpdateLessonSchema } from '../utils/zod/lessonSchemes'
import { SectionRepo } from '../repos/section.repo'
import { CreateLessonWithMaterialSchema } from '../utils/zod/lessonMaterialSchemes'

const getLessonsBySectionId = async (sectionId: number) => {
  const sectionExist = await SectionRepo.findById(sectionId)
  if (!sectionExist) throw new APIError('Section not found', 404)
  return LessonRepo.findBySectionId(sectionId)
}

const getLessonById = async (id: number) => {
  const lesson = await LessonRepo.findById(id)
  if (!lesson) throw new APIError('Lesson not found', 404)
  return lesson
}

const createLessonWithNewMaterial = async (
  data: z.infer<typeof CreateLessonWithMaterialSchema>,
) => {
  const sectionExist = await SectionRepo.findById(data.lesson.sectionId)
  if (!sectionExist) throw new APIError('Section not found', 404)
  return LessonRepo.createWithMaterial(data)
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
