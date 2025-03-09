import express from 'express';
import {
  discoverCommunities,
  getCommunities,
  createCommunity,
  deleteCommunity,
  updateCommunity,
  getCommunity,
} from '../controllers/communityController';

import {
  promoteToModerator,
  demoteFromModerator,
} from '../controllers/memberRoles';

import { isAuthenticated } from '../middlewares/authMiddleware';

const app = express.Router();

app.get('/discover', discoverCommunities);
app.post('/remove-moderator', isAuthenticated, demoteFromModerator);
app.post('/assign-moderator', isAuthenticated, promoteToModerator);
/**
 * @swagger
 * /api/v1/communities:
 *   get:
 *     summary: Get all communities
 *     description: Fetch a list of all communities.
 *     tags: [Communities]
 *     responses:
 *       200:
 *         description: Successfully retrieved communities.
 *       500:
 *         description: Server error.
 */

app.get('/', getCommunities);
app.post('/', createCommunity);
app.delete('/:id', deleteCommunity);
app.put('/:id', updateCommunity);
app.get('/:id', getCommunity);
app.get('/', isAuthenticated, getCommunities);

export default app;
