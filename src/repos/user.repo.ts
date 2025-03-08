import { prisma } from '../db/PrismaClient';

export const UserRepo = {
  // update last login with curent date
 
  async updateLastLogin(userId: number) {
    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        lastLogin: new Date(),
      },
    });
    return result;
  },
  async findUserByClerkId(id: string) {
    const result = await prisma.user.findUnique({
      where: {
        clerkId: id,
      },
    });
    return result;
  },

  async findById(id: number) {
    const result = await prisma.user.findUnique({
      where: { id },
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
