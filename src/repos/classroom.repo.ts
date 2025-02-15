import { z } from 'zod';
import { prisma } from '../db/PrismaClient';
import APIError from '../errors/APIError';
import { ClassroomSchema } from '../utils';

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

  async delete(id : number) {
    const classroom = await prisma.classroom.delete({
      where:{
        id,
      },
    });
    return classroom;
  },

  async update(id: number, data: Partial<z.infer<typeof ClassroomSchema>>) {
    const classroom = await prisma.classroom.findUnique({
      where: { id },
    });
  
    if (!classroom) {
      throw new APIError('Classroom not found', 404);
    }
  
    const updatedClassroom = await prisma.classroom.update({
      where: { id },
      data,
    });
  
    return updatedClassroom;
  },
};


