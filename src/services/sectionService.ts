import { SectionRepo } from '../repos/section.repo'
import APIError from '../errors/APIError'
import z from 'zod'
import {
  CreateSectionSchema,
  UpdateSectionSchema,
} from '../utils/zod/sectionSchemes'
import { ClassroomRepo } from '../repos/classroom.repo'

const getSectionsByClassroomId = async (classroomId: number) => {
  const classroomExist = await ClassroomRepo.findbyId(classroomId)
  if (!classroomExist) throw new APIError('Classroom not found')
  return SectionRepo.findByClassroomId(classroomId)
}

const getSectionById = async (id: number) => {
  const section = await SectionRepo.findById(id)
  if (!section) throw new APIError('Section not found', 404)
  return section
}

const createSection = async (data: z.infer<typeof CreateSectionSchema>) => {
  const classroomExist = await ClassroomRepo.findbyId(data.classroomId)
  if (!classroomExist) throw new APIError('Classroom not found')
  return SectionRepo.create(data)
}

const deleteSection = async (id: number) => {
  const sectionExists = await SectionRepo.findById(id)
  if (!sectionExists) throw new APIError('Section not found', 404)
  const section = await SectionRepo.delete(id)
  if (!section) throw new APIError('Section not found', 404)
  return section
}

const updateSection = async (
  id: number,
  data: z.infer<typeof UpdateSectionSchema>,
) => {
  const sectionExists = await SectionRepo.findById(id)
  if (!sectionExists) throw new APIError('Section not found', 404)
  const updatedSection = await SectionRepo.update(id, data)
  return updatedSection
}

export const SectionService = {
  getSectionsByClassroomId,
  getSectionById,
  createSection,
  deleteSection,
  updateSection,
}
