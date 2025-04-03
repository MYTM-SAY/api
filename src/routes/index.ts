import express from 'express'
import classroom from './classroom.route'
import sections from './section.route'
import lesson from './lesson.route'
import community from './community.route'
import post from './post.route'
import progress from './progressBar.route'
import leaderBoard from './leaderBoard.route'
import comment from './comment.route'
import profile from './profile.route'
import auth from './auth.route'
import user from './user.route'
import uploadRoutes from './upload.route'
import fileRoutes from './files.route'

const router = express.Router()

router.use('/posts', post)
router.use('/communities', community)
router.use('/classrooms', classroom)
router.use('/sections', sections)
router.use('/lessons', lesson)
router.use('/progress', progress)
router.use('/leaderboard', leaderBoard)
router.use('/comments', comment)
router.use('/profile', profile)
router.use('/auth', auth)
router.use('/users', user)
router.use('/upload', uploadRoutes)
router.use('/files', fileRoutes)

export default router
