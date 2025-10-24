/*
  Warnings:

  - You are about to drop the column `userId` on the `File` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_userId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
