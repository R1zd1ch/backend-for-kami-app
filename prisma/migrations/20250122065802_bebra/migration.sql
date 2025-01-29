/*
  Warnings:

  - Added the required column `updatedAt` to the `Mood` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mood" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
