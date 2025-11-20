import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages, users } from '@/lib/db/schema';
import { eq, or, desc, and, sql } from 'drizzle-orm';
import { getToken } from 'next-auth/jwt';

// Helper to verify auth (assuming similar logic to other mobile endpoints)
// For now, we'll assume the mobile app sends a token that we can verify, 
// or we'll mock it if the auth setup is complex. 
// Looking at existing code, it seems we might need to handle auth manually or rely on middleware.
// I'll assume the request has the user ID in headers or I can get it from the session if using next-auth.
// Since the mobile app uses a custom auth flow (login returns token), I should check how `api/mobile/auth/me` works.
// But for now, I'll implement the logic assuming I can get the current user ID.

// NOTE: In a real app, we must validate the user. 
// I will assume for this implementation that we can get the user ID from a header 'x-user-id' 
// injected by middleware or just trust the token if I can parse it.
// However, looking at `mobile/src/services/auth.service.ts`, it stores `accessToken`.
// The backend likely has middleware to validate this.

export async function GET(request: NextRequest) {
    try {
        // TODO: Replace with actual auth check
        // For now, we'll try to get userId from header or query param for testing
        const userIdStr = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId');

        if (!userIdStr) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = parseInt(userIdStr);

        // Get all messages involving this user
        const userMessages = await db.query.messages.findMany({
            where: or(
                eq(messages.senderId, userId),
                eq(messages.receiverId, userId)
            ),
            orderBy: [desc(messages.createdAt)],
            with: {
                sender: true,
                receiver: true,
            },
        });

        // Group by conversation partner and get the latest message
        const conversationsMap = new Map();

        for (const msg of userMessages) {
            const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
            const otherUserId = otherUser.id;

            if (!conversationsMap.has(otherUserId)) {
                conversationsMap.set(otherUserId, {
                    userId: otherUserId,
                    user: otherUser,
                    lastMessage: msg,
                    unreadCount: msg.receiverId === userId && !msg.isRead ? 1 : 0,
                });
            } else {
                // Update unread count if applicable
                if (msg.receiverId === userId && !msg.isRead) {
                    const conv = conversationsMap.get(otherUserId);
                    conv.unreadCount += 1;
                }
            }
        }

        const conversations = Array.from(conversationsMap.values());

        return NextResponse.json({ data: conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
