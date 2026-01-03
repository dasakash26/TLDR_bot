"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { UserSearch } from "./user-search";
import { CollaboratorList } from "./collaborator-list";
import {
  useFolderCollaborators,
  useAddCollaborator,
  useRemoveCollaborator,
} from "@/hooks/use-folder-sharing";
import { useUser } from "@/hooks/use-user";
import { UserSearchResult } from "@/types";
import { toast } from "sonner";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
  folderName: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  folderId,
  folderName,
}: ShareDialogProps) {
  const { user } = useUser();
  const { data: collaborators = [], isLoading } =
    useFolderCollaborators(folderId);
  const addCollaborator = useAddCollaborator();
  const removeCollaborator = useRemoveCollaborator();

  const handleAddCollaborator = async (selectedUser: UserSearchResult) => {
    if (!folderId) return;

    // Check if user is already a collaborator
    if (collaborators.some((c) => c.email === selectedUser.email)) {
      toast.error("User is already a collaborator");
      return;
    }

    try {
      await addCollaborator.mutateAsync({
        folderId,
        userEmail: selectedUser.email,
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRemoveCollaborator = async (userEmail: string) => {
    if (!folderId) return;

    try {
      await removeCollaborator.mutateAsync({
        folderId,
        userEmail,
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const excludeUserIds = collaborators.map((c) => c.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Share "{folderName}"
          </DialogTitle>
          <DialogDescription>
            Add collaborators to give them access to this folder
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Add collaborators</h4>
            <UserSearch
              onSelectUser={handleAddCollaborator}
              excludeUserIds={excludeUserIds}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Collaborators ({collaborators.length})
            </h4>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <CollaboratorList
                collaborators={collaborators}
                currentUserId={user?.id || ""}
                onRemoveCollaborator={handleRemoveCollaborator}
                isRemoving={removeCollaborator.isPending}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
