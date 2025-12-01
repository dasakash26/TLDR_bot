-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "citations" JSONB;

-- AlterTable
ALTER TABLE "_FolderToUser" ADD CONSTRAINT "_FolderToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "public"."_FolderToUser_AB_unique";
