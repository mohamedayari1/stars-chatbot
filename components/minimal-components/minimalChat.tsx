"use client";

import { DEMO_MESSAGES } from "@/app/(chat)/hardcodedConversation";
import { ChatMessage } from "@/lib/types";
import { useState } from "react";
import ChatHeader from "./chat-header";
import ChatInput from "./input";
import Conversation from "./messages";

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessageHandler(userInput: string) {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      parts: [{ type: "text", text: userInput }],
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: `chat-${Date.now()}`,
          message: userMessage,
          selectedChatModel: 'gemini-pro',
          selectedVisibilityType: 'public',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.messages && data.messages.length > 0) {
        // Add bot message to the updated messages
        setMessages((prev) => [...prev, data.messages[0]]);
      } else {
        throw new Error('No response from API');
      }
    } catch (error) {
      console.error("Error getting bot response:", error);
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        parts: [{ type: "text", text: "Sorry, I encountered an error. Please try again." }],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <Conversation messages={messages} isLoading={isLoading} />
      <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <ChatInput onSend={sendMessageHandler} messages={messages} />
      </div>
    </div>
  );
}
