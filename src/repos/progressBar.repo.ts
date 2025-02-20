import { prisma } from '../db/PrismaClient';
import APIError from '../errors/APIError';

export const progressBarRepo = {
  async changeSectionStatus(secId: number) {
    const section = await prisma.section.findUnique({
      where: { id: secId },
    });
    if (!section) throw new APIError('No section found', 404);

    const modifiedSection = await prisma.section.update({
      where: { id: secId },
      data: { isCompleted: !section.isCompleted },
    });
    return modifiedSection;
  },

  async updatedProgress(classId: number) {
    const classroom = await prisma.classroom.findUnique({
      where: { id: classId },
    });
    if (!classroom) throw new APIError('No classroom found', 404);

    const completedSections = await prisma.section.count({
      where: {
        classroomId: classId,
        isCompleted: true,
      },
    });

    const totalSections = await prisma.section.count({
      where: { classroomId: classId },
    });
    const progress = (completedSections / totalSections) * 100;
    const updatedClassroomProgress = await prisma.classroom.update({
      where: { id: classId },
      data: { progress },
    });
    return updatedClassroomProgress;
  },
};
