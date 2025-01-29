/*
  Warnings:

  - You are about to alter the column `progress` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "progress" SET DATA TYPE INTEGER;
