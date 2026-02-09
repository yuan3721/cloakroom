import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, TokenPayload } from '../utils/jwt'
import { ApiError } from '../types/error'

export interface AuthRequest extends Request {
  user?: TokenPayload
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new ApiError('No token provided', 401)
    }

    const parts = authHeader.split(' ')

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new ApiError('Token format invalid', 401)
    }

    const token = parts[1]

    try {
      const decoded = verifyAccessToken(token)
      req.user = decoded
      next()
    } catch (error) {
      throw new ApiError('Token expired or invalid', 401)
    }
  } catch (error) {
    next(error)
  }
}
