import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  // 1. Get the currently logged-in user's Clerk ID
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2. Check if this user already exists in our Neon DB
  const existing = await query(
    "SELECT id FROM users WHERE clerk_id = $1",
    [clerkId]
  );

  if (existing.rows.length > 0) {
    // User already in DB — nothing to do
    return NextResponse.json({ message: "User already exists", user: existing.rows[0] }, { status: 200 });
  }

  // 3. New user — fetch their full info from Clerk
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(clerkId);

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  const firstName = clerkUser.firstName ?? null;
  const lastName = clerkUser.lastName ?? null;

  if (!email) {
    return NextResponse.json({ message: "No email found for user" }, { status: 400 });
  }

  // 4. Insert the new user into the Neon users table
  try {
    const result = await query(
      `INSERT INTO users (clerk_id, email, first_name, last_name, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (clerk_id) DO NOTHING
       RETURNING *`,
      [clerkId, email, firstName, lastName]
    );

    console.log(`✅ New user synced to Neon DB: ${email} (${clerkId})`);

    return NextResponse.json(
      { message: "User created successfully", user: result.rows[0] },
      { status: 201 }
    );
  } catch (dbError) {
    console.error("Failed to insert user into Neon database:", dbError);
    return NextResponse.json(
      { message: "Database error while saving user" },
      { status: 500 }
    );
  }
}
