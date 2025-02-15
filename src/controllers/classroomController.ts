import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
// import APIError from '../errors/APIError';
import { ClassroomRepo } from '../repos/classroom.repo';

export const getClassrooms = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const classrooms = await ClassroomRepo.findAll();
    return res.status(200).json(classrooms);
  } catch (error) {
    next(error);
  }
};