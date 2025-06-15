import { LessonRepo } from '../repos/lesson.repo'
import APIError from '../errors/APIError'
import z, { boolean } from 'zod'
import { UpdateLessonSchema } from '../utils/zod/lessonSchemes'
import { SectionRepo } from '../repos/section.repo'
import { CreateLessonWithMaterialSchema } from '../utils/zod/lessonMaterialSchemes'
import { CommunityMembersRepo } from '../repos/communityMember.repo'
import { MaterialType, Role } from '@prisma/client'

const getLessonsBySectionId = async (sectionId: number, userId: number) => {
  const sectionExist = await SectionRepo.findById(sectionId)
  if (!sectionExist) throw new APIError('Section not found', 404)

  const isJoined = await isHasRole(userId, sectionExist.Classroom.communityId, [
    Role.MODERATOR,
    Role.OWNER,
    Role.MEMBER,
  ])

  if (!isJoined) throw new APIError('You must be owner or mod', 403)
  return LessonRepo.findBySectionId(sectionId, userId)
}

const getLessonById = async (id: number, userId: number) => {
  const existingLesson = await LessonRepo.findById(id)
  if (!existingLesson) throw new APIError('Lesson not found', 404)

  const isJoined = await isHasRole(
    userId,
    existingLesson.Section.Classroom.communityId,
    [Role.MODERATOR, Role.OWNER],
  )

  if (!isJoined) throw new APIError('You must be owner or mod', 403)
  return existingLesson
}

const createLessonWithNewMaterial = async (
  userId: number,
  data: z.infer<typeof CreateLessonWithMaterialSchema>,
) => {
  const sectionExist = await SectionRepo.findById(data.lesson.sectionId)
  if (!sectionExist) throw new APIError('Section not found', 404)
  const isOwnerMod = await isHasRole(
    userId,
    sectionExist.Classroom.communityId,
    [Role.MODERATOR, Role.OWNER],
  )
  if (!isOwnerMod) throw new APIError('You must be owner or mod', 403)

  const newData = {
    ...data,
    materials: data.materials.map((mat) => {
      if (
        (mat.materialType === MaterialType.VIDEO ||
          mat.materialType === MaterialType.AUDIO) &&
        mat.fileUrl
      ) {
        const durationStr = mat.fileUrl.split('-').at(1)
        return {
          ...mat,
          duration: durationStr ? Number(durationStr) : null,
        }
      }
      return mat
    }),
  }
  return LessonRepo.createWithMaterial(newData)
}

const deleteLesson = async (id: number, userId: number) => {
  const lessonExists = await LessonRepo.findById(id)
  if (!lessonExists) throw new APIError('Lesson not found', 404)
  const isOwnerMod = await isHasRole(
    userId,
    lessonExists.Section.Classroom.communityId,
    [Role.MODERATOR, Role.OWNER],
  )

  if (!isOwnerMod) throw new APIError('You must be owner or mod', 403)
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
  const isOwnerMod = await isHasRole(
    userId,
    lessonExists.Section.Classroom.communityId,
    [Role.MODERATOR, Role.OWNER],
  )
  if (!isOwnerMod) throw new APIError('You must be owner or mod', 403)
  const updatedLesson = await LessonRepo.update(id, data)
  return updatedLesson
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

const toggleCompleted = async (lessonId: number, userId: number) => {
  const lesson = await LessonRepo.findById(lessonId)
  if (!lesson) throw new APIError('Lesson not found', 404)
  const isAlreadyCompleted = await LessonRepo.findCompletedLessonForUser(
    lessonId,
    userId,
  )
  if (isAlreadyCompleted) {
    await LessonRepo.toggleUnCompleted(lessonId, userId)
    return false
  } else {
    LessonRepo.toggleCompleted(lessonId, userId)
    return true
  }
}

export const LessonService = {
  getLessonsBySectionId,
  getLessonById,
  createLessonWithNewMaterial,
  deleteLesson,
  updateLesson,
  toggleCompleted,
}
