import express from 'express';

import { getLeaderboardByQuiz } from '../controllers/leaderBoardController';
const app = express.Router();

app.get('/leaderboard/:commId', getLeaderboardByQuiz);

export default app;
