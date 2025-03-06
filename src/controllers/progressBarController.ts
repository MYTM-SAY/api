import { NextFunction, Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { progressBarRepo } from '../repos/progressBar.repo'

export const modifiedSection = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const section = await progressBarRepo.changeSectionStatus(+req.params.secId)
		res.status(200).json({ message: 'Updated successfully', data: section })
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
		const updatedClassroomProgress = await progressBarRepo.updatedProgress(
			+req.params.classId,
		)
		res.status(200).json({ progress: updatedClassroomProgress.progress })
	} catch (error) {
		next(error)
	}
}
