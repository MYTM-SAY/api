import { NextFunction, Request, Response } from 'express'
import { PostRepo } from '../repos/post.repo'
import APIError from '../errors/APIError'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'

export const getPosts = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const posts = await PostRepo.findAll()
		return res.status(200).json(posts)
	} catch (error) {
		next(error)
	}
}

export const createPost = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const post = await PostRepo.create(req.body)
		return res.status(201).json(post)
	} catch (error) {
		next(error)
	}
}

export const getPost = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const post = await PostRepo.findById(Number(req.params.id))
		if (!post) throw new APIError('Post not found', 404)
		return res.status(200).json(post)
	} catch (error) {
		next(error)
	}
}

export const updatePost = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const postExist = await PostRepo.findById(Number(req.params.id))
		if (!postExist) throw new APIError('Post not found', 404)
		const post = await PostRepo.update(+req.params.id, req.body)
		return res.status(200).json(post)
	} catch (error) {
		next(error)
	}
}

export const deletePost = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const postExist = await PostRepo.findById(Number(req.params.id))
		if (!postExist) throw new APIError('Post not found', 404)
		await PostRepo.delete(+req.params.id)
		return res.status(204).send()
	} catch (error) {
		next(error)
	}
}
