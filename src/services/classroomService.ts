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
  return classroom
}

export const createClassroom = async (data: any, userId: number) => {
  const validatedData = await ClassroomSchema.parseAsync(data)
  const community = await CommunityRepo.findById(validatedData.communityId)
  if (!community) throw new APIError('Community not found', 404)

    const isOwnerOrMod = await isHasRole(userId, validatedData.communityId,
      [Role.MODERATOR, Role.OWNER]);
    if (!isOwnerOrMod)
      throw new APIError("You must be an owner or mod")

  return ClassroomRepo.create(validatedData)
}

const deleteClassroom = async (id: number, userId: number) => {
  const existingClassroom = await ClassroomRepo.findbyId(id)
  if (!existingClassroom) throw new APIError('Classroom not found', 404)

  const isOwnerOrMod = await isHasRole(userId, existingClassroom.communityId, 
    [Role.MODERATOR, Role.OWNER]);

  if (!isOwnerOrMod)
    throw new APIError("You must be an owner or mod")    
  const classroom = await ClassroomRepo.delete(id)

  if (!classroom) throw new APIError('Classroom not found', 404)
  return classroom
}

const updateClassroom = async (id: number, userId:number, data: any) => {
  const validatedData = ClassroomSchema.partial().parse(data)
  const existingClassroom = await ClassroomRepo.findbyId(id)

  if (!existingClassroom) throw new APIError('Classroom not found', 404)
  const isOwnerOrMod = await isHasRole(userId, existingClassroom.communityId, 
    [Role.MODERATOR, Role.OWNER])

  if (!isOwnerOrMod)
    throw new APIError("You must be an owner or mod")
  const updatedClassroom = await ClassroomRepo.update(id, validatedData)

  return updatedClassroom
}

const isHasRole = async (userId: number, communityId: number, roles: Role[]) =>
  {
    const userRole = await CommunityMembersRepo.getUserRoleInCommunity(userId, communityId);
  
    if (!userRole || !roles.includes(userRole))
      return false
    return true
  }
  
export const ClassroomService = {
  getClassroomsByCommunityId,
  getClassroomById,
  createClassroom,
  deleteClassroom,
  updateClassroom,
}

