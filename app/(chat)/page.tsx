// import { cookies } from 'next/headers';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
// import { DataStreamHandler } from '@/components/data-stream-handler';
// import { auth } from '../(auth)/auth';
// import { redirect } from 'next/navigation';

export default async function Page() {
  // const session = await auth();
  // if (!session) {
  //   redirect('/api/auth/guest');
  // }
  const session = null; // Mock session

  const id = generateUUID();

  // const cookieStore = await cookies();
  // const modelIdFromCookie = cookieStore.get('chat-model');
  const modelIdFromCookie = null; // Mock modelId

  // Always render with defaults for UI testing
  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={DEFAULT_CHAT_MODEL}
        initialVisibilityType="private"
        isReadonly={false}
        // session={session}
        autoResume={false}
      />
      {/* <DataStreamHandler /> */}
    </>
  );
}
