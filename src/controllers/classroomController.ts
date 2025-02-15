import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import APIError from '../errors/APIError';
import { ClassroomRepo } from '../repos/classroom.repo';
import { ClassroomSchema } from '../utils';

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

export const getClassroom = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const classroom = await ClassroomRepo.findbyId(Number(req.params.id));
    if (!classroom) throw new APIError('Classroom not found', 404);
    return res.status(200).json(classroom);
  } catch (error) {
    next(error);
  }
};

export const createClassroom = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const validatedData = ClassroomSchema.parse(req.body);

    await ClassroomRepo.create(validatedData);
    return res.status(201).json('Classroom created successfuly');
  } catch (error) {
    return res.status(400).json({ message: 'Invalid data', error });
  }
};
