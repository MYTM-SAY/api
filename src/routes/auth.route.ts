import express from 'express'
import { login, refreshToken, register } from '../controllers/authController'
import {
  googleAuth,
  googleAuthCallback
} from '../controllers/googleAuthController'  // new import

const router = express.Router()

/**
 * @swaggerdis
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "John Doe"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securepassword"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1995-06-15"
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securepassword"
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', login)

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh the access token
 *     description: Generates a new access token using a valid refresh token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token obtained during login
 *     responses:
 *       200:
 *         description: Successfully refreshed access token
 */
router.post('/refresh-token', refreshToken)


router.get(
  '/google',
  googleAuth                                
)

router.get(
  '/google/callback',
  ...googleAuthCallback                      
)

export default router
