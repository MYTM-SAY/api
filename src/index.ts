import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import globalExceptionHandlerMiddleware from './middlewares/globalExceptionHandlingMiddleware'
import cookieParser from 'cookie-parser'

const app = express()
const port = process.env.PORT || 5500
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
          },
        },
        LessonWithMaterial: {
          allOf: [
            { $ref: '#/components/schemas/Lesson' },
            {
              type: 'object',
              properties: {
                Material: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    materialType: {
                      type: 'string',
                      enum: ['VIDEO', 'AUDIO', 'IMG', 'DOC', 'FILE'],
                    },
                    fileUrl: { type: 'string', format: 'uri' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          ],
        },
        LessonWithSection: {
          allOf: [
            { $ref: '#/components/schemas/Lesson' },
            {
              type: 'object',
              properties: {
                Section: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    isCompleted: { type: 'boolean' },
                    classroomId: { type: 'integer' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          ],
        },
        CreateLessonInput: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 100 },
            notes: { type: 'string', maxLength: 5000, nullable: true },
            sectionId: { type: 'integer' },
          },
          required: ['name', 'sectionId'],
        },
        UpdateLessonInput: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 100 },
            notes: { type: 'string', maxLength: 5000, nullable: true },
          },
        },
        CreateMaterialInput: {
          type: 'object',
          properties: {
            materialType: {
              type: 'string',
              enum: ['VIDEO', 'AUDIO', 'IMG', 'DOC', 'FILE'],
            },
            fileUrl: { type: 'string', format: 'uri' },
          },
          required: ['materialType', 'fileUrl'],
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'], // Ensure this path matches your route files
}
const swaggerSpecs = swaggerJsdoc(options)
dotenv.config()

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
