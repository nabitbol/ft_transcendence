/*
  Warnings:

  - Added the required column `condition` to the `Achievement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "condition" INTEGER NOT NULL;
