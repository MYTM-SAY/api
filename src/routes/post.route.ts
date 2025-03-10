import express from 'express'
import {
  getPosts,
  createPost,
  deletePost,
  getPost,
  updatePost,
} from '../controllers/postController'
import { isAuthenticated } from '../middlewares/authMiddleware'

const router = express.Router()

router.get('/', isAuthenticated, getPosts)
router.post('/', isAuthenticated, createPost)
router.get('/:id', isAuthenticated, getPost)
router.put('/:id', isAuthenticated, updatePost)
router.delete('/:id', isAuthenticated, deletePost)

export default router
