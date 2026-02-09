import { Router, Response, NextFunction } from 'express'
import prisma from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { ApiError } from '../types/error'

const router = Router()

// All routes require authentication
router.use(authMiddleware)

// GET /api/rooms
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { userId: req.user!.userId },
      orderBy: { displayOrder: 'asc' },
    })

    res.json({
      success: true,
      data: rooms,
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/rooms
router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, icon } = req.body

    if (!name) {
      throw new ApiError('Room name is required', 400)
    }

    // Check for duplicate name
    const existingRoom = await prisma.room.findFirst({
      where: {
        userId: req.user!.userId,
        name,
      },
    })

    if (existingRoom) {
      throw new ApiError('Room with this name already exists', 409)
    }

    const room = await prisma.room.create({
      data: {
        userId: req.user!.userId,
        name,
        icon: icon || null,
      },
    })

    res.status(201).json({
      success: true,
      data: room,
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/rooms/:id
router.put('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, icon, displayOrder } = req.body

    // Check if room exists and belongs to user
    const existingRoom = await prisma.room.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
    })

    if (!existingRoom) {
      throw new ApiError('Room not found', 404)
    }

    const room = await prisma.room.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        icon: icon !== undefined ? icon : undefined,
        displayOrder: displayOrder !== undefined ? displayOrder : undefined,
      },
    })

    res.json({
      success: true,
      data: room,
    })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/rooms/:id
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // Check if room exists and belongs to user
    const existingRoom = await prisma.room.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
    })

    if (!existingRoom) {
      throw new ApiError('Room not found', 404)
    }

    await prisma.room.delete({
      where: { id },
    })

    res.json({
      success: true,
      message: 'Room deleted successfully',
    })
  } catch (error) {
    next(error)
  }
})

export default router
