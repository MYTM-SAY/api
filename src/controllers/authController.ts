import APIError from '../errors/APIError'
import { AuthService } from '../services/authService'
import { Request, Response, NextFunction } from 'express'

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, ...userData } = req.body
    const newUser = await AuthService.register({
      ...userData,
      password: req.body.password,
    })
    return res.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, email } = req.body
    const result = await AuthService.login(email, password)
    return res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body
    const result = await AuthService.refreshToken(refreshToken)
    return res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}
