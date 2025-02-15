import { prisma } from '../db/PrismaClient';

export const ClassroomRepo = {
  async findAll() {
    const classrooms = await prisma.classroom.findMany({
      include: {
        Community: true,
      },
    });
    return classrooms;
  },
};