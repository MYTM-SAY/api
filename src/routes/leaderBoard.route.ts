import express from 'express';

import { getTopTenByScore } from '../controllers/leaderBoardController';
const app = express.Router();

app.get('/score-leaderboard/:commId', getTopTenByScore);

export default app;
