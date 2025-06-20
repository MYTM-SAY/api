import { Request, Response, NextFunction } from 'express'
import { ZodError, ZodSchema } from 'zod'
import { ResponseHelper } from '../utils/responseHelper'

const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (ex: any) {
      return res
        .status(400)
        .json(ResponseHelper.error('Validation error', 400, ex.errors || ex))
    }
  }

export default validate
