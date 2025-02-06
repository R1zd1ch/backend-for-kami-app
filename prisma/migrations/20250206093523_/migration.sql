/*
  Warnings:

  - The primary key for the `SeenMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `SeenMessage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,messageId]` on the table `SeenMessage` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `SeenMessage` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "SeenMessage" DROP CONSTRAINT "SeenMessage_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "SeenMessage_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "SeenMessage_id_key" ON "SeenMessage"("id");

-- CreateIndex
CREATE INDEX "SeenMessage_messageId_idx" ON "SeenMessage"("messageId");

-- CreateIndex
CREATE INDEX "SeenMessage_userId_idx" ON "SeenMessage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SeenMessage_userId_messageId_key" ON "SeenMessage"("userId", "messageId");
