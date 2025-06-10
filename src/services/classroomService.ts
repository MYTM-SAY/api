import { ClassroomRepo } from '../repos/classroom.repo'
import { ClassroomSchema, QuerySchema } from '../utils'
import APIError from '../errors/APIError'
import { CommunityRepo } from '../repos/community.repo'
import { boolean } from 'zod'
import { CommunityMembersRepo } from '../repos/communityMember.repo'
import { Role } from '@prisma/client'

const getClassroomsByCommunityId = async (
  communityId: number,
  userId: number,
) => {
  const classrooms = await ClassroomRepo.findByCommunityId(communityId)

  const classroomsWithProgress = await Promise.all(
    classrooms.map(async (classroom) => {
      let progress = 0
      try {
        progress = await classroomProgress(classroom.id, userId)
      } catch (error) {
        progress = 0
      }

      return {
        ...classroom,
        progress,
      }
    }),
  )

  return classroomsWithProgress
}

const getClassroomById = async (
  classroomId: number,
  userId: number,
  includes: QuerySchema,
) => {
  const classroom = await ClassroomRepo.findbyId(classroomId, userId, includes)
  if (!classroom) {
    throw new APIError('Classroom not found', 404)
  }

  for (const section of classroom.Sections || []) {
    const lessons = (section as any).Lessons as Array<any>
    for (const lesson of lessons || []) {
      lesson.duration = Math.floor(Math.random() * 41) + 10
      const completedLessons = (lesson.CompletedLessons as Array<any>) || []
      lesson.isCompleted = completedLessons.some((cl) => cl.userId === userId)
      delete lesson.CompletedLessons
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

const classroomProgress = async (classroomId: number, userId: number) => {
  const classroom = await ClassroomRepo.findbyId(classroomId)
  if (!classroom) throw new APIError('Classroom not found', 404)
  const lessons = await ClassroomRepo.countLessons(classroomId)
  if (lessons === 0)
    throw new APIError('No lessons found in this classroom', 404)
  const completedLessons = await ClassroomRepo.countCompletedLessons(userId)
  if (completedLessons === 0)
    throw new APIError('No completed lessons found for this user', 404)
  if (lessons === 0 || completedLessons === 0) return 0
  return (completedLessons / lessons) * 100
}

export const ClassroomService = {
  getClassroomsByCommunityId,
  getClassroomById,
  createClassroom,
  deleteClassroom,
  updateClassroom,
  classroomProgress,
}
