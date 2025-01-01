/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `extractedId` to the `activeStreams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `activeStreams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activeStreams" ADD COLUMN     "extractedId" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
