/**
 * EducatePro TypeScript Type Definitions
 * Comprehensive types for all data models across the learning platform
 */

// ============ USER TYPES ============

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  role: 'student' | 'mentor' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  coursesEnrolled: number;
  coursesCompleted: number;
  totalHoursLearned: number;
  rating: number;
  reviewCount: number;
  bookmarks: number;
  followers: number;
  following: number;
}

// ============ COURSE TYPES ============

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  instructor: Instructor;
  thumbnail?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  duration: number; // in hours
  lessons: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetail extends Course {
  fullDescription: string;
  learnings: string[];
  requirements: string[];
  lessons: Lesson[];
  reviews: Review[];
  instructor: InstructorProfile;
  isEnrolled: boolean;
  isSaved: boolean;
  completionPercentage: number;
}

export type CourseCategory =
  | 'web_development'
  | 'mobile_development'
  | 'design'
  | 'business'
  | 'data_science'
  | 'marketing'
  | 'music'
  | 'photography'
  | 'other';

// ============ LESSON TYPES ============

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  videoDuration: number; // in seconds
  thumbnail?: string;
  order: number;
  resources: Resource[];
  transcript?: string;
  isCompleted: boolean;
  watchedDuration: number;
  createdAt: string;
  updatedAt: string;
}

export interface LessonDetail extends Lesson {
  nextLesson?: Lesson;
  previousLesson?: Lesson;
  relatedQuiz?: Quiz;
  relatedAssignment?: Assignment;
  analytics?: {
    avgWatchDuration: number;
    completionRate: number;
  };
}

export interface Resource {
  id: string;
  lessonId: string;
  title: string;
  type: 'pdf' | 'link' | 'file' | 'video';
  url: string;
  downloadable: boolean;
  fileSize?: number;
  createdAt: string;
}

// ============ MENTOR TYPES ============

export interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  rating: number;
  reviewCount: number;
}

export interface InstructorProfile extends Instructor {
  email: string;
  expertise: string[];
  experience: number; // years
  studentsCount: number;
  coursesCount: number;
  hourlyRate: number;
  bio: string;
  qualifications: Qualification[];
  experience_timeline: ExperienceItem[];
  reviews: Review[];
  courses: Course[];
}

export interface Mentor extends User {
  specialization: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  availability: TimeSlot[];
  students: number;
  courses: number;
  bio: string;
  isSaved: boolean;
}

export interface MentorProfile extends Mentor {
  qualifications: Qualification[];
  experience_timeline: ExperienceItem[];
  about: string;
  reviews: Review[];
  courses: Course[];
}

export interface Qualification {
  id: string;
  title: string;
  issuer: string;
  year: number;
  url?: string;
}

export interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
  isCurrent: boolean;
}

// ============ BOOKING & SESSION TYPES ============

export interface TimeSlot {
  id: string;
  mentorId: string;
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isBooked: boolean;
}

export interface MentorSession {
  id: string;
  mentorId: string;
  studentId: string;
  courseId?: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  price: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LiveSession extends MentorSession {
  participants: LiveSessionParticipant[];
  recordingUrl?: string;
  isRecording: boolean;
  activeParticipants: number;
}

export interface LiveSessionParticipant {
  id: string;
  sessionId: string;
  userId: string;
  user: User;
  joinedAt: string;
  leftAt?: string;
  isMuted: boolean;
  cameraOff: boolean;
  isHandRaised: boolean;
  role: 'instructor' | 'student';
}

// ============ QUIZ & ASSESSMENT TYPES ============

export interface Quiz {
  id: string;
  courseId?: string;
  lessonId?: string;
  title: string;
  description?: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number;
  attemptsAllowed: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: QuestionOption[];
  correctOptionId: string;
  points: number;
  order: number;
}

export interface QuestionOption {
  id: string;
  questionId: string;
  text: string;
  order: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  answers: QuizAnswer[];
  score: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  completedAt?: string;
  timeSpent: number; // in seconds
}

export interface QuizAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

// ============ ASSIGNMENT TYPES ============

export interface Assignment {
  id: string;
  courseId?: string;
  lessonId?: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string;
  points: number;
  fileRequired: boolean;
  maxFileSize: number; // in MB
  acceptedFormats: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrl: string;
  fileName: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  graderId?: string;
  gradedAt?: string;
  status: 'submitted' | 'graded' | 'returned';
}

// ============ CERTIFICATE TYPES ============

export interface Certificate {
  id: string;
  courseId: string;
  studentId: string;
  courseName: string;
  studentName: string;
  instructor: string;
  completionDate: string;
  certificateId: string;
  score: number;
  verificationUrl: string;
  issuedAt: string;
}

// ============ REVIEW TYPES ============

export interface Review {
  id: string;
  entityType: 'course' | 'mentor';
  entityId: string;
  studentId: string;
  student?: User;
  rating: number;
  title: string;
  text: string;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============ BOOKMARK TYPES ============

export interface Bookmark {
  id: string;
  userId: string;
  entityType: 'course' | 'mentor';
  entityId: string;
  entity?: Course | Mentor;
  createdAt: string;
}

// ============ NOTIFICATION TYPES ============

export interface Notification {
  id: string;
  userId: string;
  type:
    | 'course_update'
    | 'message'
    | 'payment'
    | 'assignment'
    | 'quiz'
    | 'session'
    | 'review'
    | 'promotion';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

// ============ MESSAGE TYPES ============

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  image?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  lastMessageTime: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============ ENROLLMENT TYPES ============

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  student?: User;
  course?: Course;
  status: 'active' | 'completed' | 'dropped';
  enrolledAt: string;
  completedAt?: string;
  progressPercentage: number;
  lessonsCompleted: number;
}

// ============ PAYMENT TYPES ============

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'credit_card' | 'paypal' | 'google_pay' | 'apple_pay';
  isDefault: boolean;
  last4: string;
  expiryDate?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: 'course_purchase' | 'mentor_session' | 'refund';
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethodId: string;
  courseId?: string;
  invoiceUrl?: string;
  createdAt: string;
  completedAt?: string;
}

// ============ LEADERBOARD TYPES ============

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  user: User;
  points: number;
  coursesCompleted: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  badge: string;
}

// ============ SETTINGS TYPES ============

export interface UserSettings {
  userId: string;
  language: string;
  region: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  courseUpdates: boolean;
  messages: boolean;
  promotions: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

// ============ API RESPONSE TYPES ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: Record<string, any>;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// ============ FORM TYPES ============

export interface CreateCourseForm {
  title: string;
  description: string;
  category: CourseCategory;
  thumbnail?: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  language: string;
  learnings: string[];
  requirements: string[];
  isDraft: boolean;
}

export interface EditProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  bio?: string;
}

export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}
