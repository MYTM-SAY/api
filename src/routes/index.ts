import express from 'express'
import classroom from './classroom.route'
import sections from './section.route'
import lesson from './lesson.route'
import community from './community.route'
import post from './post.route'
import leaderBoard from './leaderBoard.route'
import comment from './comment.route'
import profile from './profile.route'
import auth from './auth.route'
import user from './user.route'
import uploadRoutes from './upload.route'
import fileRoutes from './files.route'
import favorites from './favoriteCommunities.route'
import search from './search.route'
import question from './question.route'
import quiz from './quiz.route'
import reminder from './reminder.route'
const router = express.Router()

router.use('/posts', post)
router.use('/communities', community)
router.use('/classrooms', classroom)
router.use('/sections', sections)
router.use('/lessons', lesson)
router.use('/leaderboard', leaderBoard)
router.use('/comments', comment)
router.use('/profiles', profile)
router.use('/auth', auth)
router.use('/users', user)
router.use('/upload', uploadRoutes)
router.use('/files', fileRoutes)
router.use('/favorites', favorites)
router.use('/search', search)
router.use('/questions', question)
router.use('/quizzes', quiz)
router.use('/reminders', reminder)
export default router
