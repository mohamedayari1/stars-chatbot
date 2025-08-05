import { cookies } from 'next/headers';

// import { DataStreamHandler } from '@/components/data-stream-handler';
import { Chat } from '@/components/minimal-components/minimalChat';
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
      <Chat />
      {/* <DataStreamHandler /> */}
    </>
  );
}
