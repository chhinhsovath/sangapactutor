import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { institutions, users, partnerships, creditTransactions } from '@/lib/db/schema';
import { eq, and, count, sql } from 'drizzle-orm';

// GET /api/institutions/[id] - Get institution details with stats
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institutionId = parseInt(id);

    if (isNaN(institutionId)) {
      return NextResponse.json({ error: 'Invalid institution ID' }, { status: 400 });
    }

    // Get institution details
    const [institution] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, institutionId))
      .limit(1);

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // Get additional stats
    const [enrolledCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.institutionId, institutionId));

    const [currentPartnership] = await db
      .select()
      .from(partnerships)
      .where(
        and(
          eq(partnerships.institutionId, institutionId),
          eq(partnerships.isActive, true)
        )
      )
      .orderBy(sql`${partnerships.startDate} DESC`)
      .limit(1);

    const [creditsData] = await db
      .select({
        totalCreditsEarned: sql<string>`COALESCE(SUM(${creditTransactions.creditsEarned}), 0)`,
        totalApproved: count(
          sql`CASE WHEN ${creditTransactions.status} = 'approved' THEN 1 END`
        ),
        totalPending: count(
          sql`CASE WHEN ${creditTransactions.status} = 'pending' THEN 1 END`
        ),
      })
      .from(creditTransactions)
      .where(eq(creditTransactions.institutionId, institutionId));

    return NextResponse.json({
      ...institution,
      stats: {
        enrolledStudents: enrolledCount.count,
        totalCreditsEarned: creditsData?.totalCreditsEarned || '0',
        creditsApproved: creditsData?.totalApproved || 0,
        creditsPending: creditsData?.totalPending || 0,
      },
      currentPartnership,
    });
  } catch (error) {
    console.error('Error fetching institution:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch institution',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/institutions/[id] - Update institution
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institutionId = parseInt(id);
    const body = await request.json();

    if (isNaN(institutionId)) {
      return NextResponse.json({ error: 'Invalid institution ID' }, { status: 400 });
    }

    // Check if institution exists
    const [existing] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, institutionId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // If slug is being changed, check for conflicts
    if (body.slug && body.slug !== existing.slug) {
      const [slugConflict] = await db
        .select()
        .from(institutions)
        .where(eq(institutions.slug, body.slug))
        .limit(1);

      if (slugConflict) {
        return NextResponse.json(
          { error: 'Institution with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update institution
    const [updated] = await db
      .update(institutions)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(institutions.id, institutionId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating institution:', error);
    return NextResponse.json(
      {
        error: 'Failed to update institution',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any).code,
        detail: (error as any).detail,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/institutions/[id] - Soft delete institution (set isActive = false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institutionId = parseInt(id);

    if (isNaN(institutionId)) {
      return NextResponse.json({ error: 'Invalid institution ID' }, { status: 400 });
    }

    // Check if institution exists
    const [existing] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, institutionId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // Soft delete by setting isActive to false
    const [deleted] = await db
      .update(institutions)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(institutions.id, institutionId))
      .returning();

    // Also deactivate partnership
    await db
      .update(partnerships)
      .set({ isActive: false })
      .where(eq(partnerships.institutionId, institutionId));

    return NextResponse.json({
      message: 'Institution deactivated successfully',
      institution: deleted,
    });
  } catch (error) {
    console.error('Error deleting institution:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete institution',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
