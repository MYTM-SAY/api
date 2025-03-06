import { Prisma } from '@prisma/client'
import { prisma } from '../db/PrismaClient'

export const PostRepo = {
	async findAll() {
		const results = await prisma.post.findMany({})
		return results
	},

	async findById(id: number) {
		const result = await prisma.post.findUnique({
			where: { id },
		})
		return result
	},

	async create(post: Prisma.PostCreateInput) {
		const result = await prisma.post.create({
			data: post,
		})
		return result
	},

	async update(id: number, post: Prisma.PostUpdateInput) {
		const result = await prisma.post.update({
			where: { id },
			data: post,
		})
		return result
	},

	async delete(id: number) {
		const result = await prisma.post.delete({
			where: { id },
		})
		return result
	},
}
