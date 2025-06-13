import { Response } from 'express'
import { ReminderService } from '../services/reminderService'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { asyncHandler } from '../utils/asyncHandler'
import { ResponseHelper } from '../utils/responseHelper'



export const getRemindersForJoinedCommunities = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const reminders = await ReminderService.findRemindersForJoinedCommunities(req.claims!.id);
    res
      .status(200)
      .json(ResponseHelper.success('Reminders fetched successfully', reminders))
  },
)

