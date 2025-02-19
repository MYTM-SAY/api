import express from 'express';
import {
  discoverCommunities,
  getCommunities,
  createCommunity,
  deleteCommunity,
  updateCommunity,
  getCommunity,
} from '../controllers/communityController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const app = express.Router();

app.get('/discover', discoverCommunities);
app.get('/', getCommunities);
app.post('/', createCommunity);
app.delete('/:id', deleteCommunity);
app.put('/:id', updateCommunity);
app.get('/:id', getCommunity);
app.get('/', isAuthenticated, getCommunities);

export default app;
