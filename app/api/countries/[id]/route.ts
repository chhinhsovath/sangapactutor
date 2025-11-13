import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { countries } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// UPDATE country
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, nameKh, nameEn, code, flag } = body;

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const updatedCountry = await db
      .update(countries)
      .set({
        name: name || nameEn || nameKh || code,
        nameKh: nameKh || null,
        nameEn: nameEn || null,
        code: code.toUpperCase(),
        flag: flag || null,
      })
      .where(eq(countries.id, id))
      .returning();

    if (updatedCountry.length === 0) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCountry[0]);
  } catch (error: any) {
    console.error('Error updating country:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Country name or code already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update country' }, { status: 500 });
  }
}

// DELETE country
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const deletedCountry = await db
      .delete(countries)
      .where(eq(countries.id, id))
      .returning();

    if (deletedCountry.length === 0) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Country deleted successfully' });
  } catch (error) {
    console.error('Error deleting country:', error);
    return NextResponse.json({ error: 'Failed to delete country' }, { status: 500 });
  }
}
