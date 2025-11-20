import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { countries } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
    try {
        const allCountries = await db.select().from(countries);
        return NextResponse.json(allCountries);
    } catch (error) {
        console.error('Get countries error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
