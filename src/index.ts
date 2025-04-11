import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import globalExceptionHandlerMiddleware from './middlewares/globalExceptionHandlingMiddleware'
import swaggerOptions from './config/swagger/swagger.config'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()
const port = process.env.PORT || 5500
const swaggerSpecs = swaggerJsdoc(swaggerOptions)

app.use(
  cors({
    origin: process.env.CLIENT_URL || `http://localhost:${port}`,
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})
app.get('/', (req, res) => {
  return res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  })
})

app.use('/api/v1/', router)
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))
app.use(globalExceptionHandlerMiddleware)

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`)
})
