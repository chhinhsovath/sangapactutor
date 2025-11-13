import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subjects } from '@/lib/db/schema';

export async function GET() {
  try {
    const allSubjects = await db.query.subjects.findMany({
      orderBy: (subjects, { asc }) => [asc(subjects.name)],
    });

    return NextResponse.json(allSubjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}

// CREATE new subject
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nameKh, nameEn, slug, icon } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Use bilingual fields if provided, fallback to 'name' for backward compatibility
    const newSubject = await db.insert(subjects).values({
      name: name || nameEn || nameKh || slug, // Fallback for legacy support
      nameKh: nameKh || null,
      nameEn: nameEn || null,
      slug,
      icon: icon || null,
    }).returning();

    return NextResponse.json(newSubject[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating subject:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Subject name or slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 });
  }
}
