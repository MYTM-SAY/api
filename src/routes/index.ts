import express from 'express'
import classroom from './classroom.route'
import community from './community.route'
import post from './post.route'
import progress from './progressBar.route'
import leaderBoard from './leaderBoard.route'
import comment from './comment.route'

const router = express.Router()

router.use('/post', post)
router.use('/community', community)
router.use('/classroom', classroom)
router.use('/progress', progress)
router.use('/leader-board', leaderBoard)
router.use('/comment', comment)

export default router
