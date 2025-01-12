/*
  Warnings:

  - Added the required column `isPinned` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "isPinned" BOOLEAN NOT NULL,
ADD COLUMN     "tags" TEXT;
