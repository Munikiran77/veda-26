"use client";

import { motion } from "framer-motion";
import { Paperclip, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  index: number;
  viewerRole?: "student" | "client";
}

export function MessageBubble({ message, index, viewerRole = "student" }: MessageBubbleProps) {
  const isClientViewer = viewerRole === "client";
  const isSelf =
    typeof message.isSelf === "boolean"
      ? message.isSelf
      : isClientViewer
      ? message.sender === "client"
      : message.sender === "student";

  const otherAvatarInitial = isClientViewer ? "S" : "C";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={cn("flex w-full gap-2", isSelf ? "justify-end" : "justify-start")}
    >
      {/* Other party avatar */}
      {!isSelf && (
        <div className="flex-shrink-0 self-end mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
            {otherAvatarInitial}
          </div>
        </div>
      )}

      <div className={cn("flex max-w-[75%] flex-col gap-1", isSelf ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isSelf
              ? "rounded-br-sm bg-blue-600 text-white"
              : "rounded-bl-sm bg-[var(--color-canvas-surface)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]"
          )}
        >
          {message.content}

          {/* Attachment */}
          {message.attachment && (
            message.attachment.url ? (
              <a
                href={message.attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium hover:underline transition-opacity hover:opacity-90",
                  isSelf
                    ? "bg-blue-700 text-blue-100"
                    : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-text-primary)]"
                )}
              >
                <Paperclip size={12} />
                <span>{message.attachment.name}</span>
                {message.attachment.size && (
                  <span className="opacity-70">· {message.attachment.size}</span>
                )}
              </a>
            ) : (
              <div
                className={cn(
                  "mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium",
                  isSelf
                    ? "bg-blue-700 text-blue-100"
                    : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-text-primary)]"
                )}
              >
                <Paperclip size={12} />
                <span>{message.attachment.name}</span>
                {message.attachment.size && (
                  <span className="opacity-70">· {message.attachment.size}</span>
                )}
              </div>
            )
          )}
        </div>

        {/* Timestamp + status */}
        <div className={cn("flex items-center gap-1 text-[11px] text-[var(--color-text-secondary)]", isSelf ? "flex-row-reverse" : "flex-row")}>
          <span>{message.timestamp}</span>
          {isSelf && message.status === "read" && (
            <CheckCheck size={12} className="text-blue-500" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
