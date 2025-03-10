import { NextFunction, Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { progressBarRepo } from '../repos/progressBar.repo'

export const modifiedLessons = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const lesson = await progressBarRepo.changeLessonStatus(+req.params.communityId, +req.params.classroomId, +req.params.lessonId, +req.params.userId)
		res.status(200).json({ message: 'Updated successfully', data: lesson })
	} catch (error) {
		next(error)
	}
}

export const updatedProgress = async ( 
	req: AuthenticatedRequest, 
	res: Response, 
	next: NextFunction, 
  ) => { 
	try { 
	  const updatedClassroomProgress = await progressBarRepo.updateClassroomProgress( 
		+req.params.communityId, 
		+req.params.classroomId,
		+req.params.userId
	  ) 
	  res.status(200).json({ progress: updatedClassroomProgress.progress }) 
	} catch (error) { 
	  next(error) 
	} 
  }
