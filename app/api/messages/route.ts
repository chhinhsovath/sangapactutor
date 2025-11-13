import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { eq, or, and } from 'drizzle-orm';

// GET messages for a conversation
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const conversationWith = searchParams.get('with');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    let conditions;

    if (conversationWith) {
      // Get conversation between two users
      conditions = or(
        and(
          eq(messages.senderId, parseInt(userId)),
          eq(messages.receiverId, parseInt(conversationWith))
        ),
        and(
          eq(messages.senderId, parseInt(conversationWith)),
          eq(messages.receiverId, parseInt(userId))
        )
      );
    } else {
      // Get all messages for user
      conditions = or(
        eq(messages.senderId, parseInt(userId)),
        eq(messages.receiverId, parseInt(userId))
      );
    }

    const allMessages = await db.query.messages.findMany({
      where: conditions,
      with: {
        sender: true,
        receiver: true,
      },
      orderBy: (messages, { asc }) => [asc(messages.createdAt)],
    });

    return NextResponse.json(allMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// SEND new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, receiverId, message } = body;

    if (!senderId || !receiverId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMessage = await db.insert(messages).values({
      senderId,
      receiverId,
      message,
      isRead: false,
    }).returning();

    return NextResponse.json(newMessage[0], { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
