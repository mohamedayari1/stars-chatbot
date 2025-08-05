'use client';

import { ChatHeader } from '@/components/chat-header';
import type { ChatMessage } from '@/lib/types';
import { useState } from 'react';
// import { useDataStream } from './data-stream-provider';
import { DEMO_MESSAGES } from '@/app/(chat)/hardcodedConversation';

// export function Chat({
//   id,
//   initialMessages,
//   initialChatModel,
//   initialVisibilityType,
//   isReadonly,
//   autoResume,
// }: {
//   id: string;
//   initialMessages: ChatMessage[];
//   initialChatModel: string;
//   initialVisibilityType: VisibilityType;
//   isReadonly: boolean;
//   autoResume: boolean;
// }) {
//   const { visibilityType } = useChatVisibility({
//     chatId: id,
//     initialVisibilityType,
//   });

//   const { mutate } = useSWRConfig();
//   // const { setDataStream } = useDataStream();

//   const [input, setInput] = useState<string>('');

//   const {
//     messages,
//     setMessages,
//     sendMessage,
//     status,
//     stop,
//     regenerate,
//     resumeStream,
//   } = useChat<ChatMessage>({
//     id,
//     messages: initialMessages,
//     experimental_throttle: 100,
//     generateId: generateUUID,
//     transport: new DefaultChatTransport({
//       api: '/api/gemini',
//       fetch: fetchWithErrorHandlers,
//       prepareSendMessagesRequest({ messages, id, body }) {
//         return {
//           body: {
//             id,
//             message: messages.at(-1),
//             selectedChatModel: initialChatModel,
//             selectedVisibilityType: visibilityType,
//             ...body,
//           },
//         };
//       },
//     }),
//     onData: (dataPart) => {
//       setDataStream((ds) => (ds ? [...ds, dataPart] : []));
//     },
//     onFinish: () => {
//       mutate(unstable_serialize(getChatHistoryPaginationKey));
//     },
//     onError: (error) => {
//       if (error instanceof ChatSDKError) {
//         toast({
//           type: 'error',
//           description: error.message,
//         });
//       }
//     },
//   });

//   const searchParams = useSearchParams();
//   const query = searchParams.get('query');

//   const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

//   useEffect(() => {
//     if (query && !hasAppendedQuery) {
//       sendMessage({
//         role: 'user' as const,
//         parts: [{ type: 'text', text: query }],
//       });

//       setHasAppendedQuery(true);
//       window.history.replaceState({}, '', `/chat/${id}`);
//     }
//   }, [query, sendMessage, hasAppendedQuery, id]);

//   const { data: votes } = useSWR<Array<Vote>>(
//     messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
//     fetcher,
//   );

//   const [attachments, setAttachments] = useState<Array<Attachment>>([]);
//   const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

//   useAutoResume({
//     autoResume,
//     initialMessages,
//     resumeStream,
//     setMessages,
//   });


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
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        {/* <ChatHeader
          chatId={id}
          selectedModelId={initialChatModel}
          selectedVisibilityType={initialVisibilityType}
          isReadonly={isReadonly}
        /> */}
        <ChatHeader 
          chatId="demo"
          selectedModelId="gemini-pro"
          selectedVisibilityType="private"
          isReadonly={false}
        />


        {/* <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          regenerate={regenerate}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              sendMessage={sendMessage}
              selectedVisibilityType={visibilityType}
            />
          )}
        </form> */}
      </div>

      {/* <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        sendMessage={sendMessage}
        messages={messages}
        setMessages={setMessages}
        regenerate={regenerate}
        votes={votes}
        isReadonly={isReadonly}
        selectedVisibilityType={visibilityType}
      /> */}
    </>
  );
}
