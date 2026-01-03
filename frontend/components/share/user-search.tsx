"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserSearchResult } from "@/types";
import { useSearchUsers } from "@/hooks/use-folder-sharing";
import { cn } from "@/lib/utils";

interface UserSearchProps {
  onSelectUser: (user: UserSearchResult) => void;
  excludeUserIds?: string[];
  placeholder?: string;
}

export function UserSearch({
  onSelectUser,
  excludeUserIds = [],
  placeholder = "Search users by name or email...",
}: UserSearchProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data: users = [], isLoading } = useSearchUsers(debouncedQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const filteredUsers = users.filter(
    (user) => !excludeUserIds.includes(user.id)
  );

  const handleSelectUser = (user: UserSearchResult) => {
    onSelectUser(user);
    setQuery("");
    setDebouncedQuery("");
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {query.length >= 2 && filteredUsers.length > 0 && (
        <div className="rounded-md border bg-popover p-1 shadow-md">
          <div className="max-h-[200px] overflow-y-auto">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:bg-accent focus:text-accent-foreground focus:outline-none"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{user.name || "Unknown"}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {query.length >= 2 && !isLoading && filteredUsers.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-2">
          No users found
        </p>
      )}
    </div>
  );
}
