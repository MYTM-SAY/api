import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import globalExceptionHandlerMiddleware from './middlewares/globalExceptionHandlingMiddleware'
import cookieParser from 'cookie-parser'

const app = express()
const port = process.env.PORT || 4000
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API Documentation with Swagger in TypeScript',
    },
    servers: [
      {
        url: `http://localhost:${port}/api/v1`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
}
const swaggerSpecs = swaggerJsdoc(options)
dotenv.config()

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

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
