import { pgTable, serial, text, varchar, timestamp, integer, boolean, pgEnum, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('user_role', ['student', 'tutor', 'admin']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'completed', 'cancelled']);
export const specializationEnum = pgEnum('specialization', ['Conversational', 'Business', 'Test Preparation', 'Academic', 'Kids & Teens', 'Job Interview']);
export const levelEnum = pgEnum('tutor_level', ['Beginner', 'Intermediate', 'Advanced', 'Native']);

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
  // OAuth fields
  googleId: varchar('google_id', { length: 255 }).unique(),
  authProvider: varchar('auth_provider', { length: 50 }).default('local'), // 'local' | 'google'
  emailVerified: boolean('email_verified').default(false),
  // End OAuth fields
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Bookings table
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

// Additional relations
export const usersRelations = relations(users, ({ one, many }) => ({
  tutor: one(tutors, {
    fields: [users.tutorId],
    references: [tutors.id],
  }),
  bookingsAsStudent: many(bookings),
  reviews: many(reviews),
  sentMessages: many(messages),
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
