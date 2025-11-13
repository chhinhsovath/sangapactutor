import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { matches, users, institutions, subjects, matchingPreferences } from '@/lib/db/schema';
import { eq, and, or, ne, desc, sql } from 'drizzle-orm';

// GET /api/matching/matches - Get matches for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const role = searchParams.get('role'); // 'tutor' or 'mentee'
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const userIdInt = parseInt(userId);

    // Build filter conditions
    const conditions = [];
    if (role === 'tutor') {
      conditions.push(eq(matches.tutorUserId, userIdInt));
    } else if (role === 'mentee') {
      conditions.push(eq(matches.menteeUserId, userIdInt));
    } else {
      conditions.push(
        or(eq(matches.tutorUserId, userIdInt), eq(matches.menteeUserId, userIdInt))
      );
    }

    if (status) {
      conditions.push(eq(matches.status, status as any));
    }

    // Build and execute query
    const query = db
      .select({
        id: matches.id,
        tutorUserId: matches.tutorUserId,
        menteeUserId: matches.menteeUserId,
        tutorInstitutionId: matches.tutorInstitutionId,
        menteeInstitutionId: matches.menteeInstitutionId,
        subjectId: matches.subjectId,
        matchScore: matches.matchScore,
        status: matches.status,
        proposedBy: matches.proposedBy,
        requestedSubjects: matches.requestedSubjects,
        matchReason: matches.matchReason,
        acceptedByTutor: matches.acceptedByTutor,
        acceptedByMentee: matches.acceptedByMentee,
        acceptedAt: matches.acceptedAt,
        rejectionReason: matches.rejectionReason,
        startedAt: matches.startedAt,
        completedAt: matches.completedAt,
        totalSessions: matches.totalSessions,
        impactScore: matches.impactScore,
        createdAt: matches.createdAt,
        updatedAt: matches.updatedAt,
        subject: {
          name: subjects.name,
          slug: subjects.slug,
        },
      })
      .from(matches)
      .leftJoin(subjects, eq(matches.subjectId, subjects.id))
      .$dynamic();

    const results = await query
      .where(and(...conditions))
      .orderBy(desc(matches.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch matches',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/matching/matches - Create a match or run matching algorithm
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, tutorUserId, menteeUserId, subjectId, requestedSubjects } = body;

    // Mode 1: Manual match creation
    if (mode === 'manual') {
      if (!tutorUserId || !menteeUserId || !subjectId) {
        return NextResponse.json(
          { error: 'tutorUserId, menteeUserId, and subjectId are required for manual match' },
          { status: 400 }
        );
      }

      // Get both users
      const [tutor] = await db
        .select()
        .from(users)
        .where(eq(users.id, tutorUserId))
        .limit(1);

      const [mentee] = await db
        .select()
        .from(users)
        .where(eq(users.id, menteeUserId))
        .limit(1);

      if (!tutor || !mentee) {
        return NextResponse.json({ error: 'Tutor or mentee not found' }, { status: 404 });
      }

      if (!tutor.institutionId || !mentee.institutionId) {
        return NextResponse.json(
          { error: 'Both users must be enrolled in institutions' },
          { status: 400 }
        );
      }

      // Check if match already exists
      const [existing] = await db
        .select()
        .from(matches)
        .where(
          and(
            eq(matches.tutorUserId, tutorUserId),
            eq(matches.menteeUserId, menteeUserId),
            eq(matches.subjectId, subjectId),
            ne(matches.status, 'rejected')
          )
        )
        .limit(1);

      if (existing) {
        return NextResponse.json(
          { error: 'Match already exists for these users and subject' },
          { status: 409 }
        );
      }

      // Create match
      const [match] = await db
        .insert(matches)
        .values({
          tutorUserId,
          menteeUserId,
          tutorInstitutionId: tutor.institutionId,
          menteeInstitutionId: mentee.institutionId,
          subjectId,
          proposedBy: 'manual',
          requestedSubjects: requestedSubjects ? JSON.stringify(requestedSubjects) : null,
          matchReason: 'Manually created match by coordinator',
          status: 'pending',
        })
        .returning();

      return NextResponse.json(match, { status: 201 });
    }

    // Mode 2: Run matching algorithm for a mentee
    if (mode === 'algorithm') {
      if (!menteeUserId) {
        return NextResponse.json(
          { error: 'menteeUserId is required for algorithm mode' },
          { status: 400 }
        );
      }

      // Get mentee details
      const [mentee] = await db
        .select()
        .from(users)
        .where(eq(users.id, menteeUserId))
        .limit(1);

      if (!mentee || !mentee.institutionId) {
        return NextResponse.json(
          { error: 'Mentee not found or not enrolled in institution' },
          { status: 404 }
        );
      }

      // Find potential tutors
      // Criteria:
      // 1. Enrolled in same or different institution (if cross-institution allowed)
      // 2. Has active matching preferences
      // 3. Subjects match
      // 4. Prefers remote students (social impact)
      // 5. Not already matched

      const potentialTutors = await db
        .select({
          user: users,
          preferences: matchingPreferences,
        })
        .from(users)
        .leftJoin(matchingPreferences, eq(users.id, matchingPreferences.userId))
        .where(
          and(
            ne(users.id, menteeUserId),
            eq(matchingPreferences.isActive, true),
            eq(matchingPreferences.preferRemoteStudents, true)
          )
        )
        .limit(10);

      // Calculate match scores
      const scoredMatches = potentialTutors.map((tutor) => {
        let score = 0;

        // Cross-institution match (higher impact)
        if (tutor.user.institutionId !== mentee.institutionId) {
          score += 30;
        }

        // Same academic year
        if (tutor.user.academicYear === mentee.academicYear) {
          score += 10;
        }

        // Subject match (from requested subjects)
        if (requestedSubjects && tutor.preferences?.preferredSubjects) {
          const tutorSubjects = JSON.parse(tutor.preferences.preferredSubjects);
          const matchingSubjects = requestedSubjects.filter((s: number) =>
            tutorSubjects.includes(s)
          );
          score += matchingSubjects.length * 20;
        }

        // Online availability
        if (tutor.preferences?.onlineOnly) {
          score += 5;
        }

        return {
          tutorUser: tutor.user,
          score,
        };
      });

      // Sort by score and take top match
      scoredMatches.sort((a, b) => b.score - a.score);

      if (scoredMatches.length === 0) {
        return NextResponse.json({
          message: 'No suitable tutors found',
          matches: [],
        });
      }

      const topMatch = scoredMatches[0];

      // Create match if score is above threshold
      if (topMatch.score >= 30) {
        const [newMatch] = await db
          .insert(matches)
          .values({
            tutorUserId: topMatch.tutorUser.id,
            menteeUserId,
            tutorInstitutionId: topMatch.tutorUser.institutionId!,
            menteeInstitutionId: mentee.institutionId,
            subjectId: subjectId || requestedSubjects[0],
            matchScore: topMatch.score.toString(),
            proposedBy: 'algorithm',
            requestedSubjects: requestedSubjects ? JSON.stringify(requestedSubjects) : null,
            matchReason: `Matched based on cross-institution impact (score: ${topMatch.score})`,
            status: 'pending',
          })
          .returning();

        return NextResponse.json({
          message: 'Match created successfully',
          match: newMatch,
          suggestedMatches: scoredMatches.slice(0, 5),
        });
      }

      return NextResponse.json({
        message: 'No high-confidence matches found',
        suggestedMatches: scoredMatches.slice(0, 5),
      });
    }

    return NextResponse.json(
      { error: 'Invalid mode. Use "manual" or "algorithm"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      {
        error: 'Failed to create match',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any).code,
        detail: (error as any).detail,
      },
      { status: 500 }
    );
  }
}
