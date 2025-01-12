/*
  Warnings:

  - Added the required column `importance` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectDay` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "importance" TEXT NOT NULL,
ADD COLUMN     "selectDay" TEXT NOT NULL;
