import { NextFunction, Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import APIError from '../errors/APIError'
import { LessonRepo } from '../repos/lesson.repo'
import { LessonSchema } from '../utils'
import { ZodError } from 'zod'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export const getLessons = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const lessons = await LessonRepo.findAll()
    return res.status(200).json(lessons)
  } catch (error) {
    next(error)
  }
}

export const getLesson = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const lesson = await LessonRepo.findById(+req.params.id)
    if (!lesson) throw new APIError('Lesson not found', 404)
    return res.status(200).json(lesson)
  } catch (error) {
    next(error)
  }
}

export const createLesson = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const validatedData = LessonSchema.parse(req.body)

    const lesson = await LessonRepo.create(validatedData)
    return res
      .status(201)
      .json({ message: 'Lesson created successfully', lesson })
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      return res
        .status(400)
        .json({ message: 'Validation failed', errors: errorMessages })
    }
    if (error instanceof Error) {
      return res
        .status(400)
        .json({ message: 'Invalid data', error: error.message })
    }
    return res.status(400).json({ message: 'Invalid data', error })
  }
}

export const deleteLesson = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    await LessonRepo.delete(+req.params.id)
    return res.status(204).send()
  } catch (error) {
    if (
      //TODO: make Error Controller which have all errors like this
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new APIError('Lesson not found', 404)
    }
    return res.status(400).json({ message: 'Invalid data', error })
  }
}

export const updateLesson = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const validatedData = LessonSchema.partial().parse(req.body)
    const lesson = await LessonRepo.update(+req.params.id, validatedData)
    if (!lesson) throw new APIError('Lesson not found', 404)

    return res
      .status(200)
      .json({ message: 'Lesson updated successfully', lesson })
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      return res
        .status(400)
        .json({ message: 'Validation failed', errors: errorMessages })
    }
    if (error instanceof Error) {
      return res
        .status(400)
        .json({ message: 'Invalid data', error: error.message })
    }
    return res.status(400).json({ message: 'Invalid data', error })
  }
}
