import swaggerJsdoc from 'swagger-jsdoc'
import { schemas } from './schemas'

const port = process.env.PORT || 3000
const getHostUrl = () => {
  const port = process.env.PORT || 3000
  const host = process.env.HOST || 'localhost'
  const protocol = process.env.HTTPS ? 'https' : 'http'
  return `${protocol}://${host}:${port}`
}

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API Documentation with Swagger in TypeScript',
    },
    tags: [
      {
        name: 'Auth',
        description:
          'Authentication endpoints for user login, registration, etc.',
      },
      { name: 'User', description: 'Endpoints for managing users' },
      { name: 'Profiles', description: 'Endpoints for user profiles' },
      {
        name: 'Communities',
        description: 'Endpoints for managing communities',
      },
      {
        name: 'Favorites',
        description: 'Endpoints for managing favorite communities',
      },
      {
        name: 'Leaderboard',
        description: 'Endpoints for tracking and displaying leaderboard data',
      },
      { name: 'Classrooms', description: 'Endpoints for managing classrooms' },
      { name: 'Sections', description: 'Endpoints for managing sections' },
      { name: 'Lessons', description: 'Endpoints for managing lessons' },
      {
        name: 'Posts',
        description: 'Endpoints for creating and managing posts',
      },
      {
        name: 'Comments',
        description: 'Endpoints for handling comments on posts',
      },
      { name: 'Upload', description: 'Endpoints for file uploads' },
      {
        name: 'Progress',
        description:
          'Endpoints for managing lesson status and progress tracking',
      },
    ],
    servers: [
      {
        url: `${getHostUrl()}/api/v1`,
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
