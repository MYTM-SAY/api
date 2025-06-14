import { QuestionType } from '@prisma/client'
import { QuestionInput, questionSchema } from '../utils/zod/questionSchemes'

function getTypeOfQuestion(
  options: string[],
  answer: string | string[],
): QuestionType {
  const normalizedAnswer = Array.isArray(answer) ? answer : [answer]

  if (
    options.length === 2 &&
    options.some((o) => o.toLowerCase() === 'true') &&
    options.some((o) => o.toLowerCase() === 'false')
  )
    return QuestionType.TRUE_FALSE

  if (normalizedAnswer.length > 1) return QuestionType.MULTI
  return QuestionType.SINGLE
}

function extractPartsFromBlock(block: string): {
  questionHeader: string
  options: string[]
  answer: string | string[]
} | null {
  const questionMatch = block.match(/Question:\s*\n?([\s\S]*?)\nOptions:/)
  const optionsMatch = block.match(/Options:\s*([\s\S]*?)\nAnswer:/)
  const answerMatch = block.match(/Answer:\s*([\s\S]*)/)

  if (!questionMatch || !optionsMatch || !answerMatch) return null

  const questionHeader = questionMatch[1].trim()
  const options = optionsMatch[1]
    .split('\n')
    .map((line) => line.replace(/^- /, '').trim())
    .filter(Boolean)

  const rawAnswer = answerMatch[1].trim()
  const answer = rawAnswer
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return { questionHeader, options, answer }
}

function splitTextIntoBlocks(text: string): string[] {
  return text
    .split(/\r?\n\r?\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
}

async function validateQuestion(input: {
  questionHeader: string
  options: string[]
  answer: string | string[]
  classroomId: number
  type: 'SINGLE' | 'MULTI' | 'TRUE_FALSE'
}): Promise<QuestionInput | null> {
  const parsed = await questionSchema.safeParseAsync(input)

  if (parsed.success) {
    return parsed.data
  } else {
    console.warn('❌ Invalid question skipped:', parsed.error.flatten())
    return null
  }
}

export const parserService = {
  validateQuestion,
  splitTextIntoBlocks,
  extractPartsFromBlock,
  getTypeOfQuestion,
}
