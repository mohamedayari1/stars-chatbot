"use client";

import type { ChatMessage } from "@/lib/types";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Greeting from "./Greeting";
import MessageBubble, { ThinkingMessage } from "./message-bubble";

interface ConversationProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onEdit?: (messageId: string, newText: string) => void;
  className?: string;
}

export default function Conversation({
  messages = [], // Add default value here
  isLoading = false,
  onEdit,
  className = "",
}: ConversationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]); // Use messages.length instead of isLoading

  return (
    <div
      ref={containerRef}
      className={`flex flex-col min-w-0 gap-6 flex-1 overflow-y-auto pt-4 relative ${className}`}
    >
      {messages.length === 0 && <Greeting />}

      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MessageBubble
            message={message}
            isLoading={isLoading && index === messages.length - 1}
            onEdit={onEdit}
          />
        </motion.div>
      ))}

      {/* {isLoading && messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mx-auto max-w-3xl px-4"
        >
          <div className="flex gap-4">
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="animate-spin">⏳</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-48"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-40"></div>
            </div>
          </div>
        </motion.div>
      )} */}

      {messages.length > 0 && messages[messages.length - 1].role === "user" && (
        <ThinkingMessage />
      )}

      {/* Invisible element for auto-scroll */}
      <div ref={endRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
    </div>
  );
}
