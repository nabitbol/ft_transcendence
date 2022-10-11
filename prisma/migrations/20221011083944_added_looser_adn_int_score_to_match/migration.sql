/*
  Warnings:

  - You are about to drop the column `score` on the `Match` table. All the data in the column will be lost.
  - Added the required column `looser` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "score",
ADD COLUMN     "looser" TEXT NOT NULL,
ADD COLUMN     "looserScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "winnerScore" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "winner" DROP DEFAULT;
