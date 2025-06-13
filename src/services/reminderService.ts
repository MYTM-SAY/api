import { ReminderRepo } from '../repos/reminder.repo';
import { UserRepo } from '../repos/user.repo'
import APIError from '../errors/APIError'

const findRemindersForJoinedCommunities = async (userId: number) => {

  const userExist = await UserRepo.findById(userId)
  if (!userExist) throw new APIError('User not found', 404)


   const reminders = await ReminderRepo.findRemindersForJoinedCommunities(userId)
   return reminders
}


export const ReminderService = {
   findRemindersForJoinedCommunities,
}
