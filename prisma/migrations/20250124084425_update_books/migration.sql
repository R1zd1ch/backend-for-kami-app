/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "isFavourite" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Book_id_key" ON "Book"("id");
