import APIError from '../errors/APIError'
import { progressBarRepo } from '../repos/progressBar.repo'

async function changeLessonStatus(
  communityId: number,
  classroomId: number,
  lessonId: number,
  userId: number,
) {
  return await progressBarRepo.changeLessonStatus(
    communityId,
    classroomId,
    lessonId,
    userId,
  )
}

async function updateClassroomProgress(
  communityId: number,
  classroomId: number,
  userId: number,
) {
  return await progressBarRepo.updateClassroomProgress(
    communityId,
    classroomId,
    userId,
  )
}
export const ProgressBarService = {
  changeLessonStatus,
  updateClassroomProgress,
}
