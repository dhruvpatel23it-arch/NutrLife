import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, subject, message } = body;

    // Create table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50),
        subject VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert the data
    await query(
      `INSERT INTO user_preferences (type, subject, message) VALUES ($1, $2, $3)`,
      [type, subject, message]
    );

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error processing contact request:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
