import { prisma } from '../db/PrismaClient'

export const leaderBoardRepo = {
  async getTopTenByScore(commId: number) {
    const result = await prisma.quizAttempted.findMany({
      where: {
        Quiz: {
          Classroom: {
            communityId: commId,
          },
        },
      },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            fullname: true,
            UserProfile: {
              select: {
                profilePictureURL: true,
              },
            }
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
      take: 10,
    })
    return result
  },
}
