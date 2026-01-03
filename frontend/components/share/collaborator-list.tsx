"use client";

import { Trash2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderCollaborator } from "@/types";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CollaboratorListProps {
  collaborators: FolderCollaborator[];
  currentUserId: string;
  onRemoveCollaborator: (userEmail: string) => void;
  isRemoving?: boolean;
}

export function CollaboratorList({
  collaborators,
  currentUserId,
  onRemoveCollaborator,
  isRemoving = false,
}: CollaboratorListProps) {
  const isCurrentUserOwner = collaborators.some(
    (c) => c.id === currentUserId && c.isOwner
  );

  if (collaborators.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground py-4">
        No collaborators yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {collaborators.map((collaborator) => {
        const isCurrentUser = collaborator.id === currentUserId;
        const canRemove = isCurrentUserOwner && !collaborator.isOwner;

        return (
          <div
            key={collaborator.id}
            className={cn(
              "flex items-center justify-between rounded-lg border p-3",
              "transition-colors hover:bg-accent/50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                {collaborator.name?.[0]?.toUpperCase() ||
                  collaborator.email[0].toUpperCase()}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {collaborator.name || "Unknown"}
                  </span>
                  {isCurrentUser && (
                    <Badge variant="secondary" className="text-xs">
                      You
                    </Badge>
                  )}
                  {collaborator.isOwner && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {collaborator.email}
                </span>
              </div>
            </div>

            {canRemove && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isRemoving}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove collaborator?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {collaborator.name || collaborator.email} will no longer
                      have access to this folder and its contents.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onRemoveCollaborator(collaborator.email)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        );
      })}
    </div>
  );
}
