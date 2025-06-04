/*
  Warnings:

  - You are about to drop the column `classroomId` on the `CompletedLessons` table. All the data in the column will be lost.
  - You are about to drop the column `communityId` on the `CompletedLessons` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `Lesson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,lessonId]` on the table `CompletedLessons` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CompletedLessons" DROP CONSTRAINT "CompletedLessons_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedLessons" DROP CONSTRAINT "CompletedLessons_communityId_fkey";

-- DropIndex
DROP INDEX "CompletedLessons_userId_lessonId_communityId_classroomId_key";

-- AlterTable
ALTER TABLE "CompletedLessons" DROP COLUMN "classroomId",
DROP COLUMN "communityId";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "isCompleted";

-- CreateIndex
CREATE UNIQUE INDEX "CompletedLessons_userId_lessonId_key" ON "CompletedLessons"("userId", "lessonId");
