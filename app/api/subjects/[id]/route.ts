import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// UPDATE subject
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await request.json();
    const { name, nameKh, nameEn, slug, icon } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const updatedSubject = await db
      .update(subjects)
      .set({
        name: name || nameEn || nameKh || slug,
        nameKh: nameKh || null,
        nameEn: nameEn || null,
        slug,
        icon: icon || null,
      })
      .where(eq(subjects.id, id))
      .returning();

    if (updatedSubject.length === 0) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    return NextResponse.json(updatedSubject[0]);
  } catch (error: any) {
    console.error('Error updating subject:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Subject name or slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update subject' }, { status: 500 });
  }
}

// DELETE subject
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    const deletedSubject = await db
      .delete(subjects)
      .where(eq(subjects.id, id))
      .returning();

    if (deletedSubject.length === 0) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json({ error: 'Failed to delete subject' }, { status: 500 });
  }
}
