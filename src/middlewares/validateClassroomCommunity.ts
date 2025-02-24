import { prisma } from '../db/PrismaClient';
import APIError from '../errors/APIError';
import { AuthenticatedRequest } from './authMiddleware';
import { NextFunction, Request, Response } from 'express';

export default async function validateClassroomCommunity(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { communityId, classroomId } = req.params;

    const classroom = await prisma.classroom.findUnique({
      where: { id: Number(classroomId) },
      select: { communityId: true },
    });

    if (!classroom) {
      throw new APIError('Classroom not found', 404);
    }

    if (classroom.communityId !== Number(communityId)) {
      throw new APIError('Classroom does not belong to this community', 403);
    }
    next();
  } catch (error) {
    next(error);
  }
}
