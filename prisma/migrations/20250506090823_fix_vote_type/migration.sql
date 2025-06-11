/*
  Warnings:

  - You are about to drop the column `voteCounter` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `CommentVote` table. All the data in the column will be lost.
  - You are about to drop the column `voteCounter` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `PostVote` table. All the data in the column will be lost.
  - You are about to drop the `_CommunityMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('DOWNVOTE', 'UPVOTE', 'NONE');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "CommentVote" DROP CONSTRAINT "CommentVote_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_forumId_fkey";

-- DropForeignKey
ALTER TABLE "PostVote" DROP CONSTRAINT "PostVote_postId_fkey";

-- DropForeignKey
ALTER TABLE "_CommunityMembers" DROP CONSTRAINT "_CommunityMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommunityMembers" DROP CONSTRAINT "_CommunityMembers_B_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "voteCounter";

-- AlterTable
ALTER TABLE "CommentVote" DROP COLUMN "count",
ADD COLUMN     "type" "VoteType" NOT NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "voteCounter";

-- AlterTable
ALTER TABLE "PostVote" DROP COLUMN "count",
ADD COLUMN     "type" "VoteType" NOT NULL DEFAULT 'NONE';

-- DropTable
DROP TABLE "_CommunityMembers";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_forumId_fkey" FOREIGN KEY ("forumId") REFERENCES "Forum"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostVote" ADD CONSTRAINT "PostVote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVote" ADD CONSTRAINT "CommentVote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
