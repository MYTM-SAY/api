import { prisma } from '../db/PrismaClient';

export const UserRepo = {
  // update last login with curent date
 
  async updateLastLogin(userId: number) {
    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        lastLogin: new Date(),
      },
    });
    return result;
  },
  async findUserByClerkId(id: string) {
    const result = await prisma.user.findUnique({
      where: {
        clerkId: id,
      },
    });
    return result;
  },

  async findById(id: number) {
    const result = await prisma.user.findUnique({
      where: { id },
    });
    return result;
  },

  async createUser({
    clerkId,
    email,
    username,
  }: {
    clerkId: string;
    email: string;
    username: string;
  }) {
    const result = await prisma.user.create({
      data: {
        clerkId,
        email,
        username,
      },
    });
    return result;
  },

  // given id return the name and username of the user
  async getNameAndUsername(id: number) {
    const result = await prisma.user.findUnique({
      where: { id },
      select: { fullname: true, username: true },
    });
    return result;
  },






  // fun to number of contributions by user repo : number of posts, comments, postvotes, commentvotes
  async contributionsOfUser(id: number) {
    const posts = await prisma.post.count({
      where: { authorId: id },
    });
    const comments = await prisma.comment.count({
      where: { authorId: id },
    });
    const postVotes = await prisma.postVote.count({
      where: { userId: id },
    });
    const commentVotes = await prisma.commentVote.count({
      where: { userId: id },
    });
    return { posts, comments, postVotes, commentVotes };
  },

  // return the communities names and Ids that the user is asscioed to , also their count
  async getCommunitiesOfUser(_id: number) {

    const communities = await prisma.community.findMany({
      where: { Members: { some: { id: _id } } },
      select: { name: true, id: true },
    });
    return { count: communities.length, communities };
  },

  // return joinned date
  async getJoinnedDate(_id: number) {
    const user = await prisma.user.findUnique({
      where: { id: _id },
      select: { createdAt: true },
    });
    return user?.createdAt;
  },

  // get last login date
  async getLastLoginDate(_id: number) {
    const user = await prisma.user.findUnique({
      where: { id: _id },
      select: { lastLogin: true },
    });
    return user?.lastLogin;
  },

  // get all contrubitions of user of a given community id, do not count the contrubitions of the user just return list with the details for each type of contrubition

  async contributionsOfUserInCommunity(userId: number, communityId: number) {
    const posts = await prisma.post.findMany({
      where: { authorId: userId, communityId },
    });
    const comments = await prisma.comment.findMany({
      where: { authorId: userId, communityId },
    });
    const postVotes = await prisma.postVote.findMany({
      where: { userId, communityId },
    });
    const commentVotes = await prisma.commentVote.findMany({
      where: { userId, communityId },
    });
    
    return { posts, comments, postVotes, commentVotes };
  }

};
