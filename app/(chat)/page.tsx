// import { Chat } from '@/components/chat';
import { Chat } from '@/components/minimal-components/minimalChat';
import { generateUUID } from '@/lib/utils';

export default async function Page() {
  const id = generateUUID();

  return (
    <>
      {/* <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={DEFAULT_CHAT_MODEL}
        initialVisibilityType="private"
        isReadonly={false}
        autoResume={false}
      /> */}
    <Chat />;

    </>
  );
}
