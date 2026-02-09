import { Router, Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma'
import { generateTokens, verifyRefreshToken } from '../utils/jwt'
import { ApiError } from '../types/error'

const router = Router()

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, username } = req.body

    if (!email || !password) {
      throw new ApiError('Email and password are required', 400)
    }

    if (password.length < 8) {
      throw new ApiError('Password must be at least 8 characters', 400)
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new ApiError('Email already registered', 409)
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        username: username || null,
      },
    })

    // Generate tokens
    const tokens = generateTokens({ userId: user.id, email: user.email })

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        ...tokens,
      },
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new ApiError('Email and password are required', 400)
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new ApiError('Invalid credentials', 401)
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      throw new ApiError('Invalid credentials', 401)
    }

    // Generate tokens
    const tokens = generateTokens({ userId: user.id, email: user.email })

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
        },
        ...tokens,
      },
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      throw new ApiError('Refresh token is required', 400)
    }

    try {
      const payload = verifyRefreshToken(refreshToken)

      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      })

      if (!user) {
        throw new ApiError('User not found', 401)
      }

      // Generate new tokens
      const tokens = generateTokens({ userId: user.id, email: user.email })

      res.json({
        success: true,
        data: tokens,
      })
    } catch (error) {
      throw new ApiError('Invalid or expired refresh token', 401)
    }
  } catch (error) {
    next(error)
  }
})

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  // Client-side should delete tokens
  res.json({
    success: true,
    message: 'Logged out successfully',
  })
})

export default router
