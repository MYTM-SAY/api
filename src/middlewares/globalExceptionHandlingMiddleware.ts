import { NextFunction, Request, Response } from 'express'
import APIError from '../errors/APIError'
import { ResponseHelper } from '../utils/responseHelper'
import { ZodError } from 'zod'

const globalExceptionHandlerMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof APIError) {
    return res
      .status(error.statusCode)
      .json(ResponseHelper.error(error.message, error.statusCode))
  }
  if (error instanceof ZodError) {
    return res
      .status(400)
      .json(ResponseHelper.error('Validation failed', 400, error.format()))
  }
  return res
    .status(500)
    .json(ResponseHelper.error(`${error.name} => ${error.message}`, 500))
}

export default globalExceptionHandlerMiddleware
