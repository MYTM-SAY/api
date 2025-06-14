import { SectionRepo } from '../repos/section.repo'
import APIError from '../errors/APIError'
import z from 'zod'
import {
  CreateSectionSchema,
  UpdateSectionSchema,
} from '../utils/zod/sectionSchemes'
import { ClassroomRepo } from '../repos/classroom.repo'
import { Role } from '@prisma/client'
import { CommunityMembersRepo } from '../repos/communityMember.repo'

const getSectionsByClassroomId = async (
  classroomId: number,
  userId: number,
) => {
  const classroomExist = await ClassroomRepo.findbyId(classroomId)
  if (!classroomExist) throw new APIError('Classruoom not found')

  const isJoined = await isHasRole(userId, classroomExist.communityId, [
    Role.MODERATOR,
    Role.OWNER,
    Role.MEMBER,
  ])

  if (!isJoined) throw new APIError('You must be joined', 403)
  return SectionRepo.findByClassroomId(classroomId)
}

const getSectionById = async (id: number, userId: number) => {
  const section = await SectionRepo.findById(id)
  if (!section) throw new APIError('Section not found', 404)
  const isJoined = await isHasRole(userId, section.Classroom.communityId, [
    Role.MODERATOR,
    Role.OWNER,
    Role.MEMBER,
  ])

  if (!isJoined) throw new APIError('You must be joined', 403)
  return section
}

const createSection = async (
  data: z.infer<typeof CreateSectionSchema>,
  userId: number,
) => {
  const classroomExist = await ClassroomRepo.findbyId(data.classroomId)
  if (!classroomExist) throw new APIError('Classroom not found')
  const isOwnerOrMod = await isHasRole(userId, classroomExist.communityId, [
    Role.MODERATOR,
    Role.OWNER,
  ])

  if (!isOwnerOrMod) throw new APIError('You must be owner or mod', 403)
  return SectionRepo.create(data)
}

const deleteSection = async (id: number, userId: number) => {
  const sectionExists = await SectionRepo.findById(id)
  if (!sectionExists) throw new APIError('Section not found', 404)
  const isOwnerOrMod = await isHasRole(
    userId,
    sectionExists.Classroom.communityId,
    [Role.MODERATOR, Role.OWNER],
  )

  if (sectionExists.Lessons?.length !== 0) {
    throw new APIError('You must delete the lessons before delete section', 409)
  }
  if (!isOwnerOrMod) throw new APIError('You must be owner or mod', 403)

  const section = await SectionRepo.delete(id)
  if (!section) throw new APIError('Section not found', 404)
  return section
}

const updateSection = async (
  id: number,
  userId: number,
  data: z.infer<typeof UpdateSectionSchema>,
) => {
  const sectionExists = await SectionRepo.findById(id)
  if (!sectionExists) throw new APIError('Section not found', 404)
  const isOwnerOrMod = await isHasRole(
    userId,
    sectionExists.Classroom.communityId,
    [Role.MODERATOR, Role.OWNER],
  )

  if (!isOwnerOrMod) throw new APIError('You must be owner or mod', 403)
  const updatedSection = await SectionRepo.update(id, data)
  return updatedSection
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

export const SectionService = {
  getSectionsByClassroomId,
  getSectionById,
  createSection,
  deleteSection,
  updateSection,
}
