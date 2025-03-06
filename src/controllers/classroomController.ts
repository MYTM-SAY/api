import { NextFunction, Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import APIError from '../errors/APIError'
import { ClassroomRepo } from '../repos/classroom.repo'
import { ClassroomSchema } from '../utils'
import { ZodError } from 'zod'

export const getClassrooms = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const classrooms = await ClassroomRepo.findAll()
		return res.status(200).json(classrooms)
	} catch (error) {
		next(error)
	}
}

export const getClassroom = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const classroom = await ClassroomRepo.findbyId(+req.params.id)
		if (!classroom) throw new APIError('Classroom not found', 404)
		return res.status(200).json(classroom)
	} catch (error) {
		next(error)
	}
}

export const createClassroom = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	try {
		const validatedData = ClassroomSchema.parse(req.body)
		await ClassroomRepo.create(validatedData)
		return res.status(201).json('Classroom created successfully')
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

export const deleteClassroom = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	try {
		const classroom = await ClassroomRepo.delete(+req.params.id)
		if (!classroom) throw new APIError('Classroom not found', 404)
		return res.status(204).json('Classroom deleted successfully')
	} catch (error) {
		return res.status(400).json({ message: 'Invalid data', error })
	}
}

export const updateClassroom = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	try {
		const validateData = ClassroomSchema.partial().parse(req.body)

		const classroom = await ClassroomRepo.update(+req.params.id, validateData)
		if (!classroom) {
			return res.status(404).json({ message: 'Classroom not found' })
		}

		return res
			.status(200)
			.json({ message: 'Classroom updated successfully', classroom })
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
		return res.status(400).json({ message: 'Invalid data', error: error })
	}
}
