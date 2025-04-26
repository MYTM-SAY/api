import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import './middlewares/googleAuthMiddleware'              // ← load your GoogleStrategy
import router from './routes'                  // includes /auth routes (register, login, google, etc.)
import globalExceptionHandlerMiddleware from './middlewares/globalExceptionHandlingMiddleware'
import swaggerOptions from './config/swagger/swagger.config'

dotenv.config()
const app = express()
const port = process.env.PORT || 5500
const swaggerSpecs = swaggerJsdoc(swaggerOptions)

// CORS & JSON parsing
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// Session (needed for the OAuth handshake state)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }),
)

// Passport initialization
app.use(passport.initialize())
app.use(passport.session())

// Simple logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Health endpoint
app.get('/', (_req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  })
})

// Mount API routes (includes your google-auth endpoints under /api/v1/auth/google…)
app.use('/api/v1/', router)

// Swagger UI
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

// Global error handler
app.use(globalExceptionHandlerMiddleware)

// Start server
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`)
})
