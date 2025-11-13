import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, institutions, partnerships } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';

// POST /api/institutions/[id]/enroll - Enroll a student in institution
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institutionId = parseInt(id);
    const body = await request.json();

    if (isNaN(institutionId)) {
      return NextResponse.json({ error: 'Invalid institution ID' }, { status: 400 });
    }

    const { userId, studentId, academicYear } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Check if institution exists and is active
    const [institution] = await db
      .select()
      .from(institutions)
      .where(and(eq(institutions.id, institutionId), eq(institutions.isActive, true)))
      .limit(1);

    if (!institution) {
      return NextResponse.json(
        { error: 'Institution not found or inactive' },
        { status: 404 }
      );
    }

    // Check if user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is already enrolled in this institution
    if (user.institutionId === institutionId) {
      return NextResponse.json(
        { error: 'User is already enrolled in this institution' },
        { status: 409 }
      );
    }

    // Check partnership limits
    const [currentPartnership] = await db
      .select()
      .from(partnerships)
      .where(
        and(
          eq(partnerships.institutionId, institutionId),
          eq(partnerships.isActive, true)
        )
      )
      .orderBy(partnerships.startDate)
      .limit(1);

    if (currentPartnership) {
      const [enrolledCount] = await db
        .select({ count: count() })
        .from(users)
        .where(eq(users.institutionId, institutionId));

      if (
        currentPartnership.studentsLimit &&
        enrolledCount.count >= currentPartnership.studentsLimit
      ) {
        return NextResponse.json(
          {
            error: 'Institution has reached maximum student limit for current partnership tier',
            limit: currentPartnership.studentsLimit,
            current: enrolledCount.count,
          },
          { status: 403 }
        );
      }
    }

    // Enroll student
    const [enrolled] = await db
      .update(users)
      .set({
        institutionId,
        studentId: studentId || null,
        academicYear: academicYear || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json({
      message: 'Student enrolled successfully',
      user: enrolled,
    });
  } catch (error) {
    console.error('Error enrolling student:', error);
    return NextResponse.json(
      {
        error: 'Failed to enroll student',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/institutions/[id]/enroll - Get all enrolled students
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institutionId = parseInt(id);

    if (isNaN(institutionId)) {
      return NextResponse.json({ error: 'Invalid institution ID' }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build filter conditions
    const conditions = [eq(users.institutionId, institutionId)];

    if (role) {
      conditions.push(eq(users.role, role as any));
    }

    // Get enrolled students
    const enrolledStudents = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        avatar: users.avatar,
        role: users.role,
        studentId: users.studentId,
        creditBalance: users.creditBalance,
        academicYear: users.academicYear,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(enrolledStudents);
  } catch (error) {
    console.error('Error fetching enrolled students:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch enrolled students',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
