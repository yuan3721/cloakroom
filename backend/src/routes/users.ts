import { Router, Response, NextFunction } from 'express'
import prisma from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { uploadImage } from '../utils/upload'
import { ApiError } from '../types/error'

const router = Router()

// All routes require authentication
router.use(authMiddleware)

// GET /api/users/me
router.get('/me', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new ApiError('User not found', 404)
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/users/me
router.put('/me', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body

    if (username && username.length > 100) {
      throw new ApiError('Username must be less than 100 characters', 400)
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        username: username !== undefined ? username : undefined,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    })

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/users/me/avatar
router.put(
  '/me/avatar',
  uploadImage.single('avatar'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new ApiError('No file uploaded', 400)
      }

      const avatarUrl = `/uploads/${req.file.filename}`

      const user = await prisma.user.update({
        where: { id: req.user!.userId },
        data: { avatar: avatarUrl },
        select: {
          id: true,
          email: true,
          username: true,
          avatar: true,
          createdAt: true,
        },
      })

      res.json({
        success: true,
        data: user,
      })
    } catch (error) {
      next(error)
    }
  }
)

export default router
