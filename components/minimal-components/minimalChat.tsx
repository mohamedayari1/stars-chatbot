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
  const [input, setInput] = useState("");

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

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let assistantMessage: ChatMessage | null = null;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove 'data: ' prefix
            
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.role === 'assistant') {
                if (!assistantMessage) {
                  // Create new assistant message
                  assistantMessage = {
                    id: parsed.id,
                    role: 'assistant',
                    parts: parsed.parts,
                    metadata: parsed.metadata
                  };
                  setMessages((prev) => [...prev, assistantMessage!]);
                } else {
                  // Update existing assistant message
                  assistantMessage.parts = parsed.parts;
                  assistantMessage.metadata = parsed.metadata;
                  setMessages((prev) => [...prev.slice(0, -1), assistantMessage!]);
                }
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }

    } catch (error) {
      console.error("Error getting bot response:", error);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessageHandler(input);
      setInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <Conversation 
        messages={messages} 
        isLoading={isLoading} 
      />
      <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <ChatInput 
          onSend={sendMessageHandler} 
          messages={messages}
        />
      </div>
    </div>
  );
}
