import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { matches } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// POST /api/matching/matches/[id]/reject - Reject a match
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const matchId = parseInt(id);
    const body = await request.json();

    if (isNaN(matchId)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    const { userId, role, rejectionReason } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'userId and role are required' },
        { status: 400 }
      );
    }

    // Get match
    const [match] = await db
      .select()
      .from(matches)
      .where(eq(matches.id, matchId))
      .limit(1);

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    if (match.status === 'rejected' || match.status === 'completed') {
      return NextResponse.json(
        { error: `Match is already ${match.status}` },
        { status: 400 }
      );
    }

    // Verify user is part of this match
    if (role === 'tutor' && match.tutorUserId !== userId) {
      return NextResponse.json(
        { error: 'User is not the tutor in this match' },
        { status: 403 }
      );
    }

    if (role === 'mentee' && match.menteeUserId !== userId) {
      return NextResponse.json(
        { error: 'User is not the mentee in this match' },
        { status: 403 }
      );
    }

    // Reject match
    const [rejected] = await db
      .update(matches)
      .set({
        status: 'rejected',
        rejectionReason: rejectionReason || `Rejected by ${role}`,
        updatedAt: new Date(),
      })
      .where(eq(matches.id, matchId))
      .returning();

    return NextResponse.json({
      message: 'Match rejected successfully',
      match: rejected,
    });
  } catch (error) {
    console.error('Error rejecting match:', error);
    return NextResponse.json(
      {
        error: 'Failed to reject match',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
