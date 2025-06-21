import { prisma } from '../db/PrismaClient'

export const leaderBoardRepo = {
  async getTopTenByScore(commId: number) {
    const allAttempts = await prisma.quizAttempted.findMany({
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
            },
          },
        },
      },
    })

    const userScores = new Map<
      number,
      {
        userId: number
        username: string
        fullname: string
        profilePictureURL: string | null
        totalScore: number
      }
    >()

    for (const attempt of allAttempts) {
      const user = attempt.User
      const existing = userScores.get(user.id)

      if (existing) {
        existing.totalScore += attempt.score
      } else {
        userScores.set(user.id, {
          userId: user.id,
          username: user.username,
          fullname: user.fullname,
          profilePictureURL: user.UserProfile?.profilePictureURL || null,
          totalScore: attempt.score,
        })
      }
    }

    return Array.from(userScores.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10)
  },
}
