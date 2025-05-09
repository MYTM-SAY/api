import { LessonRepo } from '../repos/lesson.repo'
import APIError from '../errors/APIError'
import z from 'zod'
import { UpdateLessonSchema } from '../utils/zod/lessonSchemes'
import { SectionRepo } from '../repos/section.repo'
import { CreateLessonWithMaterialSchema } from '../utils/zod/lessonMaterialSchemes'
import { CommunityMembersRepo } from '../repos/communityMember.repo'
import { Role } from '@prisma/client'

const getLessonsBySectionId = async (sectionId: number, userId: number) => {
  const sectionExist = await SectionRepo.findById(sectionId)
  if (!sectionExist) throw new APIError('Section not found', 404)

  const isJoined = await isHasRole(userId, sectionExist.Classroom.communityId,
    [Role.MODERATOR, Role.OWNER]);

  if (!isJoined)
    throw new APIError("You must be owner or mod", 403)
  return LessonRepo.findBySectionId(sectionId)
}

const getLessonById = async (id: number, userId: number) => {
  const existingLesson = await LessonRepo.findById(id)
  if (!existingLesson) throw new APIError('Lesson not found', 404)

  const isJoined = await isHasRole(userId, existingLesson.Section.Classroom.communityId,
    [Role.MODERATOR, Role.OWNER]);

  if (!isJoined)
    throw new APIError("You must be owner or mod", 403)
  return existingLesson
}

const createLessonWithNewMaterial = async (
  userId: number,
  data: z.infer<typeof CreateLessonWithMaterialSchema>,
) => {
  const sectionExist = await SectionRepo.findById(data.lesson.sectionId)
  if (!sectionExist) throw new APIError('Section not found', 404)
  const isOwnerMod = await isHasRole(userId, sectionExist.Classroom.communityId,
    [Role.MODERATOR, Role.OWNER]);

  if (!isOwnerMod)
    throw new APIError("You must be owner or mod", 403)
  return LessonRepo.createWithMaterial(data)
}

const deleteLesson = async (id: number, userId: number) => {
  const lessonExists = await LessonRepo.findById(id)
  if (!lessonExists) throw new APIError('Lesson not found', 404)
  const isOwnerMod = await isHasRole(userId, lessonExists.Section.Classroom.communityId,
    [Role.MODERATOR, Role.OWNER]);

  if (!isOwnerMod)
    throw new APIError("You must be owner or mod", 403)
  const lesson = await LessonRepo.delete(id)
  return lesson
}

const updateLesson = async (
  id: number,
  userId: number,
  data: z.infer<typeof UpdateLessonSchema>,
) => {
  const lessonExists = await LessonRepo.findById(id)
  if (!lessonExists) throw new APIError('Lesson not found', 404)
  const isOwnerMod = await isHasRole(userId, lessonExists.Section.Classroom.communityId,
    [Role.MODERATOR, Role.OWNER]);

  if (!isOwnerMod)
    throw new APIError("You must be owner or mod", 403)
  const updatedLesson = await LessonRepo.update(id, data)
  return updatedLesson
}


const isHasRole = async (userId: number, communityId: number, roles: Role[]) => {
  const userRole = await CommunityMembersRepo.getUserRoleInCommunity(userId, communityId);

  if (userRole && !roles.includes(userRole))
    return false
  return true
}

export const LessonService = {
  getLessonsBySectionId,
  getLessonById,
  createLessonWithNewMaterial,
  deleteLesson,
  updateLesson,
}
