
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface MessageThreadProps {
  messages: Message[];
}

export const MessageThread = ({ messages }: MessageThreadProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-center">
            No notes yet. Start the conversation!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col max-w-[80%] space-y-1",
                message.isCurrentUser ? "ml-auto" : "mr-auto"
              )}
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{message.sender}</span>
                <span className="text-muted-foreground text-xs">
                  {message.timestamp}
                </span>
              </div>
              <div
                className={cn(
                  "rounded-lg p-3",
                  message.isCurrentUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};
