import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="h-screen w-full overflow-hidden">
      <ChatSidebar />
      <SidebarInset className="h-full overflow-hidden flex flex-col">
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
