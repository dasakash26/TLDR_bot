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
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={<MessageSquare className="w-4 h-4" />}
        label="Threads"
        value={threadsCount}
      />
      <StatCard
        icon={<FileText className="w-4 h-4" />}
        label="Files"
        value={filesCount}
      />
      <StatCard
        icon={<Users className="w-4 h-4" />}
        label="Collaborators"
        value={collaboratorsCount}
      />
      <div className="p-4 rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Calendar className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">
            Created
          </span>
        </div>
        <p className="text-sm font-medium mt-2">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
