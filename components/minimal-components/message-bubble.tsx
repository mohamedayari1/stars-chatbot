import { ChatMessage } from "@/lib/types";
import { cx } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { SparklesIcon } from "../icons";

interface MessageBubbleProps {
  message: ChatMessage;
  isLoading?: boolean;
  onEdit?: (messageId: string, newText: string) => void;
}

export default function MessageBubble({
  message,
  isLoading = false,
  onEdit,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const textContent = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ");

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={`flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl ${
            isUser ? "ml-auto max-w-2xl" : "w-full"
          }`}
        >
          {isAssistant && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          {/* Message bubble */}

          <div
            data-testid="message-content"
            className={`flex flex-col gap-4 ${
              isUser
                ? "bg-primary text-primary-foreground px-3 py-2 rounded-xl"
                : "bg-muted px-3 py-2 rounded-xl"
            }`}
          >
            <div className="whitespace-pre-wrap">{textContent}</div>
          </div>

          {/* Loading indicator */}
          {/* {isLoading && message.role === "assistant" && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="animate-spin">⏳</div>
          <span>Thinking...</span>
          </div>
          )} */}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          }
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
