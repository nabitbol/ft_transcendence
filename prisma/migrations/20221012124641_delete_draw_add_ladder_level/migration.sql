/*
  Warnings:

  - You are about to drop the column `draw` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userRankId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserRank` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userRankId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "draw",
DROP COLUMN "level",
DROP COLUMN "userRankId",
ADD COLUMN     "ladder_level" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "UserRank";
