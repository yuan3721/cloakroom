import { Router, Request, Response, NextFunction } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/seasons
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: { displayOrder: 'asc' },
    })

    res.json({
      success: true,
      data: seasons,
    })
  } catch (error) {
    next(error)
  }
})

export default router
