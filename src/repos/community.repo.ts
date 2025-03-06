import { Prisma } from '@prisma/client'
import { prisma } from '../db/PrismaClient'

export const CommunityRepo = {
	async findAll() {
		const results = await prisma.community.findMany({
			include: {
				Classrooms: true,
			},
		})
		return results
	},

	async create(community: Prisma.CommunityCreateInput) {
		const result = await prisma.community.create({
			data: community,
		})
		return result
	},

	async findById(id: number) {
		const result = await prisma.community.findUnique({
			where: { id },
		})
		return result
	},

	async update(id: number, post: Prisma.CommunityUpdateInput) {
		const result = await prisma.community.update({
			where: { id },
			data: post,
		})
		return result
	},

	async delete(id: number) {
		const result = await prisma.community.delete({
			where: { id },
		})
		return result
	},

	async getRecommendedCommunities(userTagIds: number[]) {
		// Query communities that share any of the user's tags
		const recommendedCommunities = await prisma.community.findMany({
			where: {
				Tags: {
					some: {
						id: { in: userTagIds },
					},
				},
			},
			include: { Tags: true, Owner: true },
		})
		return recommendedCommunities
	},

	// Get popular communities (fallback if user has no tags).
	async getPopularCommunities() {
		return prisma.community.findMany({
			orderBy: [{ Members: { _count: 'desc' } }, { createdAt: 'desc' }],
			include: {
				Tags: true,
				Owner: true,
			},
		})
	},

	// Search by Name and Tags (if tags sended if not search by name only)
	async searchCommunities(
		searchTerm: string = '',
		filterTagIds: number[] = [],
	) {
		return prisma.community.findMany({
			where: {
				OR: [
					{ name: { contains: searchTerm, mode: 'insensitive' } },
					{ description: { contains: searchTerm, mode: 'insensitive' } },
				],
				...(filterTagIds && filterTagIds.length > 0
					? { Tags: { some: { id: { in: filterTagIds } } } }
					: {}),
			},
			include: {
				Tags: true,
				Owner: true,
			},
		})
	},
}
