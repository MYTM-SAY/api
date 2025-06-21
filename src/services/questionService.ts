import { QuizStatus, Role } from '@prisma/client'
import APIError from '../errors/APIError'
import { CommunityMembersRepo } from '../repos/communityMember.repo'
import { QuestionRepo } from '../repos/question.repo.'
import { QuestionInput, questionSchema } from '../utils/zod/questionSchemes'
import { ClassroomRepo } from '../repos/classroom.repo'
import fs from 'fs'
import { parserService } from './parserService'
import { QuizRepo } from '../repos/quiz.repo'
import { QuizAttemptRepo } from '../repos/quizAttempt.repo'
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

export async function parseQuestionFileFile(
  userId: number,
  classroomId: number,
  file: Express.Multer.File,
) {
  const existingClassroom = await ClassroomRepo.findbyId(classroomId)

  console.log(
    'parseQuestionFileFile',
    userId,
    classroomId,
    existingClassroom?.communityId,
  )
  if (!existingClassroom) throw new APIError('Classroom not found', 404)
  const role = await CommunityMembersRepo.getUserRoleInCommunity(
    userId,
    existingClassroom.communityId,
  )
  console.log(role)
  if (role != Role.OWNER)
    throw new APIError('You must be an Owner to edit it', 403)
  const content = await fs.readFileSync(file.path, 'utf-8')
  fs.unlinkSync(file.path)
  return parseTextToQuestionInputs(content, classroomId)
}

export async function parseTextToQuestionInputs(
  text: string,
  classroomId: number,
) {
  const blocks = parserService.splitTextIntoBlocks(text)
  const questions: QuestionInput[] = []

  for (const block of blocks) {
    const parts = parserService.extractPartsFromBlock(block)

    if (!parts) continue
    const { questionHeader, options, answer } = parts
    const type = parserService.getTypeOfQuestion(options, answer)

    const isValidQuestion = await parserService.validateQuestion({
      questionHeader,
      options,
      answer,
      classroomId,
      type,
    })

    if (isValidQuestion) questions.push(isValidQuestion)
  }

  QuestionRepo.bulkCreate(questions)
  return questions
}

export async function getQuestionsByQuizId(quizId: number, userId: number) {
  const quiz = await QuizRepo.getQuizById(quizId)

  if (!quiz) throw new APIError('Quiz not found', 404)
  const now = new Date()

  if (now < quiz.startDate) throw new APIError('Quiz has not started yet', 409)
  if (now > quiz.endDate) throw new APIError('Quiz has already ended', 409)

  const attempt = await QuizAttemptRepo.findAttempt(userId, quizId)

  if (!attempt || attempt.status !== QuizStatus.InProgress)
    throw new APIError('you must be attempt again', 409)

  const quizQuestions = await QuestionRepo.getQuestionsByQuizId(quizId)
  console.log('quizQuestions', quizQuestions)
  const questions = quizQuestions.map((q) => ({
    ...q.Question,
  }))

  return questions
}
export const QuestionService = {
  createQuestion,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
  parseQuestionFileFile,
  getQuestionsByQuizId,
}
