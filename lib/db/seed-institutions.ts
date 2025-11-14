/**
 * Seed script for Institution Management, Credit System, and Matching Engine
 *
 * This creates a complete demo environment with:
 * - Multiple institutions
 * - Enrolled students and tutors
 * - Credit transactions
 * - Matching preferences
 * - Active matches
 */

import 'dotenv/config';
import { db } from './index';
import {
  institutions,
  partnerships,
  users,
  subjects,
  tutors,
  countries,
  bookings,
  creditTransactions,
  matchingPreferences,
  matches,
} from './schema';
import { eq, isNotNull } from 'drizzle-orm';

async function cleanInstitutionData() {
  console.log('🧹 Cleaning existing institution data...');

  // Delete in correct order (respect foreign keys)
  await db.delete(creditTransactions);
  console.log('  ✓ Cleared credit transactions');

  await db.delete(bookings).where(eq(bookings.isCreditEligible, true));
  console.log('  ✓ Cleared credit-eligible bookings');

  await db.delete(matches);
  console.log('  ✓ Cleared matches');

  await db.delete(matchingPreferences);
  console.log('  ✓ Cleared matching preferences');

  // Delete users that are part of institutions (preserve original users)
  await db.delete(users).where(isNotNull(users.institutionId));
  console.log('  ✓ Cleared institution users');

  await db.delete(partnerships);
  console.log('  ✓ Cleared partnerships');

  await db.delete(institutions);
  console.log('  ✓ Cleared institutions');
}

async function seedSubjects() {
  console.log('📚 Seeding subjects...');

  // Check if subjects already exist
  const existingSubjects = await db.select().from(subjects);

  if (existingSubjects.length > 0) {
    console.log(`  ℹ️  Found ${existingSubjects.length} existing subjects, skipping creation`);
    return existingSubjects;
  }

  const subjectData = [
    { name: 'Mathematics', slug: 'mathematics', icon: '🔢', nameKh: 'គណិតវិទ្យា', nameEn: 'Mathematics' },
    { name: 'English', slug: 'english', icon: '🇬🇧', nameKh: 'អង់គ្លេស', nameEn: 'English' },
    { name: 'Programming', slug: 'programming', icon: '💻', nameKh: 'កម្មវិធី', nameEn: 'Programming' },
    { name: 'Finance', slug: 'finance', icon: '💰', nameKh: 'ហិរញ្ញវត្ថុ', nameEn: 'Finance' },
    { name: 'Accounting', slug: 'accounting', icon: '📊', nameKh: 'គណនេយ្យ', nameEn: 'Accounting' },
    { name: 'Marketing', slug: 'marketing', icon: '📢', nameKh: 'ទីផ្សារ', nameEn: 'Marketing' },
    { name: 'Science', slug: 'science', icon: '🔬', nameKh: 'វិទ្យាសាស្ត្រ', nameEn: 'Science' },
  ];

  const createdSubjects = [];
  for (const subject of subjectData) {
    const [created] = await db.insert(subjects).values(subject).returning();
    createdSubjects.push(created);
    console.log(`  ✓ Created subject: ${created.name}`);
  }

  return createdSubjects;
}

async function seedInstitutions() {
  console.log('🏫 Seeding institutions...');

  const institutionData = [
    {
      name: 'Royal University of Phnom Penh',
      nameKh: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ',
      nameEn: 'Royal University of Phnom Penh',
      slug: 'rupp',
      type: 'university' as const,
      city: 'Phnom Penh',
      contactEmail: 'info@rupp.edu.kh',
      website: 'https://rupp.edu.kh',
      creditRequirementMin: 3,
      creditRequirementMax: 6,
      creditValuePerSession: '0.5',
      academicYearStart: '09-01',
      academicYearEnd: '06-30',
      allowCrossInstitution: true,
      requireApproval: true,
    },
    {
      name: 'Institute of Technology of Cambodia',
      nameKh: 'វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា',
      nameEn: 'Institute of Technology of Cambodia',
      slug: 'itc',
      type: 'university' as const,
      city: 'Phnom Penh',
      contactEmail: 'info@itc.edu.kh',
      website: 'https://itc.edu.kh',
      creditRequirementMin: 4,
      creditRequirementMax: 8,
      creditValuePerSession: '0.5',
      academicYearStart: '10-01',
      academicYearEnd: '07-31',
      allowCrossInstitution: true,
      requireApproval: true,
    },
    {
      name: 'Kampong Cham University',
      nameKh: 'សាកលវិទ្យាល័យកំពង់ចាម',
      nameEn: 'Kampong Cham University',
      slug: 'kcu',
      type: 'university' as const,
      city: 'Kampong Cham',
      contactEmail: 'info@kcu.edu.kh',
      creditRequirementMin: 3,
      creditRequirementMax: 6,
      creditValuePerSession: '0.5',
      academicYearStart: '09-15',
      academicYearEnd: '06-15',
      allowCrossInstitution: true,
      requireApproval: true,
    },
    {
      name: 'Battambang Teacher Training College',
      nameKh: 'មហាវិទ្យាល័យបណ្តុះគ្រូបាត់ដំបង',
      nameEn: 'Battambang Teacher Training College',
      slug: 'bttc',
      type: 'college' as const,
      city: 'Battambang',
      contactEmail: 'info@bttc.edu.kh',
      creditRequirementMin: 3,
      creditRequirementMax: 5,
      creditValuePerSession: '0.5',
      allowCrossInstitution: true,
      requireApproval: true,
    },
  ];

  for (const inst of institutionData) {
    const [institution] = await db.insert(institutions).values(inst).returning();
    console.log(`  ✓ Created institution: ${institution.name}`);

    // Create partnership for each institution
    await db.insert(partnerships).values({
      institutionId: institution.id,
      tier: institution.slug === 'rupp' ? 'premium' : institution.slug === 'itc' ? 'basic' : 'free',
      studentsLimit: institution.slug === 'rupp' ? 200 : institution.slug === 'itc' ? 100 : 50,
      startDate: new Date('2024-09-01'),
      annualFee: institution.slug === 'rupp' ? '2000' : institution.slug === 'itc' ? '500' : '0',
      isActive: true,
    });
  }

  return await db.select().from(institutions);
}

async function seedStudentsAndTutors(institutionsList: any[]) {
  console.log('👥 Seeding students and tutors...');

  // Get actual institution IDs from database
  const rupp = institutionsList.find(i => i.slug === 'rupp')!;
  const itc = institutionsList.find(i => i.slug === 'itc')!;
  const kcu = institutionsList.find(i => i.slug === 'kcu')!;
  const bttc = institutionsList.find(i => i.slug === 'bttc')!;

  const userData = [
    // RUPP students (Phnom Penh - tutors)
    { firstName: 'Sokha', lastName: 'Chan', email: 'sokha.chan@rupp.edu.kh', role: 'verified_tutor' as const, institutionId: rupp.id, studentId: 'RUPP-2024-001', academicYear: '2024-2025', creditBalance: '2.5' },
    { firstName: 'Dara', lastName: 'Meas', email: 'dara.meas@rupp.edu.kh', role: 'verified_tutor' as const, institutionId: rupp.id, studentId: 'RUPP-2024-002', academicYear: '2024-2025', creditBalance: '3.0' },
    { firstName: 'Veasna', lastName: 'Keo', email: 'veasna.keo@rupp.edu.kh', role: 'verified_tutor' as const, institutionId: rupp.id, studentId: 'RUPP-2024-003', academicYear: '2024-2025', creditBalance: '1.5' },

    // ITC students (Phnom Penh - tutors)
    { firstName: 'Rith', lastName: 'Sambo', email: 'rith.sambo@itc.edu.kh', role: 'verified_tutor' as const, institutionId: itc.id, studentId: 'ITC-2024-001', academicYear: '2024-2025', creditBalance: '2.0' },
    { firstName: 'Thida', lastName: 'Heng', email: 'thida.heng@itc.edu.kh', role: 'verified_tutor' as const, institutionId: itc.id, studentId: 'ITC-2024-002', academicYear: '2024-2025', creditBalance: '3.5' },

    // Kampong Cham students (remote - mentees)
    { firstName: 'Sophea', lastName: 'Prak', email: 'sophea.prak@kcu.edu.kh', role: 'mentee' as const, institutionId: kcu.id, studentId: 'KCU-2024-001', academicYear: '2024-2025', creditBalance: '0' },
    { firstName: 'Bopha', lastName: 'Touch', email: 'bopha.touch@kcu.edu.kh', role: 'mentee' as const, institutionId: kcu.id, studentId: 'KCU-2024-002', academicYear: '2024-2025', creditBalance: '0' },
    { firstName: 'Chanty', lastName: 'Sok', email: 'chanty.sok@kcu.edu.kh', role: 'mentee' as const, institutionId: kcu.id, studentId: 'KCU-2024-003', academicYear: '2024-2025', creditBalance: '0' },

    // Battambang students (remote - mentees)
    { firstName: 'Sreymom', lastName: 'Ly', email: 'sreymom.ly@bttc.edu.kh', role: 'mentee' as const, institutionId: bttc.id, studentId: 'BTTC-2024-001', academicYear: '2024-2025', creditBalance: '0' },
    { firstName: 'Ratana', lastName: 'Chea', email: 'ratana.chea@bttc.edu.kh', role: 'mentee' as const, institutionId: bttc.id, studentId: 'BTTC-2024-002', academicYear: '2024-2025', creditBalance: '0' },

    // Faculty coordinators
    { firstName: 'Dr. Sovan', lastName: 'Kim', email: 'sovan.kim@rupp.edu.kh', role: 'faculty_coordinator' as const, institutionId: rupp.id },
    { firstName: 'Prof. Chanra', lastName: 'Pov', email: 'chanra.pov@itc.edu.kh', role: 'faculty_coordinator' as const, institutionId: itc.id },
  ];

  const createdUsers = [];
  for (const user of userData) {
    const [created] = await db.insert(users).values({
      ...user,
      password: 'demo123', // In production, this should be hashed
      isActive: true,
    }).returning();
    createdUsers.push(created);
    console.log(`  ✓ Created user: ${created.firstName} ${created.lastName} (${created.role})`);
  }

  return createdUsers;
}

async function seedMatchingPreferences(usersList: any[]) {
  console.log('🎯 Seeding matching preferences...');

  const tutors = usersList.filter(u => u.role === 'verified_tutor');

  for (const tutor of tutors) {
    await db.insert(matchingPreferences).values({
      userId: tutor.id,
      preferredSubjects: JSON.stringify([1, 2, 3]), // Mathematics, English, Programming
      preferredSessionTypes: JSON.stringify(['tutoring', 'mentoring']),
      maxSessionsPerWeek: Math.floor(Math.random() * 3) + 2, // 2-4 sessions
      availableDays: JSON.stringify(['monday', 'wednesday', 'friday']),
      availableTimeSlots: JSON.stringify({ evening: ['18:00-20:00'] }),
      onlineOnly: true,
      preferRemoteStudents: true,
      isActive: true,
    });
    console.log(`  ✓ Created preferences for ${tutor.firstName}`);
  }
}

async function seedMatches(usersList: any[], subjectsList: any[]) {
  console.log('🤝 Seeding matches...');

  const tutors = usersList.filter(u => u.role === 'verified_tutor');
  const mentees = usersList.filter(u => u.role === 'mentee');

  // Get actual subject IDs from database
  const math = subjectsList.find(s => s.slug === 'mathematics') || subjectsList[0];
  const english = subjectsList.find(s => s.slug === 'english') || subjectsList[1];
  const programming = subjectsList.find(s => s.slug === 'programming') || subjectsList[2];

  const matchData = [
    // Cross-institution: RUPP tutor → Kampong Cham mentee
    { tutorIdx: 0, menteeIdx: 0, subjectId: math.id, score: 85, status: 'accepted', acceptedByTutor: true, acceptedByMentee: true, reason: 'Cross-institution match - High impact urban→rural knowledge transfer' },
    { tutorIdx: 1, menteeIdx: 1, subjectId: english.id, score: 78, status: 'accepted', acceptedByTutor: true, acceptedByMentee: true, reason: 'Subject expertise match with geographic diversity priority' },
    { tutorIdx: 2, menteeIdx: 2, subjectId: programming.id, score: 92, status: 'pending', acceptedByTutor: true, acceptedByMentee: false, reason: 'Algorithm-suggested high-confidence match' },

    // Cross-institution: ITC tutor → Battambang mentee
    { tutorIdx: 3, menteeIdx: 3, subjectId: math.id, score: 88, status: 'accepted', acceptedByTutor: true, acceptedByMentee: true, reason: 'Cross-province educational equity initiative' },
    { tutorIdx: 4, menteeIdx: 4, subjectId: english.id, score: 75, status: 'pending', acceptedByTutor: false, acceptedByMentee: false, reason: 'Coordinator-proposed match for rural development' },
  ];

  for (const match of matchData) {
    const tutor = tutors[match.tutorIdx];
    const mentee = mentees[match.menteeIdx];

    const [created] = await db.insert(matches).values({
      tutorUserId: tutor.id,
      menteeUserId: mentee.id,
      tutorInstitutionId: tutor.institutionId!,
      menteeInstitutionId: mentee.institutionId!,
      subjectId: match.subjectId,
      matchScore: match.score.toString(),
      status: match.status as any,
      proposedBy: 'algorithm',
      matchReason: match.reason,
      acceptedByTutor: match.acceptedByTutor,
      acceptedByMentee: match.acceptedByMentee,
      acceptedAt: match.status === 'accepted' ? new Date() : null,
      startedAt: match.status === 'accepted' ? new Date() : null,
      totalSessions: match.status === 'accepted' ? Math.floor(Math.random() * 5) + 1 : 0,
    }).returning();

    console.log(`  ✓ Created match: ${tutor.firstName} → ${mentee.firstName} (score: ${match.score})`);
  }
}

async function seedBookingsAndCredits(usersList: any[], subjectsList: any[]) {
  console.log('📚 Seeding bookings and credit transactions...');

  const studentTutors = usersList.filter(u => u.role === 'verified_tutor');
  const mentees = usersList.filter(u => u.role === 'mentee');
  const facultyCoordinators = usersList.filter(u => u.role === 'faculty_coordinator');

  // Get or create a country for the dummy tutor
  let [existingCountry] = await db.select().from(countries).limit(1);

  if (!existingCountry) {
    [existingCountry] = await db.insert(countries).values({
      name: 'Cambodia',
      code: 'KH',
      flag: '🇰🇭'
    }).returning();
  }

  // Get or create a dummy tutor for credit-eligible bookings
  const math = subjectsList.find(s => s.slug === 'mathematics') || subjectsList[0];

  let [dummyTutor] = await db.select().from(tutors)
    .where(eq(tutors.slug, 'peer-tutor-system')).limit(1);

  if (!dummyTutor) {
    [dummyTutor] = await db.insert(tutors).values({
      firstName: 'Peer',
      lastName: 'Tutor',
      slug: 'peer-tutor-system',
      subjectId: math.id,
      countryId: existingCountry.id,
      specialization: 'Academic',
      level: 'Advanced',
      hourlyRate: '0',
      rating: '0',
      totalReviews: 0,
      totalLessons: 0,
      yearsExperience: 0,
      bio: 'Placeholder for peer tutoring system',
      isVerified: false,
    }).returning();
    console.log('  ✓ Created dummy tutor for credit bookings');
  } else {
    console.log('  ℹ️  Found existing dummy tutor, reusing');
  }

  // Create completed bookings
  for (let i = 0; i < 10; i++) {
    const tutor = studentTutors[i % studentTutors.length];
    const mentee = mentees[i % mentees.length];

    const [booking] = await db.insert(bookings).values({
      studentId: tutor.id, // Student tutor
      tutorId: dummyTutor.id, // Reference to dummy tutor
      scheduledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random past date
      duration: 60,
      price: '0', // Free for credit-eligible sessions
      status: 'completed',
      isCreditEligible: true,
      sessionType: 'tutoring',
      creditValue: '0.5',
      completedAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000),
      completionNotes: 'Great progress on subject understanding',
    }).returning();

    console.log(`  ✓ Created booking for ${tutor.firstName}`);

    // Create credit transaction
    const isApproved = Math.random() > 0.3; // 70% approved
    const isCredited = isApproved && Math.random() > 0.2; // 80% of approved are credited

    const [transaction] = await db.insert(creditTransactions).values({
      userId: tutor.id,
      institutionId: tutor.institutionId!,
      bookingId: booking.id,
      creditsEarned: '0.5',
      academicYear: '2024-2025',
      status: isCredited ? 'credited' : isApproved ? 'approved' : 'pending',
      reviewedBy: isApproved ? facultyCoordinators[0]?.id : null,
      reviewedAt: isApproved ? new Date() : null,
      reviewNotes: isApproved ? 'Session verified and approved' : null,
      creditedAt: isCredited ? new Date() : null,
    }).returning();

    console.log(`  ✓ Created credit transaction (${transaction.status})`);
  }
}

async function main() {
  console.log('🌱 Starting comprehensive seed...\n');

  try {
    // Step 0: Clean existing institution data
    await cleanInstitutionData();
    console.log();

    // Step 1: Create subjects
    const subjectsList = await seedSubjects();
    console.log();

    // Step 2: Create institutions
    const institutionsList = await seedInstitutions();
    console.log();

    // Step 3: Create users (students, tutors, faculty)
    const usersList = await seedStudentsAndTutors(institutionsList);
    console.log();

    // Step 4: Create matching preferences
    await seedMatchingPreferences(usersList);
    console.log();

    // Step 5: Create matches
    await seedMatches(usersList, subjectsList);
    console.log();

    // Step 6: Create bookings and credit transactions
    await seedBookingsAndCredits(usersList, subjectsList);
    console.log();

    console.log('✅ Seed completed successfully!\n');
    console.log('📝 Summary:');
    console.log(`   - ${subjectsList.length} subjects created`);
    console.log(`   - ${institutionsList.length} institutions created`);
    console.log(`   - ${usersList.length} users created`);
    console.log(`   - Matching preferences, matches, bookings, and credits seeded`);
    console.log('\n🎉 Your institution management demo is ready!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

main();
