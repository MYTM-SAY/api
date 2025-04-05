import express from 'express'
import {
  getSectionsByClassroomId,
  getSectionById,
  createSection,
  deleteSection,
  updateSection,
} from '../controllers/sectionController'
import { isAuthenticated } from '../middlewares/authMiddleware'

const router = express.Router()

router.use(isAuthenticated)

/**
 * @swagger
 * /sections/classrooms/{classroomId}:
 *   get:
 *     summary: Get all sections by classroom ID
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the classroom to retrieve sections for
 *     responses:
 *       200:
 *         description: Sections retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Sections retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Section'
 *             example:
 *               success: true
 *               message: "Sections retrieved successfully"
 *               data:
 *                 - id: 1
 *                   name: "Mathematics Basics"
 *                   description: "Introduction to basic math concepts"
 *                   classroomId: 1
 *                   createdAt: "2023-10-01T10:00:00Z"
 *                   updatedAt: "2023-10-01T10:00:00Z"
 *       400:
 *         description: Invalid classroom ID
 *       404:
 *         description: Classroom not found
 *       500:
 *         description: Internal server error
 */
router.get('/classrooms/:classroomId', getSectionsByClassroomId)

/**
 * @swagger
 * /sections/{id}:
 *   get:
 *     summary: Get a single section by ID
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the section to retrieve
 *     responses:
 *       200:
 *         description: Section retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Section retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/SectionWithClassroom'
 *             example:
 *               success: true
 *               message: "Section retrieved successfully"
 *               data:
 *                 id: 1
 *                 name: "Updated Section Name"
 *                 description: "Updated description"
 *                 classroomId: 1
 *                 createdAt: "2025-03-18T21:58:24.971Z"
 *                 updatedAt: "2025-03-18T22:00:51.265Z"
 *                 Classroom:
 *                   id: 1
 *                   name: "Math 101"
 *                   description: "Basic math class"
 *                   coverImg: "https://example.com/image.jpg"
 *                   communityId: 1
 *                   createdAt: "2025-03-18T21:53:13.918Z"
 *                   updatedAt: "2025-03-18T21:53:13.918Z"
 *                   progress: 0
 *       400:
 *         description: Invalid section ID
 *       404:
 *         description: Section not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getSectionById)

/**
 * @swagger
 * /sections:
 *   post:
 *     summary: Create a new section
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSectionInput'
 *           example:
 *             name: "Algebra Basics"
 *             description: "Introduction to algebraic concepts"
 *             classroomId: 1
 *     responses:
 *       201:
 *         description: Section created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Section created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/SectionWithClassroom'
 *             example:
 *               success: true
 *               message: "Section created successfully"
 *               data:
 *                 id: 1
 *                 name: "Algebra Basics"
 *                 description: "Introduction to algebraic concepts"
 *                 classroomId: 1
 *                 createdAt: "2025-03-18T21:58:24.971Z"
 *                 updatedAt: "2025-03-18T21:58:24.971Z"
 *                 Classroom:
 *                   id: 1
 *                   name: "Math 101"
 *                   description: "Basic math class"
 *                   coverImg: "https://example.com/image.jpg"
 *                   communityId: 1
 *                   createdAt: "2025-03-18T21:53:13.918Z"
 *                   updatedAt: "2025-03-18T21:53:13.918Z"
 *                   progress: 0
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Classroom not found
 *       500:
 *         description: Internal server error
 */
router.post('/', createSection)

/**
 * @swagger
 * /sections/{id}:
 *   patch:
 *     summary: Update a section by ID
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the section to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSectionInput'
 *           example:
 *             name: "Updated Section Name"
 *             description: "Updated description"
 *     responses:
 *       200:
 *         description: Section updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Section updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Section'
 *             example:
 *               success: true
 *               message: "Section updated successfully"
 *               data:
 *                 id: 1
 *                 name: "Updated Section Name"
 *                 description: "Updated description"
 *                 classroomId: 1
 *                 createdAt: "2025-03-18T21:58:24.971Z"
 *                 updatedAt: "2025-03-18T22:00:51.265Z"
 *       400:
 *         description: Invalid section ID or input data
 *       404:
 *         description: Section not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', updateSection)

/**
 * @swagger
 * /sections/{id}:
 *   delete:
 *     summary: Delete a section by ID
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the section to delete
 *     responses:
 *       200:
 *         description: Section deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Section deleted successfully"
 *                 data:
 *                   type: null
 *             example:
 *               success: true
 *               message: "Section deleted successfully"
 *               data: null
 *       400:
 *         description: Invalid section ID
 *       404:
 *         description: Section not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteSection)

export default router
