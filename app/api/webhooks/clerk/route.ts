import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Clerk webhook event types we care about
interface EmailAddress {
  email_address: string;
  id: string;
}

interface ClerkUserCreatedEvent {
  type: 'user.created';
  data: {
    id: string;
    email_addresses: EmailAddress[];
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
    created_at: number;
  };
}

type ClerkWebhookEvent = ClerkUserCreatedEvent | { type: string; data: unknown };

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set in environment variables.');
    return NextResponse.json(
      { error: 'Server misconfiguration: webhook secret missing.' },
      { status: 500 }
    );
  }

  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers.' },
      { status: 400 }
    );
  }

  // Get the raw body
  const body = await req.text();

  // Verify the webhook signature using Svix
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: ClerkWebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid webhook signature.' },
      { status: 400 }
    );
  }

  // Handle the user.created event
  if (evt.type === 'user.created') {
    const { id: clerkUserId, email_addresses, primary_email_address_id, first_name, last_name } =
      (evt as ClerkUserCreatedEvent).data;

    // Find the primary email address
    const primaryEmail = email_addresses.find(
      (email) => email.id === primary_email_address_id
    )?.email_address;

    if (!primaryEmail) {
      console.error('No primary email found for user:', clerkUserId);
      return NextResponse.json(
        { error: 'No primary email found.' },
        { status: 400 }
      );
    }

    try {
      // Insert the new user into the Neon users table
      // Uses ON CONFLICT to avoid duplicate inserts if the webhook fires more than once
      await query(
        `INSERT INTO users (clerk_id, email, first_name, last_name, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         ON CONFLICT (clerk_id) DO NOTHING`,
        [clerkUserId, primaryEmail, first_name ?? null, last_name ?? null]
      );

      console.log(`✅ New user saved to Neon DB: ${primaryEmail} (${clerkUserId})`);

      return NextResponse.json(
        { message: 'User created successfully in database.' },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Failed to insert user into Neon database:', dbError);
      return NextResponse.json(
        { error: 'Database error while saving user.' },
        { status: 500 }
      );
    }
  }

  // Acknowledge other event types without action
  return NextResponse.json({ message: 'Event received.' }, { status: 200 });
}
