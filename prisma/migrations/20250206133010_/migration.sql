/*
  Warnings:

  - The primary key for the `SeenMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SeenMessage` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "SeenMessage_id_key";

-- AlterTable
ALTER TABLE "SeenMessage" DROP CONSTRAINT "SeenMessage_pkey",
DROP COLUMN "id";
