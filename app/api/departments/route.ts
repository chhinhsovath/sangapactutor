import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const subjs = await db.query.subjects.findMany({
      orderBy: (subjects, { asc }) => [asc(subjects.name)],
    });

    return NextResponse.json(subjs);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}
