import { NextFunction, Request, Response } from 'express';
import { leaderBoardRepo } from '../repos/leaderBoard.repo';

export const getLeaderboardByQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const leaderboard = await leaderBoardRepo.getTopTen(
      +(req.params.commId),
    );
    return res.status(200).json(leaderboard);
  } catch (error) {
    next(error);
  }
};
