import { z } from 'zod'
import { prisma } from '../db/PrismaClient'
import {
  CreateMaterialSchema,
  UpdateMaterialSchema,
} from '../utils/zod/materialSchemes' // Assuming this exists or will be created

export const MaterialRepo = {
  async findAll() {
    const materials = await prisma.material.findMany({
      include: {
        Lesson: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return materials
  },

  async findById(id: number) {
    const material = await prisma.material.findUnique({
      where: { id },
      include: {
        Lesson: true,
      },
    })
    return material
  },

  async create(data: z.infer<typeof CreateMaterialSchema>) {
    const material = await prisma.material.create({
      data,
    })
    return material
  },

  async delete(id: number) {
    const material = await prisma.material.delete({
      where: { id },
    })
    return material
  },

  async update(id: number, data: z.infer<typeof UpdateMaterialSchema>) {
    const updatedMaterial = await prisma.material.update({
      where: { id },
      data,
    })
    return updatedMaterial
  },
}
