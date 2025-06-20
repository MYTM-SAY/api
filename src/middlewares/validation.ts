import { Request, Response, NextFunction } from 'express'
import { ZodError, ZodSchema } from 'zod'
import { ResponseHelper } from '../utils/responseHelper'

const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (ex) {
      if (ex instanceof ZodError) {
        const message = ex.errors.map((e) => e.message).join(', ')
        return res
          .status(400)
          .json(ResponseHelper.error(message, 400, ex.errors))
      }

      return res
        .status(500)
        .json(ResponseHelper.error('Unexpected validation error', 500, ex))
    }
  }

export default validate
