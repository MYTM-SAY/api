import { z } from 'zod'
import { prisma } from '../db/PrismaClient'
import {
  CreateSectionSchema,
  UpdateSectionSchema,
} from '../utils/zod/sectionSchemes'

export const SectionRepo = {
  async findByClassroomId(id: number) {
    const sections = await prisma.section.findMany({
      where: {
        classroomId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return sections
  },

  async findById(id: number) {
    const section = await prisma.section.findUnique({
      where: { id },
      include: {
        Classroom: true,
        Lessons: true,
      },
    })
    return section
  },

  async create(data: z.infer<typeof CreateSectionSchema>) {
    const section = await prisma.section.create({
      data,
      include: { Classroom: true },
    })
    return section
  },

  async delete(id: number) {
    const section = await prisma.section.delete({
      where: {
        id,
      },
    })
    return section
  },

  async update(id: number, data: z.infer<typeof UpdateSectionSchema>) {
    const updatedSection = await prisma.section.update({
      where: { id },
      data,
    })
    return updatedSection
  },
}
