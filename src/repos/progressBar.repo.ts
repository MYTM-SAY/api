import { prisma } from '../db/PrismaClient';
import APIError from '../errors/APIError';

export const progressBarRepo = {
  async changeLessonStatus(lessonId: number, userId: number) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson) throw new APIError('No lesson found', 404);
	const completedLesson = await prisma.completedLessons.findUnique({
		where: {
		  userId_lessonId: {
			userId: userId,
			lessonId: lessonId,
		  },
		},
		include: {
		  Lesson: true, 
		},
	  });
	  
	if(!completedLesson){
		await prisma.completedLessons.create({
			data: {
				userId:userId,
				lessonId:lessonId,
			}
		})
	}
	else{
		await prisma.completedLessons.delete({
			where: {
				userId_lessonId: {
				  userId: userId,
				  lessonId: lessonId,
				},
			  }
		})
	}
	return completedLesson;
  },


  async updateClassroomProgress(classroomId: number, userId: number) {
    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
    });
    if (!classroom) throw new APIError('No classroom found', 404);

    const totalLessons = await prisma.lesson.count({
      where: {
        Section: {
          classroomId,
        },
      },
    });

    const completedLessons = await prisma.completedLessons.count({
		where: {
		  userId,
		},
	  });

	  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const updatedProgress = await prisma.progress.upsert({
		where: {
			userId_classroomId: {
			  userId,
			  classroomId,
			},
		  },
      update: {
        progress,
      },
      create: {
        userId,
        classroomId,
        progress,
      },
    });

    return updatedProgress;
  },
};