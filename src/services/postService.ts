import { z } from 'zod'
import APIError from '../errors/APIError'
import { ForumRepo } from '../repos/forum.repo'
import { PostRepo } from '../repos/post.repo'
import { PostSchema, PostUpdateSchema } from '../utils/zod/postSchemes'
import { UserRepo } from '../repos/user.repo'
import { VoteType, PostVote } from '@prisma/client';
import { CommunityRepo } from '../repos/community.repo'
import { CommunityMembersRepo } from '../repos/communityMember.repo'
import { use } from 'passport'
import { Role } from '@prisma/client'

async function getPostsByForumId(forumId: number) {


  if (!forumId) throw new APIError('Missing forumId', 404)

  const forum = await ForumRepo.findById(forumId)
  if (!forum) throw new APIError('Forum not found', 404)
    
  let posts = await PostRepo.findPostsByForumId(forumId);
  if (!posts) {
    throw new APIError('Posts not found', 404);
  }
  
  return posts
}


async function createPost(data: z.infer<typeof PostSchema>, authorId: number) {
  const forumExist = await ForumRepo.findById(data.forumId)
  if (!forumExist) throw new APIError('Forum not found', 404)
  return await PostRepo.create(data, authorId)
}

async function getPostById(postId: number) {

  if (!postId) throw new APIError('Missing postId', 404)

  const post = await PostRepo.findById(postId)

  if (!post) throw new APIError('Post not found', 404)

  const voteScore = await PostRepo.getVoteCount(post.id);
  const { _count, ...rest } = post
  const filiterdPost = {
      ...rest,
      commentsCount: _count.Comments,  
      voteScore
    };

  return filiterdPost
}

async function updatePost(
  postId: number,
  data: z.infer<typeof PostUpdateSchema>,
) {
  const validatedData = await PostUpdateSchema.parseAsync(data)
  const postExist = await PostRepo.findById(postId)
  if (!postExist) throw new APIError('Post not found', 404)
  validatedData.updatedAt = new Date()
  return await PostRepo.update(postId, validatedData)
}

async function deletePost( userId: number,postId: number,) {

  if (!postId) throw new APIError('Missing postId', 404)

  const post = await PostRepo.findById(postId)
  if (!post) throw new APIError('Post not found', 404)

  const AccessAndCommunity= await PostRepo.getPostAuthorAndCommunity(userId, postId);
  if (!AccessAndCommunity) throw new APIError('Can not get the Access Info for this post', 404)
  

    if(AccessAndCommunity.Author.id !== userId )
      throw new APIError('You are not allowed to delete this post', 403)

  return post
}

async function upVotePost(
  postId: number,
    userId: number
  ): Promise<{ vote: PostVote; voteCount: number }> {
    const existing = await PostRepo.votedBefore(postId, userId);
    let newType: VoteType = VoteType.UPVOTE;

    if (existing) {
      if (existing.type === VoteType.UPVOTE) {
        newType = VoteType.NONE;
      } else if (existing.type === VoteType.DOWNVOTE) {
        newType = VoteType.UPVOTE;
      }
    }

    const vote = await PostRepo.setVote(postId, userId, newType);
    const voteCount = await PostRepo.getVoteCount(postId);

    return { vote, voteCount };
  }

async function downVotePost(
  postId: number,
    userId: number
  ): Promise<{ vote: PostVote; voteCount: number }> {
    const existing = await PostRepo.votedBefore(postId, userId);
    let newType: VoteType = VoteType.DOWNVOTE;

    if (existing) {
      if (existing.type === VoteType.DOWNVOTE) {
        newType = VoteType.NONE;
      } else if (existing.type === VoteType.UPVOTE) {
        newType = VoteType.DOWNVOTE;
      }
    }

    const vote = await PostRepo.setVote(postId, userId, newType);
    const voteCount = await PostRepo.getVoteCount(postId);

    return { vote, voteCount };
  }


async function getAllPostContribByUser(userId: number) {
  if (!userId) throw new APIError('Missing userId', 404)
  const user = await UserRepo.findById(userId)
  if (!user) throw new APIError('User not found', 404)
  const posts = await PostRepo.getAllContribByUserId(userId)
  if (!posts) throw new APIError('Posts not found', 404)
 
    const filiterdPosts = posts.map((post) => {
      const { _count, ...rest } = post; 
  
      return {
        ...rest,
        commentsCount: _count.Comments,  
      };
    
    });
  
    return filiterdPosts
  }

async function getAllPostsFromCommunitiesJoinedByUser(userId: number) {
  // 1️⃣ Input validation
  if (!userId) {
    throw new APIError('Missing userId', 400);
  }

  // 2️⃣ Ensure user exists
  const user = await UserRepo.findById(userId);
  if (!user) {
    throw new APIError('User not found', 404);
  }

  // 3️⃣ Fetch flat list of posts  
  const posts = await PostRepo.getPostsFromCommunitiesJoinedByUser(userId);
  if (!posts.length) {
    return []; 
  }

  // 4️⃣ Map to your exact JSON shape
  return posts.map(post => ({
    id:           post.id,
    title:        post.title,
    content:      post.content,
    voteCounter:  post._count.PostVotes,
    attachments:  post.attachments,
    forumId:      post.forumId,
    createdAt:    post.createdAt,
    updatedAt:    post.updatedAt,
    commentCount: post._count.Comments,
    author: {
      id:        post.Author.id,
      username:  post.Author.username,
      fullname:  post.Author.fullname,
      // fallback to a default if none set
      avatarUrl: post.Author.UserProfile?.profilePictureURL ?? 'defaultavatar.jpg'
    }
  }));
}

export const PostService = {
  getPostsByForumId,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  upVotePost,
  downVotePost,
  getAllPostContribByUser,

  getAllPostsFromCommunitiesJoinedByUser,
}
