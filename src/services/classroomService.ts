import { ClassroomRepo } from '../repos/classroom.repo'
import { ClassroomSchema, QuerySchema } from '../utils'
import APIError from '../errors/APIError'
import { CommunityRepo } from '../repos/community.repo'
import { boolean } from 'zod'

const getClassroomsByCommunityId = async (communityId: number) => {
  return ClassroomRepo.findByCommunityId(communityId)
}

const getClassroomById = async (id: number, includes: QuerySchema) => {
  const classroom = await ClassroomRepo.findbyId(id, includes)
  if (!classroom) throw new APIError('Classroom not found', 404)
  return classroom
}

export const createClassroom = async (data: any) => {
  const validatedData = await ClassroomSchema.parseAsync(data)
  const community = await CommunityRepo.findById(validatedData.communityId)
  if (!community) throw new APIError('Community not found', 404)

  return ClassroomRepo.create(validatedData)
}

const deleteClassroom = async (id: number) => {
  const classroomExists = await ClassroomRepo.findbyId(id)
  if (!classroomExists) throw new APIError('Classroom not found', 404)
  const classroom = await ClassroomRepo.delete(id)

  if (!classroom) throw new APIError('Classroom not found', 404)
  return classroom
}

const updateClassroom = async (id: number, data: any) => {
  const validatedData = ClassroomSchema.partial().parse(data)
  const classroomExists = await ClassroomRepo.findbyId(id)
  if (!classroomExists) throw new APIError('Classroom not found', 404)
  const updatedClassroom = await ClassroomRepo.update(id, validatedData)
  return updatedClassroom
}

export const ClassroomService = {
  getClassroomsByCommunityId,
  getClassroomById,
  createClassroom,
  deleteClassroom,
  updateClassroom,
}
