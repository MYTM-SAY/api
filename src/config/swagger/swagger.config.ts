import swaggerJsdoc from 'swagger-jsdoc'
import { schemas } from './schemas'

const port = process.env.PORT || 3000

const swaggerOptions: swaggerJsdoc.Options = {
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
      schemas,
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'], //
}

export default swaggerOptions
