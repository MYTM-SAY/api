import { prisma } from '../db/PrismaClient';

export const UserRepo = {
  async findUserByClerkId(id: string) {
    const result = await prisma.user.findUnique({
      where: {
        clerkId: id,
      },
    });
    return result;
  },

  async createUser({
    clerkId,
    email,
    username,
  }: {
    clerkId: string;
    email: string;
    username: string;
  }) {
    const result = await prisma.user.create({
      data: {
        clerkId,
        email,
        username,
      },
    });
    return result;
  },
};
