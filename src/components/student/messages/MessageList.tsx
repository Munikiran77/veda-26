"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "@/types";

interface MessageListProps {
  messages: Message[];
  viewerRole?: "student" | "client";
}

export function MessageList({ messages, viewerRole = "student" }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-6 sm:px-6">
      {messages.map((msg, i) => (
        <MessageBubble key={msg.id} message={msg} index={i} viewerRole={viewerRole} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
