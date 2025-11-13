import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { countries } from '@/lib/db/schema';

export async function GET() {
  try {
    const allCountries = await db.query.countries.findMany({
      orderBy: (countries, { asc }) => [asc(countries.name)],
    });

    return NextResponse.json(allCountries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
  }
}

// CREATE new country
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nameKh, nameEn, code, flag } = body;

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const newCountry = await db.insert(countries).values({
      name: name || nameEn || nameKh || code,
      nameKh: nameKh || null,
      nameEn: nameEn || null,
      code: code.toUpperCase(),
      flag: flag || null,
    }).returning();

    return NextResponse.json(newCountry[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating country:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Country name or code already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create country' }, { status: 500 });
  }
}
