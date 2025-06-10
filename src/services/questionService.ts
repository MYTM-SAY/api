import { Role } from '@prisma/client'
import APIError from '../errors/APIError'
import { CommunityMembersRepo } from '../repos/communityMember.repo'
import { QuestionRepo } from '../repos/question.repo.'
import { QuestionInput, questionSchema } from '../utils/zod/questionSchemes'
import { ClassroomRepo } from '../repos/classroom.repo'

async function createQuestion(data: QuestionInput, userId: number) {
  const validatedData = await questionSchema.parseAsync(data)
  const existingClassroom = await ClassroomRepo.findbyId(
    validatedData.classroomId,
  )
  if (!existingClassroom) throw new APIError('Classroom not found', 404)
  const role = await CommunityMembersRepo.getUserRoleInCommunity(
    userId,
    existingClassroom.communityId,
  )
  if (role != Role.OWNER) throw new APIError('You must be an Owner to edit it')

  return await QuestionRepo.Create({
    ...data,
  })
}
async function getAllQuestions(classroomId: number, userId: number) {
  const existingClassroom = await ClassroomRepo.findbyId(classroomId)
  if (!existingClassroom) throw new APIError('Classroom not found', 404)

  // Verify user has access to this classroom
  const role = await CommunityMembersRepo.getUserRoleInCommunity(
    userId,
    existingClassroom.communityId,
  )
  if (role != Role.OWNER)
    throw new APIError('You must be an Owner to edit it', 403)

  return await QuestionRepo.findAllByClassroom(classroomId)
}

async function updateQuestion(
  questionId: number,
  data: Partial<QuestionInput>,
  userId: number,
) {
  const validatedData = await questionSchema.parseAsync(data)
  const question = await QuestionRepo.findById(questionId)
  if (!question) throw new APIError('Question not found', 404)

  const classroom = await ClassroomRepo.findbyId(question.classroomId)
  if (!classroom) throw new APIError('Classroom not found', 404)

  const role = await CommunityMembersRepo.getUserRoleInCommunity(
    userId,
    classroom.communityId,
  )

  if (role !== Role.OWNER)
    throw new APIError('You must be an Owner to edit questions', 403)

  return await QuestionRepo.update(questionId, validatedData)
}

async function deleteQuestion(questionId: number, userId: number) {
  const question = await QuestionRepo.findById(questionId)
  if (!question) throw new APIError('Question not found', 404)

  const classroom = await ClassroomRepo.findbyId(question.classroomId)
  if (!classroom) throw new APIError('Classroom not found', 404)

  const role = await CommunityMembersRepo.getUserRoleInCommunity(
    userId,
    classroom.communityId,
  )

  if (role !== Role.OWNER)
    throw new APIError('You must be an Owner to delete questions', 403)

  await QuestionRepo.delete(questionId)
  return { message: 'Question deleted successfully' }
}
export const QuestionService = {
  createQuestion,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
}
