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

  async findbyId(id: number) {
    const classroom = await prisma.classroom.findUnique({
      where:{ id },
      include: {
        Community: true,
      },
    });
    return classroom;
  },
};