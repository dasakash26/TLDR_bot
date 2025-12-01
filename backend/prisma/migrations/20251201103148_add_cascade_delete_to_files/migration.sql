/*
  Warnings:

  - The primary key for the `_FolderToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_FolderToUser` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_folder_id_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "file_size" INTEGER,
ADD COLUMN     "page_count" INTEGER;

-- AlterTable
ALTER TABLE "_FolderToUser" DROP CONSTRAINT "_FolderToUser_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_FolderToUser_AB_unique" ON "_FolderToUser"("A", "B");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
