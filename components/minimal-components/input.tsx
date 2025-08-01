"use client";

import cx from "classnames";
import { useState } from "react";
import { ArrowUpIcon } from "../icons";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ChatMessage } from "@/lib/types";
import SuggestedActions from "./suggested-actions";

interface ChatInputProps {
  onSend: (input: string) => void;
  messages: ChatMessage[];
}

export default function ChatInput({ onSend, messages }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        onSend(input.trim());
        setInput("");
      }
    }
  };

  return (
    <form onSubmit={handleSend} className="relative w-full flex flex-col gap-4">
      {messages.length === 0 && <SuggestedActions />}
      <Textarea
        className={cx(
          "min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10"
        )}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
      />

      <SendButton disabled={!input.trim()} />
    </form>
  );
}

function SendButton({ disabled }: { disabled?: boolean }) {
  return (
    <div className="absolute bottom-0 right-0 p-2">
      <Button
        type="submit"
        disabled={disabled}
        className="rounded-full p-1.5 h-fit border"
      >
        <ArrowUpIcon size={16} />
      </Button>
    </div>
  );
}
