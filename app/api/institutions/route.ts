import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { institutions, partnerships } from '@/lib/db/schema';
import { eq, ilike, or, desc } from 'drizzle-orm';

// GET /api/institutions - List all institutions with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const active = searchParams.get('active');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build filter conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(institutions.name, `%${search}%`),
          ilike(institutions.nameKh, `%${search}%`),
          ilike(institutions.nameEn, `%${search}%`)
        )
      );
    }

    if (type) {
      conditions.push(eq(institutions.type, type as any));
    }

    if (active !== null && active !== undefined) {
      conditions.push(eq(institutions.isActive, active === 'true'));
    }

    // Build and execute query
    const query = db
      .select({
        id: institutions.id,
        name: institutions.name,
        nameKh: institutions.nameKh,
        nameEn: institutions.nameEn,
        slug: institutions.slug,
        type: institutions.type,
        logo: institutions.logo,
        description: institutions.description,
        city: institutions.city,
        contactEmail: institutions.contactEmail,
        contactPhone: institutions.contactPhone,
        website: institutions.website,
        creditRequirementMin: institutions.creditRequirementMin,
        creditRequirementMax: institutions.creditRequirementMax,
        creditValuePerSession: institutions.creditValuePerSession,
        academicYearStart: institutions.academicYearStart,
        academicYearEnd: institutions.academicYearEnd,
        allowCrossInstitution: institutions.allowCrossInstitution,
        requireApproval: institutions.requireApproval,
        isActive: institutions.isActive,
        createdAt: institutions.createdAt,
        updatedAt: institutions.updatedAt,
      })
      .from(institutions)
      .$dynamic();

    const result = await query
      .where(conditions.length > 0 ? or(...conditions) : undefined)
      .orderBy(desc(institutions.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch institutions',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/institutions - Create new institution
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, slug, type, countryId } = body;

    if (!name || !slug || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, type' },
        { status: 400 }
      );
    }

    // Check if institution with same slug already exists
    const existing = await db
      .select()
      .from(institutions)
      .where(eq(institutions.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Institution with this slug already exists' },
        { status: 409 }
      );
    }

    // Create institution
    const [newInstitution] = await db
      .insert(institutions)
      .values({
        name: body.name,
        nameKh: body.nameKh,
        nameEn: body.nameEn,
        slug: body.slug,
        type: body.type,
        logo: body.logo,
        description: body.description,
        descriptionKh: body.descriptionKh,
        descriptionEn: body.descriptionEn,
        address: body.address,
        city: body.city,
        countryId: body.countryId,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        website: body.website,
        creditRequirementMin: body.creditRequirementMin || 3,
        creditRequirementMax: body.creditRequirementMax || 6,
        creditValuePerSession: body.creditValuePerSession || '0.5',
        academicYearStart: body.academicYearStart,
        academicYearEnd: body.academicYearEnd,
        allowCrossInstitution: body.allowCrossInstitution !== false,
        requireApproval: body.requireApproval !== false,
        isActive: body.isActive !== false,
      })
      .returning();

    // Create default free partnership
    if (body.createPartnership !== false) {
      await db.insert(partnerships).values({
        institutionId: newInstitution.id,
        tier: 'free',
        studentsLimit: 50,
        startDate: new Date(),
        annualFee: '0',
        isActive: true,
      });
    }

    return NextResponse.json(newInstitution, { status: 201 });
  } catch (error) {
    console.error('Error creating institution:', error);
    return NextResponse.json(
      {
        error: 'Failed to create institution',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any).code,
        detail: (error as any).detail,
      },
      { status: 500 }
    );
  }
}
