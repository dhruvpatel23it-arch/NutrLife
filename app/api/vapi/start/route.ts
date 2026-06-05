import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { assistantId } = await req.json();

    if (!assistantId) {
      return NextResponse.json(
        { error: 'Assistant ID is required' },
        { status: 400 }
      );
    }

    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    
    if (!publicKey) {
      return NextResponse.json(
        { error: 'Vapi public key not configured' },
        { status: 500 }
      );
    }

    // Return the assistant details and public key for client-side Vapi initialization
    return NextResponse.json({
      success: true,
      assistantId,
      publicKey,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Vapi endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
