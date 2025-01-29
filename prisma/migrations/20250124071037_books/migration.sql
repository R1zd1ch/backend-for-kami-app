/*
  Warnings:

  - You are about to drop the column `author` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `isFinished` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "author",
DROP COLUMN "isFinished",
ADD COLUMN     "authors" TEXT[],
ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "isbn" TEXT,
ADD COLUMN     "publishedDate" TEXT,
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'to-read',
ALTER COLUMN "progress" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Book_externalId_key" ON "Book"("externalId");

-- CreateIndex
CREATE INDEX "Book_externalId_idx" ON "Book"("externalId");
