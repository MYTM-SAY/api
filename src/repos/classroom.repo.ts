import { prisma } from '../db/PrismaClient';
import { ClassroomSchema } from '../utils';
import { z } from 'zod';

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

  async create(data: z.infer<typeof ClassroomSchema>) {
    const classroom = await prisma.classroom.create({
      data,
    });
    return classroom;
  },
};