import { auth } from '@/app/(auth)/auth';
import { ChatSDKError } from '@/lib/errors';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError('unauthorized:chat').toResponse();
    }

    // Basic response for POST endpoint
    return Response.json({ 
      message: 'Chat endpoint is available',
      status: 'success'
    }, { status: 200 });

  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    
    return Response.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError('unauthorized:chat').toResponse();
    }

    // Basic response for DELETE endpoint
    return Response.json({ 
      message: 'Delete endpoint is available',
      status: 'success'
    }, { status: 200 });

  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    
    return Response.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
