import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const ctries = await db.query.countries.findMany({
      orderBy: (countries, { asc }) => [asc(countries.name)],
    });

    return NextResponse.json(ctries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
  }
}
