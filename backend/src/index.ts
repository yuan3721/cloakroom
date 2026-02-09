import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { errorHandler } from './middleware/errorHandler'
import healthRouter from './routes/health'
import authRouter from './routes/auth'
import usersRouter from './routes/users'
import roomsRouter from './routes/rooms'
import seasonsRouter from './routes/seasons'
import clothingRouter from './routes/clothing'

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes
app.use('/api', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/rooms', roomsRouter)
app.use('/api/seasons', seasonsRouter)
app.use('/api/clothing', clothingRouter)

// Error handling middleware (must be last)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})

export default app
