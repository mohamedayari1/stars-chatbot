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
      const botResponse = await mockApi(userInput);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        parts: [{ type: "text", text: botResponse }],
      };

      // Add bot message to the updated messages
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting bot response:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Mock API function
  const mockApi = (input: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("This is a mock response to: " + input);
      }, 1000);
    });
  };

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
