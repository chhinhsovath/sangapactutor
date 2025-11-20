import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { eq, or, and, asc } from 'drizzle-orm';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const userIdStr = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('currentUserId');
        if (!userIdStr) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const currentUserId = parseInt(userIdStr);

        const { userId: otherUserIdStr } = await params;
        const otherUserId = parseInt(otherUserIdStr);

        const chatMessages = await db.query.messages.findMany({
            where: or(
                and(
                    eq(messages.senderId, currentUserId),
                    eq(messages.receiverId, otherUserId)
                ),
                and(
                    eq(messages.senderId, otherUserId),
                    eq(messages.receiverId, currentUserId)
                )
            ),
            orderBy: [asc(messages.createdAt)],
            with: {
                sender: true,
                receiver: true,
            },
        });

        return NextResponse.json({ data: chatMessages });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
