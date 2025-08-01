import { cookies } from 'next/headers';

import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
// import { getChatById, getMessagesByChatId } from '@/lib/db/queries';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  // Comment out database logic for testing
  // const chat = await getChatById({ id });
  // if (!chat) {
  //   notFound();
  // }
  
  // Hardcode chat data for testing
  const chat = {
    id: id,
    visibility: 'private' as const,
    title: 'Test Chat',
    userId: 'test-user-id',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Comment out database logic for testing
  // const messagesFromDb = await getMessagesByChatId({
  //   id,
  // });
  // const uiMessages = convertToUIMessages(messagesFromDb);
  
  // Hardcode empty messages for testing
  const uiMessages: any[] = [];

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get('chat-model');

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={uiMessages}
        initialChatModel={chatModelFromCookie?.value || DEFAULT_CHAT_MODEL}
        initialVisibilityType={chat.visibility}
        isReadonly={false}
        autoResume={true}
      />
      <DataStreamHandler />
    </>
  );
}
