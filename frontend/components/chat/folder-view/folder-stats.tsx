"use client";

import { MessageSquare, FileText, Users, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface FolderStatsProps {
  threadsCount: number;
  filesCount: number;
  collaboratorsCount: number;
  createdAt: string;
}

export function FolderStats({
  threadsCount,
  filesCount,
  collaboratorsCount,
  createdAt,
}: FolderStatsProps) {
  const stats = [
    {
      icon: MessageSquare,
      label: "Threads",
      value: threadsCount,
    },
    {
      icon: FileText,
      label: "Files",
      value: filesCount,
    },
    {
      icon: Users,
      label: "Collaborators",
      value: collaboratorsCount,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center p-3 rounded-lg border bg-card hover:bg-accent transition-colors group"
            >
              <Icon className="w-4 h-4 text-muted-foreground mb-1.5 group-hover:text-foreground transition-colors" />
              <p className="text-xl font-semibold mb-0.5">{stat.value}</p>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Created Date */}
      <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-muted/50 text-muted-foreground border">
        <Calendar className="w-3.5 h-3.5" />
        <span className="text-xs">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
