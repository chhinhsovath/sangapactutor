import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// DELETE /api/institutions/[id]/enroll/[userId] - Unenroll a student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const { id, userId } = await params;
    const institutionId = parseInt(id);
    const userIdInt = parseInt(userId);

    if (isNaN(institutionId) || isNaN(userIdInt)) {
      return NextResponse.json({ error: 'Invalid institution or user ID' }, { status: 400 });
    }

    // Check if user is enrolled in this institution
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, userIdInt), eq(users.institutionId, institutionId)))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found or not enrolled in this institution' },
        { status: 404 }
      );
    }

    // Unenroll student
    const [unenrolled] = await db
      .update(users)
      .set({
        institutionId: null,
        studentId: null,
        academicYear: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userIdInt))
      .returning();

    return NextResponse.json({
      message: 'Student unenrolled successfully',
      user: unenrolled,
    });
  } catch (error) {
    console.error('Error unenrolling student:', error);
    return NextResponse.json(
      {
        error: 'Failed to unenroll student',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
