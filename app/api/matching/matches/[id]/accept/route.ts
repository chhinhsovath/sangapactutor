import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { matches } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// POST /api/matching/matches/[id]/accept - Accept a match
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

    const { userId, role } = body; // role: 'tutor' or 'mentee'

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

    if (match.status !== 'pending') {
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

    // Update acceptance
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (role === 'tutor') {
      updateData.acceptedByTutor = true;
    } else {
      updateData.acceptedByMentee = true;
    }

    // If both have accepted, activate the match
    if (
      (role === 'tutor' && match.acceptedByMentee) ||
      (role === 'mentee' && match.acceptedByTutor)
    ) {
      updateData.status = 'accepted';
      updateData.acceptedAt = new Date();
      updateData.startedAt = new Date();
    }

    const [updated] = await db
      .update(matches)
      .set(updateData)
      .where(eq(matches.id, matchId))
      .returning();

    return NextResponse.json({
      message: updated.status === 'accepted' ? 'Match accepted and activated!' : 'Match acceptance recorded. Waiting for other party.',
      match: updated,
    });
  } catch (error) {
    console.error('Error accepting match:', error);
    return NextResponse.json(
      {
        error: 'Failed to accept match',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
