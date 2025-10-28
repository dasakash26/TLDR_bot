/*
  Warnings:

  - You are about to drop the column `vectorId` on the `FileChunk` table. All the data in the column will be lost.
  - Added the required column `vector_id` to the `FileChunk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileChunk" DROP COLUMN "vectorId",
ADD COLUMN     "vector_id" TEXT NOT NULL;
