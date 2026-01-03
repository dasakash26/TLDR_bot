"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Folder } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateFolder, useCreateThread } from "@/hooks/use-chat";
import type { Folder as FolderType } from "@/types";
import { useSidebarState } from "@/hooks/use-sidebar-state";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders?: FolderType[];
}

export function NewChatDialog({
  open,
  onOpenChange,
  folders,
}: NewChatDialogProps) {
  const [newChatName, setNewChatName] = useState("New Chat");
  const [chatFolderOption, setChatFolderOption] = useState<"new" | "existing">(
    "existing"
  );
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [newChatFolderName, setNewChatFolderName] = useState("");
  const router = useRouter();
  const { setExpandedFolder } = useSidebarState();
  const { mutate: createFolder, isPending: isCreatingFolder } =
    useCreateFolder();
  const { mutate: createThread, isPending: isCreatingThread } =
    useCreateThread();

  const handleCreateChat = () => {
    if (chatFolderOption === "existing") {
      if (!selectedFolderId) return;
      createThread(
        { folder_id: selectedFolderId, thread_name: newChatName },
        {
          onSuccess: (data) => {
            onOpenChange(false);
            setNewChatName("New Chat");
            setSelectedFolderId("");
            router.push(`/chat?threadId=${data.id}`);
            setExpandedFolder(selectedFolderId);
          },
        }
      );
    } else {
      if (!newChatFolderName.trim()) return;
      createFolder(newChatFolderName, {
        onSuccess: (folderData) => {
          createThread(
            { folder_id: folderData.id, thread_name: newChatName },
            {
              onSuccess: (threadData) => {
                onOpenChange(false);
                setNewChatName("New Chat");
                setNewChatFolderName("");
                setChatFolderOption("existing");
                router.push(`/chat?threadId=${threadData.id}`);
                setExpandedFolder(folderData.id);
              },
            }
          );
        },
      });
    }
  };

  //enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && open) {
        e.preventDefault();
        handleCreateChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleCreateChat]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
          <DialogDescription>
            Choose a folder for your new chat or create a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="chat-name">Chat Name</Label>
            <Input
              id="chat-name"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              placeholder="New Chat"
            />
          </div>

          <div className="grid gap-4">
            <Label>Folder Location</Label>
            <RadioGroup
              value={chatFolderOption}
              onValueChange={(value) =>
                setChatFolderOption(value as "new" | "existing")
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="existing" />
                <Label
                  htmlFor="existing"
                  className="font-normal cursor-pointer"
                >
                  Select existing folder
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="font-normal cursor-pointer">
                  Create new folder
                </Label>
              </div>
            </RadioGroup>

            {chatFolderOption === "existing" ? (
              <div className="grid gap-2">
                <Label htmlFor="folder-select">Select Folder</Label>
                <ScrollArea className="h-48 rounded-md border p-2">
                  <RadioGroup
                    value={selectedFolderId}
                    onValueChange={setSelectedFolderId}
                  >
                    {folders?.map((folder) => (
                      <div
                        key={folder.id}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                      >
                        <RadioGroupItem
                          value={folder.id}
                          id={`folder-${folder.id}`}
                        />
                        <Label
                          htmlFor={`folder-${folder.id}`}
                          className="flex items-center gap-2 font-normal cursor-pointer flex-1"
                        >
                          <Folder className="h-4 w-4" />
                          {folder.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </ScrollArea>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="new-folder-name">New Folder Name</Label>
                <Input
                  id="new-folder-name"
                  value={newChatFolderName}
                  onChange={(e) => setNewChatFolderName(e.target.value)}
                  placeholder="Project Name"
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateChat}
            disabled={
              isCreatingThread ||
              isCreatingFolder ||
              (chatFolderOption === "existing" && !selectedFolderId) ||
              (chatFolderOption === "new" && !newChatFolderName.trim())
            }
          >
            {(isCreatingThread || isCreatingFolder) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
