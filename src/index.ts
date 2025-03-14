import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import error from './middlewares/error'
import { clerkMiddleware } from '@clerk/express'
import router from './routes'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

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
      schemas: {
        Lesson: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            notes: { type: 'string', nullable: true },
            materialId: { type: 'integer' },
            sectionId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            Section: {
              $ref: '#/components/schemas/Section',
            },
          },
          required: [
            'id',
            'name',
            'materialId',
            'sectionId',
            'createdAt',
            'updatedAt',
            'Section',
          ],
        },
        LessonCreate: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 100 },
            notes: { type: 'string', maxLength: 5000, nullable: true },
            materialId: { type: 'integer' },
            sectionId: { type: 'integer' },
          },
          required: ['name', 'materialId', 'sectionId'],
        },
        LessonUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 100 },
            notes: { type: 'string', maxLength: 5000, nullable: true },
            materialId: { type: 'integer' },
            sectionId: { type: 'integer' },
          },
          required: [],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Ensure this path matches your route files
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
app.use(clerkMiddleware())
app.get('/', (req, res) => {
  return res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  })
})

app.use('/api/v1/', router)
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))
app.use(error)

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`)
})
