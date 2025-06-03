import { ClassroomRepo } from '../repos/classroom.repo'
import { ClassroomSchema, QuerySchema } from '../utils'
import APIError from '../errors/APIError'
import { CommunityRepo } from '../repos/community.repo'
import { boolean } from 'zod'
import { CommunityMembersRepo } from '../repos/communityMember.repo'
import { Role } from '@prisma/client'

const getClassroomsByCommunityId = async (communityId: number) => {
  return ClassroomRepo.findByCommunityId(communityId)
}

const getClassroomById = async (id: number, includes: QuerySchema) => {
  const classroom = await ClassroomRepo.findbyId(id, includes)
  if (!classroom) throw new APIError('Classroom not found', 404)

  for (const section of classroom?.Sections || []) {
    const lessons = (section as any).Lessons as Array<any>
    for (const lesson of lessons || []) {
      lesson.isCompleted = Math.random() < 0.5
      lesson.duration = Math.floor(Math.random() * 41) + 10
    }
  }
  return classroom
}

export const createClassroom = async (data: any, userId: number) => {
  const validatedData = await ClassroomSchema.parseAsync(data)
  const community = await CommunityRepo.findById(validatedData.communityId)
  if (!community) throw new APIError('Community not found', 404)

  const isOwnerOrMod = await isHasRole(userId, validatedData.communityId, [
    Role.MODERATOR,
    Role.OWNER,
  ])
  if (!isOwnerOrMod) throw new APIError('You must be an owner or mod', 403)

  return ClassroomRepo.create(validatedData)
}

const deleteClassroom = async (id: number, userId: number) => {
  const existingClassroom = await ClassroomRepo.findbyId(id)
  if (!existingClassroom) throw new APIError('Classroom not found', 404)

  const isOwnerOrMod = await isHasRole(userId, existingClassroom.communityId, [
    Role.MODERATOR,
    Role.OWNER,
  ])

  if (!isOwnerOrMod) throw new APIError('You must be an owner or mod', 403)
  const classroom = await ClassroomRepo.delete(id)

  if (!classroom) throw new APIError('Classroom not found', 404)
  return classroom
}

const updateClassroom = async (id: number, userId: number, data: any) => {
  const validatedData = ClassroomSchema.partial().parse(data)
  const existingClassroom = await ClassroomRepo.findbyId(id)

  if (!existingClassroom) throw new APIError('Classroom not found', 404)
  const isOwnerOrMod = await isHasRole(userId, existingClassroom.communityId, [
    Role.MODERATOR,
    Role.OWNER,
  ])

  if (!isOwnerOrMod) throw new APIError('You must be an owner or mod', 403)
  const updatedClassroom = await ClassroomRepo.update(id, validatedData)

  return updatedClassroom
}

const isHasRole = async (
  userId: number,
  communityId: number,
  roles: Role[],
) => {
  const userRole = await CommunityMembersRepo.getUserRoleInCommunity(
    userId,
    communityId,
  )

  if (userRole && !roles.includes(userRole)) return false
  return true
}

const clasroomProgress = async (classroomId: number) => {
  const classroom = await ClassroomRepo.findbyId(classroomId);
  if (!classroom) throw new APIError('Classroom not found', 404);
  const progress = await ClassroomRepo.clasroomProgress(classroomId);
  return progress;
}

export const ClassroomService = {
  getClassroomsByCommunityId,
  getClassroomById,
  createClassroom,
  deleteClassroom,
  updateClassroom,
  clasroomProgress,
}
