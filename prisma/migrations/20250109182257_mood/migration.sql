/*
  Warnings:

  - You are about to drop the column `average` on the `MoodSummary` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,month,year]` on the table `MoodSummary` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `averageMonth` to the `MoodSummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `averageWeek` to the `MoodSummary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MoodSummary" DROP COLUMN "average",
ADD COLUMN     "averageMonth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "averageWeek" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MoodSummary_userId_month_year_key" ON "MoodSummary"("userId", "month", "year");
