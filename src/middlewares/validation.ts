import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      return res.status(500).json({ message: 'Authentication error', error })
    }
  }

export default validate
