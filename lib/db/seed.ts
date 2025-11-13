import { db } from './index';
import { subjects, countries, tutors, users, bookings, reviews, messages, studentNotes, earningsAdjustments } from './schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  await db.delete(earningsAdjustments);
  await db.delete(studentNotes);
  await db.delete(messages);
  await db.delete(reviews);
  await db.delete(bookings);
  await db.delete(users);
  await db.delete(tutors);
  await db.delete(subjects);
  await db.delete(countries);

  // Insert subjects
  const subjectData = [
    { name: 'English', slug: 'english', icon: '🇬🇧' },
    { name: 'Spanish', slug: 'spanish', icon: '🇪🇸' },
    { name: 'French', slug: 'french', icon: '🇫🇷' },
    { name: 'German', slug: 'german', icon: '🇩🇪' },
    { name: 'Chinese', slug: 'chinese', icon: '🇨🇳' },
    { name: 'Japanese', slug: 'japanese', icon: '🇯🇵' },
    { name: 'Math', slug: 'math', icon: '🔢' },
  ];

  const insertedSubjects = await db.insert(subjects).values(subjectData).returning();
  console.log(`Inserted ${insertedSubjects.length} subjects`);

  // Insert countries
  const countryData = [
    { name: 'United States', code: 'US', flag: '🇺🇸' },
    { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦' },
    { name: 'Australia', code: 'AU', flag: '🇦🇺' },
    { name: 'Spain', code: 'ES', flag: '🇪🇸' },
    { name: 'France', code: 'FR', flag: '🇫🇷' },
    { name: 'Germany', code: 'DE', flag: '🇩🇪' },
    { name: 'China', code: 'CN', flag: '🇨🇳' },
    { name: 'Japan', code: 'JP', flag: '🇯🇵' },
    { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
  ];

  const insertedCountries = await db.insert(countries).values(countryData).returning();
  console.log(`Inserted ${insertedCountries.length} countries`);

  // Insert sample tutors
  const englishSubject = insertedSubjects.find(s => s.slug === 'english')!;
  const spanishSubject = insertedSubjects.find(s => s.slug === 'spanish')!;
  const mathSubject = insertedSubjects.find(s => s.slug === 'math')!;
  
  const usCountry = insertedCountries.find(c => c.code === 'US')!;
  const ukCountry = insertedCountries.find(c => c.code === 'GB')!;
  const esCountry = insertedCountries.find(c => c.code === 'ES')!;

  const tutorData = [
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      slug: 'sarah-johnson',
      avatar: 'https://i.pravatar.cc/300?img=1',
      subjectId: englishSubject.id,
      countryId: usCountry.id,
      specialization: 'Business' as const,
      level: 'Native' as const,
      hourlyRate: '35.00',
      rating: '4.95',
      totalReviews: 248,
      totalLessons: 1850,
      yearsExperience: 8,
      bio: 'Certified English teacher with 8 years of experience. I specialize in Business English and IELTS preparation.',
      teachingStyle: 'Interactive and student-centered approach',
      spokenLanguages: JSON.stringify(['English (Native)', 'Spanish (Advanced)']),
      isVerified: true,
    },
    {
      firstName: 'James',
      lastName: 'Williams',
      slug: 'james-williams',
      avatar: 'https://i.pravatar.cc/300?img=12',
      subjectId: englishSubject.id,
      countryId: ukCountry.id,
      specialization: 'Conversational' as const,
      level: 'Native' as const,
      hourlyRate: '28.00',
      rating: '4.88',
      totalReviews: 156,
      totalLessons: 980,
      yearsExperience: 5,
      bio: 'Friendly British English tutor. I help students improve their speaking confidence!',
      teachingStyle: 'Conversational practice with real-world scenarios',
      spokenLanguages: JSON.stringify(['English (Native)', 'French (Intermediate)']),
      isVerified: true,
    },
    {
      firstName: 'Emily',
      lastName: 'Chen',
      slug: 'emily-chen',
      avatar: 'https://i.pravatar.cc/300?img=5',
      subjectId: englishSubject.id,
      countryId: usCountry.id,
      specialization: 'Test Preparation' as const,
      level: 'Advanced' as const,
      hourlyRate: '42.00',
      rating: '4.97',
      totalReviews: 312,
      totalLessons: 2240,
      yearsExperience: 10,
      bio: 'TOEFL and IELTS expert. 95% of my students achieve their target scores!',
      teachingStyle: 'Structured test-focused lessons with practice materials',
      spokenLanguages: JSON.stringify(['English (Native)', 'Mandarin (Native)']),
      isVerified: true,
    },
    {
      firstName: 'Maria',
      lastName: 'Garcia',
      slug: 'maria-garcia',
      avatar: 'https://i.pravatar.cc/300?img=9',
      subjectId: spanishSubject.id,
      countryId: esCountry.id,
      specialization: 'Conversational' as const,
      level: 'Native' as const,
      hourlyRate: '25.00',
      rating: '4.90',
      totalReviews: 134,
      totalLessons: 756,
      yearsExperience: 6,
      bio: 'Native Spanish speaker from Madrid. I make learning Spanish fun!',
      teachingStyle: 'Immersive conversational approach with cultural context',
      spokenLanguages: JSON.stringify(['Spanish (Native)', 'English (Fluent)']),
      isVerified: true,
    },
    {
      firstName: 'David',
      lastName: 'Kim',
      slug: 'david-kim',
      avatar: 'https://i.pravatar.cc/300?img=14',
      subjectId: mathSubject.id,
      countryId: usCountry.id,
      specialization: 'Academic' as const,
      level: 'Advanced' as const,
      hourlyRate: '45.00',
      rating: '4.96',
      totalReviews: 267,
      totalLessons: 1680,
      yearsExperience: 9,
      bio: 'Math tutor specializing in SAT/ACT prep and high school mathematics.',
      teachingStyle: 'Problem-solving focused with step-by-step explanations',
      spokenLanguages: JSON.stringify(['English (Native)', 'Korean (Native)']),
      isVerified: true,
    },
  ];

  const insertedTutors = await db.insert(tutors).values(tutorData).returning();
  console.log(`Inserted ${insertedTutors.length} tutors`);

  // Insert users (students, tutors with accounts, admin)
  const userData = [
    {
      email: 'admin@tutorhub.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin' as const,
      isActive: true,
    },
    {
      email: 'john@example.com',
      password: 'student123',
      firstName: 'John',
      lastName: 'Smith',
      avatar: 'https://i.pravatar.cc/150?img=15',
      role: 'student' as const,
      isActive: true,
    },
    {
      email: 'sarah@example.com',
      password: 'tutor123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'tutor' as const,
      tutorId: insertedTutors[0].id,
      isActive: true,
    },
  ];

  const insertedUsers = await db.insert(users).values(userData).returning();
  console.log(`Inserted ${insertedUsers.length} users`);

  // Insert bookings
  const student = insertedUsers.find(u => u.role === 'student')!;
  const bookingData = [
    {
      studentId: student.id,
      tutorId: insertedTutors[0].id,
      scheduledAt: new Date('2024-11-12T10:00:00'),
      duration: 60,
      price: '35.00',
      status: 'confirmed' as const,
      notes: 'Business English lesson',
    },
    {
      studentId: student.id,
      tutorId: insertedTutors[2].id,
      scheduledAt: new Date('2024-11-14T14:00:00'),
      duration: 60,
      price: '42.00',
      status: 'pending' as const,
      notes: 'IELTS preparation',
    },
  ];

  const insertedBookings = await db.insert(bookings).values(bookingData).returning();
  console.log(`Inserted ${insertedBookings.length} bookings`);

  // Insert reviews
  const reviewData = [
    {
      bookingId: insertedBookings[0].id,
      studentId: student.id,
      tutorId: insertedTutors[0].id,
      rating: 5,
      comment: 'Excellent teacher! Very professional and helpful.',
    },
  ];

  const insertedReviews = await db.insert(reviews).values(reviewData).returning();
  console.log(`Inserted ${insertedReviews.length} reviews`);

  // Insert messages
  const tutor = insertedUsers.find(u => u.role === 'tutor')!;
  const messageData = [
    {
      senderId: student.id,
      receiverId: tutor.id,
      message: 'Hi! I would like to book a lesson with you.',
      isRead: true,
    },
    {
      senderId: tutor.id,
      receiverId: student.id,
      message: 'Hello! Sure, I have availability tomorrow at 10 AM. Does that work for you?',
      isRead: true,
    },
    {
      senderId: student.id,
      receiverId: tutor.id,
      message: 'Perfect! See you tomorrow!',
      isRead: false,
    },
  ];

  const insertedMessages = await db.insert(messages).values(messageData).returning();
  console.log(`Inserted ${insertedMessages.length} messages`);

  // Insert student notes
  const noteData = [
    {
      tutorId: insertedTutors[0].id,
      studentId: student.id,
      notes: 'Great progress in business vocabulary. Focus on presentation skills next.',
      progressLevel: 'Intermediate',
    },
  ];

  const insertedNotes = await db.insert(studentNotes).values(noteData).returning();
  console.log(`Inserted ${insertedNotes.length} student notes`);

  // Insert earnings adjustments
  const adjustmentData = [
    {
      tutorId: insertedTutors[0].id,
      amount: '50.00',
      reason: 'Performance bonus for excellent student reviews',
      type: 'bonus' as const,
      createdBy: insertedUsers[0].id,
    },
  ];

  const insertedAdjustments = await db.insert(earningsAdjustments).values(adjustmentData).returning();
  console.log(`Inserted ${insertedAdjustments.length} earnings adjustments`);

  console.log('Seeding completed!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed!');
  console.error(err);
  process.exit(1);
});
