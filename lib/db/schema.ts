import { pgTable, serial, text, varchar, timestamp, integer, boolean, pgEnum, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('user_role', [
  'student',
  'tutor',
  'admin',
  'institution_admin',
  'faculty_coordinator',
  'student_coordinator',
  'verified_tutor',
  'mentee',
  'institution_viewer',
  'super_admin',
  'partner_manager'
]);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'completed', 'cancelled']);
export const specializationEnum = pgEnum('specialization', ['Conversational', 'Business', 'Test Preparation', 'Academic', 'Kids & Teens', 'Job Interview']);
export const levelEnum = pgEnum('tutor_level', ['Beginner', 'Intermediate', 'Advanced', 'Native']);
export const institutionTypeEnum = pgEnum('institution_type', ['university', 'college', 'high_school', 'training_center', 'other']);
export const creditStatusEnum = pgEnum('credit_status', ['pending', 'approved', 'rejected', 'credited']);
export const partnershipTierEnum = pgEnum('partnership_tier', ['free', 'basic', 'premium', 'enterprise']);
export const sessionTypeEnum = pgEnum('session_type', ['tutoring', 'mentoring', 'counseling', 'workshop']);
export const matchStatusEnum = pgEnum('match_status', ['pending', 'accepted', 'rejected', 'active', 'completed']);

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(), // Fallback/legacy field
  nameKh: varchar('name_kh', { length: 100 }), // Khmer name
  nameEn: varchar('name_en', { length: 100 }), // English name
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  icon: varchar('icon', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(), // Fallback/legacy field
  nameKh: varchar('name_kh', { length: 100 }), // Khmer name
  nameEn: varchar('name_en', { length: 100 }), // English name
  code: varchar('code', { length: 3 }).notNull().unique(),
  flag: varchar('flag', { length: 10 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Institutions table
export const institutions = pgTable('institutions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull().unique(),
  nameKh: varchar('name_kh', { length: 200 }),
  nameEn: varchar('name_en', { length: 200 }),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  type: institutionTypeEnum('type').notNull(),
  logo: varchar('logo', { length: 500 }),
  description: text('description'),
  descriptionKh: text('description_kh'),
  descriptionEn: text('description_en'),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  countryId: integer('country_id').references(() => countries.id),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  website: varchar('website', { length: 255 }),
  // Credit system settings
  creditRequirementMin: integer('credit_requirement_min').default(3), // Min sessions per year
  creditRequirementMax: integer('credit_requirement_max').default(6), // Max sessions per year
  creditValuePerSession: decimal('credit_value_per_session', { precision: 5, scale: 2 }).default('0.5'), // Credits earned per session
  academicYearStart: varchar('academic_year_start', { length: 10 }), // e.g., "09-01" (Sept 1)
  academicYearEnd: varchar('academic_year_end', { length: 10 }), // e.g., "06-30" (June 30)
  // Settings
  allowCrossInstitution: boolean('allow_cross_institution').default(true), // Allow students to tutor other institutions
  requireApproval: boolean('require_approval').default(true), // Require faculty approval for credits
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Partnerships table (billing and tier management)
export const partnerships = pgTable('partnerships', {
  id: serial('id').primaryKey(),
  institutionId: integer('institution_id').references(() => institutions.id).notNull(),
  tier: partnershipTierEnum('tier').notNull().default('free'),
  studentsLimit: integer('students_limit').default(50), // Max students for tier
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  annualFee: decimal('annual_fee', { precision: 10, scale: 2 }).default('0'),
  billingEmail: varchar('billing_email', { length: 255 }),
  billingAddress: text('billing_address'),
  features: text('features'), // JSON array of enabled features
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tutors = pgTable('tutors', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  avatar: varchar('avatar', { length: 500 }),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  countryId: integer('country_id').references(() => countries.id).notNull(),
  specialization: specializationEnum('specialization').notNull(),
  level: levelEnum('level').notNull(),
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }).notNull(),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  totalReviews: integer('total_reviews').default(0),
  totalLessons: integer('total_lessons').default(0),
  yearsExperience: integer('years_experience').default(0),
  bio: text('bio').notNull(), // Fallback/legacy field
  bioKh: text('bio_kh'), // Khmer biography
  bioEn: text('bio_en'), // English biography
  teachingStyle: text('teaching_style'), // Fallback/legacy field
  teachingStyleKh: text('teaching_style_kh'), // Khmer teaching style
  teachingStyleEn: text('teaching_style_en'), // English teaching style
  spokenLanguages: text('spoken_languages'), // JSON array of languages
  videoIntro: varchar('video_intro', { length: 500 }),
  availability: text('availability'), // JSON object
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;

export type Country = typeof countries.$inferSelect;
export type NewCountry = typeof countries.$inferInsert;

export type Tutor = typeof tutors.$inferSelect;
export type NewTutor = typeof tutors.$inferInsert;

// Relations
export const subjectsRelations = relations(subjects, ({ many }) => ({
  tutors: many(tutors),
}));

export const countriesRelations = relations(countries, ({ many }) => ({
  tutors: many(tutors),
}));

export const tutorsRelations = relations(tutors, ({ one }) => ({
  subject: one(subjects, {
    fields: [tutors.subjectId],
    references: [subjects.id],
  }),
  country: one(countries, {
    fields: [tutors.countryId],
    references: [countries.id],
  }),
}));

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }), // Optional for OAuth users
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  avatar: varchar('avatar', { length: 500 }),
  role: roleEnum('role').notNull(),
  tutorId: integer('tutor_id').references(() => tutors.id),
  // Institution fields
  institutionId: integer('institution_id').references(() => institutions.id),
  studentId: varchar('student_id', { length: 100 }), // Institution's student ID
  creditBalance: decimal('credit_balance', { precision: 10, scale: 2 }).default('0'), // Total credits earned
  academicYear: varchar('academic_year', { length: 20 }), // e.g., "2024-2025"
  // OAuth fields
  googleId: varchar('google_id', { length: 255 }).unique(),
  authProvider: varchar('auth_provider', { length: 50 }).default('local'), // 'local' | 'google'
  emailVerified: boolean('email_verified').default(false),
  // End OAuth fields
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Bookings/Sessions table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  tutorId: integer('tutor_id').references(() => tutors.id).notNull(),
  scheduledAt: timestamp('scheduled_at').notNull(),
  duration: integer('duration').notNull(), // in minutes
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum('status').notNull().default('pending'),
  notes: text('notes'),
  meetingLink: varchar('meeting_link', { length: 500 }),
  // Credit system fields
  isCreditEligible: boolean('is_credit_eligible').default(false), // Can earn credits
  sessionType: sessionTypeEnum('session_type').default('tutoring'),
  creditValue: decimal('credit_value', { precision: 5, scale: 2 }).default('0'), // Credits for this session
  completedAt: timestamp('completed_at'), // When session was completed
  completionNotes: text('completion_notes'), // Notes about session completion
  institutionApproved: boolean('institution_approved').default(false), // Faculty approved
  approvedBy: integer('approved_by').references(() => users.id), // Faculty who approved
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Reviews table
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  bookingId: integer('booking_id').references(() => bookings.id).notNull(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  tutorId: integer('tutor_id').references(() => tutors.id).notNull(),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  tutorResponse: text('tutor_response'),
  respondedAt: timestamp('responded_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Messages table
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  receiverId: integer('receiver_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Earnings adjustments table
export const earningsAdjustments = pgTable('earnings_adjustments', {
  id: serial('id').primaryKey(),
  tutorId: integer('tutor_id').references(() => tutors.id).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  reason: text('reason').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'bonus' or 'deduction'
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Student progress notes table
export const studentNotes = pgTable('student_notes', {
  id: serial('id').primaryKey(),
  tutorId: integer('tutor_id').references(() => tutors.id).notNull(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  notes: text('notes').notNull(),
  progressLevel: varchar('progress_level', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Credit transactions table - tracks credit earning history
export const creditTransactions = pgTable('credit_transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(), // Student tutor earning credits
  institutionId: integer('institution_id').references(() => institutions.id).notNull(),
  bookingId: integer('booking_id').references(() => bookings.id).notNull(),
  creditsEarned: decimal('credits_earned', { precision: 5, scale: 2 }).notNull(),
  academicYear: varchar('academic_year', { length: 20 }).notNull(),
  status: creditStatusEnum('status').notNull().default('pending'),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  reviewedBy: integer('reviewed_by').references(() => users.id), // Faculty coordinator
  reviewedAt: timestamp('reviewed_at'),
  reviewNotes: text('review_notes'),
  creditedAt: timestamp('credited_at'), // When credits were added to student balance
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Matching preferences - student tutor preferences for matches
export const matchingPreferences = pgTable('matching_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(), // Student tutor
  preferredSubjects: text('preferred_subjects'), // JSON array of subject IDs
  preferredInstitutions: text('preferred_institutions'), // JSON array of institution IDs
  preferredSessionTypes: text('preferred_session_types'), // JSON array of session types
  maxSessionsPerWeek: integer('max_sessions_per_week').default(3),
  availableDays: text('available_days'), // JSON array of days ['monday', 'wednesday']
  availableTimeSlots: text('available_time_slots'), // JSON object of time ranges
  willingToTravelDistance: integer('willing_to_travel_distance'), // km, null if online only
  onlineOnly: boolean('online_only').default(true),
  preferRemoteStudents: boolean('prefer_remote_students').default(true), // Prioritize rural areas
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Matches - tutor-mentee matching records
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  tutorUserId: integer('tutor_user_id').references(() => users.id).notNull(), // Student tutor
  menteeUserId: integer('mentee_user_id').references(() => users.id).notNull(), // Student mentee
  tutorInstitutionId: integer('tutor_institution_id').references(() => institutions.id).notNull(),
  menteeInstitutionId: integer('mentee_institution_id').references(() => institutions.id).notNull(),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  matchScore: decimal('match_score', { precision: 5, scale: 2 }), // Algorithm confidence score
  status: matchStatusEnum('status').notNull().default('pending'),
  proposedBy: varchar('proposed_by', { length: 20 }), // 'algorithm' | 'coordinator' | 'manual'
  requestedSubjects: text('requested_subjects'), // What mentee needs help with
  matchReason: text('match_reason'), // Why they were matched
  acceptedByTutor: boolean('accepted_by_tutor').default(false),
  acceptedByMentee: boolean('accepted_by_mentee').default(false),
  acceptedAt: timestamp('accepted_at'),
  rejectionReason: text('rejection_reason'),
  startedAt: timestamp('started_at'), // When they started sessions
  completedAt: timestamp('completed_at'),
  totalSessions: integer('total_sessions').default(0),
  impactScore: decimal('impact_score', { precision: 5, scale: 2 }), // Social impact metric
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type EarningsAdjustment = typeof earningsAdjustments.$inferSelect;
export type NewEarningsAdjustment = typeof earningsAdjustments.$inferInsert;

export type StudentNote = typeof studentNotes.$inferSelect;
export type NewStudentNote = typeof studentNotes.$inferInsert;

export type Institution = typeof institutions.$inferSelect;
export type NewInstitution = typeof institutions.$inferInsert;

export type Partnership = typeof partnerships.$inferSelect;
export type NewPartnership = typeof partnerships.$inferInsert;

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type NewCreditTransaction = typeof creditTransactions.$inferInsert;

export type MatchingPreference = typeof matchingPreferences.$inferSelect;
export type NewMatchingPreference = typeof matchingPreferences.$inferInsert;

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;

// Additional relations
export const usersRelations = relations(users, ({ one, many }) => ({
  tutor: one(tutors, {
    fields: [users.tutorId],
    references: [tutors.id],
  }),
  institution: one(institutions, {
    fields: [users.institutionId],
    references: [institutions.id],
  }),
  bookingsAsStudent: many(bookings),
  reviews: many(reviews),
  sentMessages: many(messages),
  creditTransactions: many(creditTransactions),
  matchingPreference: one(matchingPreferences),
  matchesAsTutor: many(matches, { relationName: 'tutorMatches' }),
  matchesAsMentee: many(matches, { relationName: 'menteeMatches' }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  student: one(users, {
    fields: [bookings.studentId],
    references: [users.id],
  }),
  tutor: one(tutors, {
    fields: [bookings.tutorId],
    references: [tutors.id],
  }),
  review: one(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  student: one(users, {
    fields: [reviews.studentId],
    references: [users.id],
  }),
  tutor: one(tutors, {
    fields: [reviews.tutorId],
    references: [tutors.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
  }),
}));

export const earningsAdjustmentsRelations = relations(earningsAdjustments, ({ one }) => ({
  tutor: one(tutors, {
    fields: [earningsAdjustments.tutorId],
    references: [tutors.id],
  }),
  creator: one(users, {
    fields: [earningsAdjustments.createdBy],
    references: [users.id],
  }),
}));

// New table relations
export const institutionsRelations = relations(institutions, ({ one, many }) => ({
  country: one(countries, {
    fields: [institutions.countryId],
    references: [countries.id],
  }),
  users: many(users),
  partnerships: many(partnerships),
  creditTransactions: many(creditTransactions),
  matchesAsTutorInstitution: many(matches, { relationName: 'tutorInstitutionMatches' }),
  matchesAsMenteeInstitution: many(matches, { relationName: 'menteeInstitutionMatches' }),
}));

export const partnershipsRelations = relations(partnerships, ({ one }) => ({
  institution: one(institutions, {
    fields: [partnerships.institutionId],
    references: [institutions.id],
  }),
}));

export const creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
  user: one(users, {
    fields: [creditTransactions.userId],
    references: [users.id],
  }),
  institution: one(institutions, {
    fields: [creditTransactions.institutionId],
    references: [institutions.id],
  }),
  booking: one(bookings, {
    fields: [creditTransactions.bookingId],
    references: [bookings.id],
  }),
  reviewer: one(users, {
    fields: [creditTransactions.reviewedBy],
    references: [users.id],
  }),
}));

export const matchingPreferencesRelations = relations(matchingPreferences, ({ one }) => ({
  user: one(users, {
    fields: [matchingPreferences.userId],
    references: [users.id],
  }),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  tutorUser: one(users, {
    fields: [matches.tutorUserId],
    references: [users.id],
    relationName: 'tutorMatches',
  }),
  menteeUser: one(users, {
    fields: [matches.menteeUserId],
    references: [users.id],
    relationName: 'menteeMatches',
  }),
  tutorInstitution: one(institutions, {
    fields: [matches.tutorInstitutionId],
    references: [institutions.id],
    relationName: 'tutorInstitutionMatches',
  }),
  menteeInstitution: one(institutions, {
    fields: [matches.menteeInstitutionId],
    references: [institutions.id],
    relationName: 'menteeInstitutionMatches',
  }),
  subject: one(subjects, {
    fields: [matches.subjectId],
    references: [subjects.id],
  }),
}));
