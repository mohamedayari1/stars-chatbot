// Minimal message component for deployment - not used in minimal chat
import type { Vote } from '@/lib/db/schema';
import type { ChatMessage } from '@/lib/types';
import type { UseChatHelpers } from '@ai-sdk/react';

interface PreviewMessageProps {
  chatId: string;
  message: ChatMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>['setMessages'];
  regenerate: UseChatHelpers<ChatMessage>['regenerate'];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
}

export const PreviewMessage = (props: PreviewMessageProps) => null;
export const ThinkingMessage = () => null;
