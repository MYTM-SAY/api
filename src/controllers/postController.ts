import { Request, Response } from 'express'
import { PostService } from '../services/postService'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { ResponseHelper } from '../utils/responseHelper'
import { asyncHandler } from '../utils/asyncHandler'

export const getPostsByForumId = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const posts = await PostService.getPostsByForumId(+req.params.id)
    res
      .status(200)
      .json(ResponseHelper.success('Posts fetched successfully', posts))
  },
)

export const createPost = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const post = await PostService.createPost(req.body, req.claims!.id)
    res
      .status(201)
      .json(ResponseHelper.success('Post created successfully', post))
  },
)

export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await PostService.getPostById(+req.params.id)
  res
    .status(200)
    .json(ResponseHelper.success('Post fetched successfully', post))
})

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await PostService.updatePost(+req.params.id, req.body)
  res
    .status(200)
    .json(ResponseHelper.success('Post updated successfully', post))
})

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  await PostService.deletePost(+req.params.id)
  res.status(204).json(ResponseHelper.success('Post deleted successfully'))
})
