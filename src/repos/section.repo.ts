import { Prisma } from '@prisma/client';
import { prisma } from '../db/PrismaClient';

export const SectionRepo = {
  async create(data: Prisma.SectionCreateInput) {
    return prisma.section.create({
      data,
    });
  },

  async findById(id: number) {
    const section = await prisma.section.findUnique({
      where: { id },
      include: {
        Lessons: true,
        Questions: true,
      },
    });

    return section || null;
  },

  async update(id: number, data: Prisma.SectionUpdateInput) {
    return prisma.section.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return prisma.section.delete({
      where: { id },
    });
  },

  async getByClassroom(classroomId: number) {
    return prisma.section.findMany({
      where: { classroomId },
      orderBy: { createdAt: 'asc' },
      include: {
        Lessons: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  },
};
