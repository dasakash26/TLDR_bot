import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  FileText,
  MessagesSquare,
  Calendar,
  Users,
  Share2,
  Loader2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useFolder } from "@/hooks/use-folders";
import { useFolderCollaborators } from "@/hooks/use-folder-sharing";
import { useUser } from "@/hooks/use-user";
import { useFileSelection } from "@/hooks/use-file-selection";
import { FileMetadataDialog } from "..";
import { ShareDialog } from "@/components/share";
import { FolderStats } from "./folder-stats";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const FolderSheet = ({ folderId }: { folderId: string }) => {
  const { data: folder, isLoading } = useFolder(folderId);
  const { data: collaborators = [], isLoading: isLoadingCollaborators } =
    useFolderCollaborators(folderId);
  const { user } = useUser();
  const { openFileView, selectedFileId, isFileViewOpen, closeFileView } =
    useFileSelection();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  const router = useRouter();
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  if (isLoading)
    return (
      <Badge variant="outline" className="gap-2">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading...
      </Badge>
    );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent transition-colors"
        >
          <Folder className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col gap-0 p-0">
        <SheetHeader className="p-6 border-b bg-muted/30 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className="flex items-center gap-3 text-xl font-semibold truncate flex-1 min-w-0">
              <motion.div
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-primary/15 to-primary/5 text-primary ring-2 ring-primary/20 shrink-0"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Folder className="h-5 w-5" />
              </motion.div>
              <span className="truncate">{folder?.name}</span>
            </SheetTitle>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 shrink-0 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
              onClick={() => setShareDialogOpen(true)}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
          <SheetDescription className="text-xs flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3 w-3 opacity-60" />
            Created{" "}
            {new Date(folder?.createdAt || "").toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="px-6 py-6 space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {/* Stats */}
              <motion.section variants={itemVariants}>
                <FolderStats
                  threadsCount={folder?.threads?.length || 0}
                  filesCount={folder?.files?.length || 0}
                  collaboratorsCount={collaborators.length}
                  createdAt={folder?.createdAt || new Date().toISOString()}
                />
              </motion.section>

              <Separator />

              {/* Collaborators List */}
              <motion.section className="space-y-3" variants={itemVariants}>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />{" "}
                    Collaborators
                  </h4>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium">
                    {collaborators.length}
                  </span>
                </div>
                <ScrollArea className="max-h-[280px]">
                  <div className="space-y-2 pr-3">
                    <AnimatePresence mode="wait">
                      {isLoadingCollaborators ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-2"
                        >
                          {[1, 2].map((i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2.5 p-2.5 rounded-lg border bg-card/50"
                            >
                              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                              <div className="flex-1 space-y-1.5">
                                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      ) : collaborators.length > 0 ? (
                        <motion.div
                          key="collaborators"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-2"
                        >
                          {collaborators
                            .slice(0, 5)
                            .map((collab: any, idx: number) => (
                              <motion.div
                                key={collab.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{
                                  x: 2,
                                  transition: { duration: 0.2 },
                                }}
                                className="flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-accent transition-all duration-200"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs font-medium bg-muted">
                                      {(
                                        collab.name?.[0] ||
                                        collab.email?.[0] ||
                                        "U"
                                      ).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm truncate">
                                      {collab.name ||
                                        collab.email ||
                                        `User ${
                                          collab.id?.slice(0, 6) || "Unknown"
                                        }`}
                                    </p>
                                    {collab.id === user?.id && (
                                      <span className="text-xs text-muted-foreground">
                                        (You)
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className="text-xs capitalize bg-muted px-2 py-0.5 rounded font-medium shrink-0 ml-2">
                                  {collab.isOwner ? "Owner" : "Collaborator"}
                                </span>
                              </motion.div>
                            ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex flex-col items-center justify-center p-6 rounded-lg border border-dashed"
                        >
                          <Users className="h-6 w-6 text-muted-foreground/40 mb-1.5" />
                          <p className="text-xs text-muted-foreground">
                            No collaborators yet
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </motion.section>

              <Separator />

              {/* Files List */}
              <motion.section className="space-y-3" variants={itemVariants}>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" /> Files
                  </h4>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium">
                    {folder?.files?.length || 0}
                  </span>
                </div>
                <ScrollArea className="max-h-[280px]">
                  <div className="space-y-2 pr-3">
                    {folder?.files && folder.files.length > 0 ? (
                      folder.files.map((file: any, idx: number) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ x: 2 }}
                          className="group flex items-center justify-between gap-3 p-2.5 rounded-lg border bg-card hover:bg-accent transition-all duration-200 cursor-pointer"
                          onClick={() => openFileView(file.id)}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm truncate">
                              {file.filename}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase px-2 py-0.5 bg-muted rounded font-medium tracking-wide shrink-0">
                            {file.status}
                          </span>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center p-6 rounded-lg border border-dashed"
                      >
                        <FileText className="h-6 w-6 text-muted-foreground/40 mb-1.5" />
                        <p className="text-xs text-muted-foreground">
                          No files yet
                        </p>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
              </motion.section>

              <Separator />

              {/* Threads List */}
              <motion.section className="space-y-3" variants={itemVariants}>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <MessagesSquare className="h-4 w-4 text-muted-foreground" />{" "}
                    Active Threads
                  </h4>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium">
                    {folder?.threads?.length || 0}
                  </span>
                </div>
                <ScrollArea className="max-h-[2vh]">
                  <div className="space-y-2 pr-3">
                    {folder?.threads && folder.threads.length > 0 ? (
                      folder.threads.map((thread: any, idx: number) => (
                        <motion.div
                          onClick={async () =>
                            await router.push(`/chat?threadId=${thread.id}`)
                          }
                          key={thread.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ x: 2 }}
                          className="group flex flex-col gap-1 p-2.5 rounded-lg border bg-card hover:bg-accent transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-start gap-2">
                            <MessagesSquare className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <span className="text-sm font-medium truncate flex-1">
                              {thread.name}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground ml-5">
                            {new Date(thread.updatedAt).toLocaleString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center p-6 rounded-lg border border-dashed"
                      >
                        <MessagesSquare className="h-6 w-6 text-muted-foreground/40 mb-1.5" />
                        <p className="text-xs text-muted-foreground">
                          No threads yet
                        </p>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
              </motion.section>
            </motion.div>
          </div>
        </ScrollArea>

        {/* Dialogs */}
        <FileMetadataDialog
          fileId={selectedFileId}
          open={isFileViewOpen}
          onOpenChange={closeFileView}
        />

        {folder && (
          <ShareDialog
            open={shareDialogOpen}
            onOpenChange={setShareDialogOpen}
            folderId={folder.id}
            folderName={folder.name}
          />
        )}
        <SheetFooter>
          <time
            className="text-xs text-muted-foreground"
            dateTime={new Date().toISOString()}
          >
            &copy; {new Date().getFullYear()} Recap AI
          </time>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FolderSheet;
