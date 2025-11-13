import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { studentNotes } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// GET student notes for a tutor
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tutorId = searchParams.get('tutorId');
    const studentId = searchParams.get('studentId');

    let conditions = [];
    if (tutorId) {
      conditions.push(eq(studentNotes.tutorId, parseInt(tutorId)));
    }
    if (studentId) {
      conditions.push(eq(studentNotes.studentId, parseInt(studentId)));
    }

    const notes = await db.query.studentNotes.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: (studentNotes, { desc }) => [desc(studentNotes.updatedAt)],
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// CREATE student note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tutorId, studentId, notes, progressLevel } = body;

    if (!tutorId || !studentId || !notes) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newNote = await db.insert(studentNotes).values({
      tutorId,
      studentId,
      notes,
      progressLevel: progressLevel || null,
    }).returning();

    return NextResponse.json(newNote[0], { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
