import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { studentNotes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// UPDATE student note
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id);
    const body = await request.json();

    const updatedNote = await db
      .update(studentNotes)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(studentNotes.id, noteId))
      .returning();

    if (!updatedNote.length) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(updatedNote[0]);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

// DELETE student note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id);

    const deletedNote = await db
      .delete(studentNotes)
      .where(eq(studentNotes.id, noteId))
      .returning();

    if (!deletedNote.length) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
