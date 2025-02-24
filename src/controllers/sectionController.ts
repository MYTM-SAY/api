import { NextFunction, Request, Response } from 'express';
import { SectionRepo } from '../repos/section.repo';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import APIError from '../errors/APIError';

export const SectionController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const classroomId = Number(req.params.classroomId);
      if (!classroomId) {
        throw new APIError('Classroom ID is required', 400);
      }

      const sectionData = { ...req.body, classroomId };
      const section = await SectionRepo.create(sectionData);

      res.status(201).json({ success: true, data: section });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sectionId = Number(req.params.sectionId);
      if (!sectionId) {
        throw new APIError('Section ID is required', 400);
      }

      const section = await SectionRepo.findById(sectionId);
      if (!section) {
        throw new APIError('Section not found', 404);
      }
      res.json({ success: true, data: section });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const section = await SectionRepo.update(Number(req.params.sectionId), req.body);
      res.json({ success: true, data: section });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sectionId = Number(req.params.sectionId);
      const section = await SectionRepo.findById(sectionId);

      if (!section) {
        throw new APIError('Section not found', 404);
      }

      await SectionRepo.delete(sectionId);
      res.status(204).json({ success: true, message: 'Section deleted' });
    } catch (error) {
      next(error);
    }
  },
  async getByClassroom(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sections = await SectionRepo.getByClassroom(
        Number(req.params.classroomId),
      );
      res.json({ success: true, data: sections });
    } catch (error) {
      next(error);
    }
  },
};
