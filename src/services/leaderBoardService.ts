import { leaderBoardRepo } from '../repos/leaderBoard.repo'

async function getTopTenByScore(communityId: number) {
  const result = await leaderBoardRepo.getTopTenByScore(communityId);
  return result;
}

export const LeaderBoardService = {
  getTopTenByScore,
}
