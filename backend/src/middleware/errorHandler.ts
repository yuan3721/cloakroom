import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../types/error'

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err.message)

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    })
  }

  return res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  })
}
