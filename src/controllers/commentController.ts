import { NextFunction, Request, Response } from 'express'
import { CommentRepo } from '../repos/comment.repo'
import APIError from '../errors/APIError'
import { CommentSchema } from '../utils'
import { ZodError } from 'zod'

export const findAllComments = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const comments = await CommentRepo.findAll(+req.params.postId)
		if (!comments) throw new APIError('Comments not found', 404)
		return res.status(200).json(comments)
	} catch (error) {
		next(error)
	}
}

export const findComment = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const comments = await CommentRepo.findComment(
			+req.params.postId,
			+req.params.commentId,
		)
		if (!comments) throw new APIError('Comment not found', 404)
		return res.status(200).json(comments)
	} catch (error) {
		next(error)
	}
}

export const createComment = async (req: Request, res: Response) => {
	try {
		const validatedData = CommentSchema.parse(req.body)
		const comment = await CommentRepo.createComment(validatedData)
		return res.status(200).json(comment)
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

export const updateComment = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const validatedData = CommentSchema.partial().parse(req.body)
		const comment = await CommentRepo.updateComment(
			+req.params.commentId,
			validatedData,
		)
		return res.status(200).json(comment)
	} catch (error) {
		next(error)
	}
}

export const deleteComment = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		await CommentRepo.deleteComment(+req.params.commentId)
		return res.status(200).json('Comment deleted successfully!')
	} catch (error) {
		next(error)
	}
}
