/*
  Warnings:

  - Made the column `communityId` on table `Quiz` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Quiz" ALTER COLUMN "communityId" SET NOT NULL;
