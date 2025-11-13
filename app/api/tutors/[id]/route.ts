import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tutors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET single tutor
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const tutorId = parseInt(idStr);
    const tutor = await db.query.tutors.findFirst({
      where: eq(tutors.id, tutorId),
      with: {
        subject: true,
        country: true,
      },
    });

    if (!tutor) {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });
    }

    return NextResponse.json(tutor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tutor' }, { status: 500 });
  }
}

// UPDATE tutor
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const tutorId = parseInt(idStr);
    const body = await request.json();

    const updatedTutor = await db
      .update(tutors)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(tutors.id, tutorId))
      .returning();

    if (!updatedTutor.length) {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTutor[0]);
  } catch (error) {
    console.error('Error updating tutor:', error);
    return NextResponse.json({ error: 'Failed to update tutor' }, { status: 500 });
  }
}

// DELETE tutor
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const tutorId = parseInt(idStr);

    const deletedTutor = await db
      .delete(tutors)
      .where(eq(tutors.id, tutorId))
      .returning();

    if (!deletedTutor.length) {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tutor:', error);
    return NextResponse.json({ error: 'Failed to delete tutor' }, { status: 500 });
  }
}
