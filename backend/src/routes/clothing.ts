import { Router, Response, NextFunction } from 'express'
import prisma from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { uploadImage } from '../utils/upload'
import { ApiError } from '../types/error'

// Helper type for clothing season mapping
interface ClothingSeasonWithSeason {
  season: { id: string; name: string }
}

const router = Router()

// All routes require authentication
router.use(authMiddleware)

// GET /api/clothing
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      roomId,
      seasonId,
      seasonIds,
      search,
      sort = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '20',
    } = req.query

    const pageNum = parseInt(page as string, 10)
    const limitNum = parseInt(limit as string, 10)
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const where: any = {
      userId: req.user!.userId,
    }

    // Room filter
    if (roomId === 'null') {
      where.roomId = null
    } else if (roomId) {
      where.roomId = roomId
    }

    // Season filter
    if (seasonId || seasonIds) {
      const seasonIdList = seasonIds
        ? (seasonIds as string).split(',')
        : [seasonId as string]

      where.seasons = {
        some: {
          seasonId: {
            in: seasonIdList,
          },
        },
      }
    }

    // Search filter
    if (search) {
      where.name = {
        contains: search as string,
        mode: 'insensitive',
      }
    }

    // Build order by
    const orderBy: any = {}
    const validSortFields = ['createdAt', 'name', 'updatedAt']
    const sortField = validSortFields.includes(sort as string) ? sort : 'createdAt'
    orderBy[sortField as string] = order === 'asc' ? 'asc' : 'desc'

    // Get total count
    const total = await prisma.clothing.count({ where })

    // Get clothing items
    const clothing = await prisma.clothing.findMany({
      where,
      include: {
        room: true,
        seasons: {
          include: {
            season: true,
          },
        },
      },
      orderBy,
      skip,
      take: limitNum,
    })

    // Transform response
    const items = clothing.map((item: any) => ({
      ...item,
      seasons: item.seasons.map((cs: ClothingSeasonWithSeason) => cs.season),
    }))

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/clothing
router.post(
  '/',
  uploadImage.single('image'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        description,
        color,
        size,
        brand,
        purchaseDate,
        roomId,
        seasonIds,
      } = req.body

      if (!name) {
        throw new ApiError('Clothing name is required', 400)
      }

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null

      // Parse seasonIds if it's a string
      let parsedSeasonIds: string[] = []
      if (seasonIds) {
        parsedSeasonIds = typeof seasonIds === 'string' ? JSON.parse(seasonIds) : seasonIds
      }

      const clothing = await prisma.clothing.create({
        data: {
          userId: req.user!.userId,
          name,
          description: description || null,
          color: color || null,
          size: size || null,
          brand: brand || null,
          purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
          imageUrl,
          roomId: roomId || null,
          seasons: {
            create: parsedSeasonIds.map((id: string) => ({
              seasonId: id,
            })),
          },
        },
        include: {
          room: true,
          seasons: {
            include: {
              season: true,
            },
          },
        },
      })

      res.status(201).json({
        success: true,
        data: {
          ...clothing,
          seasons: clothing.seasons.map((cs: ClothingSeasonWithSeason) => cs.season),
        },
      })
    } catch (error) {
      next(error)
    }
  }
)

// GET /api/clothing/:id
router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const clothing = await prisma.clothing.findUnique({
      where: { id },
      include: {
        room: true,
        seasons: {
          include: {
            season: true,
          },
        },
      },
    })

    if (!clothing) {
      throw new ApiError('Clothing not found', 404)
    }

    if (clothing.userId !== req.user!.userId) {
      throw new ApiError('Forbidden', 403)
    }

    res.json({
      success: true,
      data: {
        ...clothing,
        seasons: clothing.seasons.map((cs: ClothingSeasonWithSeason) => cs.season),
      },
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/clothing/:id
router.put(
  '/:id',
  uploadImage.single('image'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const {
        name,
        description,
        color,
        size,
        brand,
        purchaseDate,
        roomId,
        seasonIds,
      } = req.body

      // Check ownership
      const existing = await prisma.clothing.findUnique({
        where: { id },
      })

      if (!existing) {
        throw new ApiError('Clothing not found', 404)
      }

      if (existing.userId !== req.user!.userId) {
        throw new ApiError('Forbidden', 403)
      }

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined

      // Parse seasonIds if it's a string
      let parsedSeasonIds: string[] | undefined
      if (seasonIds !== undefined) {
        parsedSeasonIds = typeof seasonIds === 'string' ? JSON.parse(seasonIds) : seasonIds
      }

      // Update clothing with seasons
      const clothing = await prisma.clothing.update({
        where: { id },
        data: {
          name: name !== undefined ? name : undefined,
          description: description !== undefined ? description : undefined,
          color: color !== undefined ? color : undefined,
          size: size !== undefined ? size : undefined,
          brand: brand !== undefined ? brand : undefined,
          purchaseDate: purchaseDate !== undefined ? (purchaseDate ? new Date(purchaseDate) : null) : undefined,
          imageUrl: imageUrl !== undefined ? imageUrl : undefined,
          roomId: roomId !== undefined ? (roomId || null) : undefined,
          seasons: parsedSeasonIds !== undefined ? {
            deleteMany: {},
            create: parsedSeasonIds.map((seasonId: string) => ({
              seasonId,
            })),
          } : undefined,
        },
        include: {
          room: true,
          seasons: {
            include: {
              season: true,
            },
          },
        },
      })

      res.json({
        success: true,
        data: {
          ...clothing,
          seasons: clothing.seasons.map((cs: ClothingSeasonWithSeason) => cs.season),
        },
      })
    } catch (error) {
      next(error)
    }
  }
)

// DELETE /api/clothing/:id
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // Check ownership
    const existing = await prisma.clothing.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new ApiError('Clothing not found', 404)
    }

    if (existing.userId !== req.user!.userId) {
      throw new ApiError('Forbidden', 403)
    }

    await prisma.clothing.delete({
      where: { id },
    })

    res.json({
      success: true,
      message: 'Clothing deleted successfully',
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/clothing/upload - Upload image only
router.post(
  '/upload',
  uploadImage.single('image'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new ApiError('No image file provided', 400)
      }

      const imageUrl = `/uploads/${req.file.filename}`

      res.json({
        success: true,
        imageUrl,
      })
    } catch (error) {
      next(error)
    }
  }
)

export default router
