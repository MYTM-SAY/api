import { prisma } from '../db/PrismaClient';
import APIError from '../errors/APIError';

export const progressBarRepo = {
  async changeSectionStatus(id: number) {
    const section = await prisma.section.findUnique({
      where: { id },
    });
    if (!section) throw new APIError('No sections found', 404);

    const modifiedSection = await prisma.section.update({
      where: { id },
      data: { isCompleted: !section.isCompleted },
    });
    return modifiedSection;
  },
};
