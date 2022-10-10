/*
  Warnings:

  - You are about to drop the column `firendsRequest` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "firendsRequest",
ADD COLUMN     "friendsRequest" TEXT[];
