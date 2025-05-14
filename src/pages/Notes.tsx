
import React, { useState } from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { MessageThread } from "@/components/notes/MessageThread";
import { MessageInput } from "@/components/notes/MessageInput";
import { UserRound } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface NotesProps {
  selectedClient?: string | null;
}

const Notes = ({ selectedClient }: NotesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "Current User",
      content,
      timestamp: new Date().toLocaleTimeString(),
      isCurrentUser: true,
    };
    setMessages((prev) => [newMessage, ...prev]);
  };

  return (
    <TherapyLayout>
      {!selectedClient ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 max-w-md">
            <UserRound className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No client selected</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Please select a client from the dropdown above to view their notes.
            </p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto p-4 md:p-6 flex flex-col h-[calc(100vh-4rem)]">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
            <p className="text-muted-foreground">
              Communicate with the care team
            </p>
          </div>
          
          <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-background">
            <MessageThread messages={messages} />
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      )}
    </TherapyLayout>
  );
};

export default Notes;
