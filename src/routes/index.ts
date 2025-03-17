import express from 'express'
import classroom from './classroom.route'
import community from './community.route'
import post from './post.route'
import progress from './progressBar.route'
import leaderBoard from './leaderBoard.route'
import comment from './comment.route'
import profile from './profile.route'
import auth from './auth.route'
import user from './user.route'

const router = express.Router()

router.use('/posts', post)
router.use('/communities', community)
router.use('/classrooms', classroom)
router.use('/progress', progress)
router.use('/leaderboard', leaderBoard)
router.use('/comments', comment)
router.use('/profile', profile)
router.use('/auth', auth)
router.use('/users', user)

export default router
