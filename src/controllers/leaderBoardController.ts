import { NextFunction, Request, Response } from 'express';
import { leaderBoardRepo } from '../repos/leaderBoard.repo';

export const getTopTenByScore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const leaderboard = await leaderBoardRepo.getTopTenByScore(
      +(req.params.commId),
    );
    return res.status(200).json(leaderboard);
  } catch (error) {
    next(error);
  }
};
