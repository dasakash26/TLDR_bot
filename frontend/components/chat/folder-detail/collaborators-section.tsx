"use client";

import { Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderCollaborator } from "@/types";

interface CollaboratorsSectionProps {
  collaborators: FolderCollaborator[];
  isLoading: boolean;
  currentUserId?: string;
  onShareClick: () => void;
}

export function CollaboratorsSection({
  collaborators,
  isLoading,
  currentUserId,
  onShareClick,
}: CollaboratorsSectionProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Collaborators
        </h2>
        <Button variant="outline" size="sm" onClick={onShareClick}>
          <Users className="w-4 h-4 mr-2" />
          Share Folder
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : collaborators.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {collaborators.map((collaborator) => (
            <CollaboratorCard
              key={collaborator.id}
              collaborator={collaborator}
              isCurrentUser={collaborator.id === currentUserId}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No collaborators yet. Share this folder to collaborate." />
      )}
    </section>
  );
}

interface CollaboratorCardProps {
  collaborator: FolderCollaborator;
  isCurrentUser: boolean;
}

function CollaboratorCard({
  collaborator,
  isCurrentUser,
}: CollaboratorCardProps) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
          {collaborator.name?.[0]?.toUpperCase() ||
            collaborator.email[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm truncate">
              {collaborator.name || "Unknown"}
            </h3>
            {collaborator.isOwner && (
              <Crown className="w-3 h-3 text-yellow-500 shrink-0" />
            )}
            {isCurrentUser && (
              <span className="text-xs text-muted-foreground">(You)</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {collaborator.email}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-8 rounded-lg border border-dashed border-border text-center text-muted-foreground">
      {message}
    </div>
  );
}
