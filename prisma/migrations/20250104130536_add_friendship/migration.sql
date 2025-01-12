/*
  Warnings:

  - Added the required column `type` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "type" TEXT NOT NULL;
