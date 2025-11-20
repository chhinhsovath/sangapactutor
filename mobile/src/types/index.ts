// User types
export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: 'student' | 'tutor' | 'admin' | 'institution_admin' | 'faculty_coordinator' | 'student_coordinator' | 'verified_tutor' | 'mentee' | 'institution_viewer' | 'super_admin' | 'partner_manager';
    tutorId: number | null;
    institutionId: number | null;
    studentId: string | null;
    creditBalance: string;
    academicYear: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Tutor types
export interface Tutor {
    id: number;
    firstName: string;
    lastName: string;
    slug: string;
    avatar: string | null;
    subjectId: number;
    countryId: number;
    specialization: 'Conversational' | 'Business' | 'Test Preparation' | 'Academic' | 'Kids & Teens' | 'Job Interview';
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
    hourlyRate: string;
    rating: string;
    totalReviews: number;
    totalLessons: number;
    yearsExperience: number;
    bio: string;
    bioKh: string | null;
    bioEn: string | null;
    teachingStyle: string | null;
    teachingStyleKh: string | null;
    teachingStyleEn: string | null;
    spokenLanguages: string | null;
    videoIntro: string | null;
    availability: string | null;
    isVerified: boolean;
    isActive: boolean;
    subject?: Subject;
    country?: Country;
}

// Subject types
export interface Subject {
    id: number;
    name: string;
    nameKh: string | null;
    nameEn: string | null;
    slug: string;
    icon: string | null;
}

// Country types
export interface Country {
    id: number;
    name: string;
    nameKh: string | null;
    nameEn: string | null;
    code: string;
    flag: string | null;
}

// Booking types
export interface Booking {
    id: number;
    studentId: number;
    tutorId: number;
    scheduledAt: string;
    duration: number;
    price: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes: string | null;
    meetingLink: string | null;
    isCreditEligible: boolean;
    sessionType: 'tutoring' | 'mentoring' | 'counseling' | 'workshop';
    creditValue: string;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    tutor?: Tutor;
    student?: User;
}

// Message types
export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    message: string;
    isRead: boolean;
    createdAt: string;
    sender?: User;
    receiver?: User;
}

// Conversation types
export interface Conversation {
    userId: number;
    user: User;
    lastMessage: Message;
    unreadCount: number;
}

// Auth types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'student' | 'tutor';
    institutionId?: number;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

// API Response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

// Filter types
export interface TutorFilters {
    subjectId?: number;
    countryId?: number;
    specialization?: string;
    level?: string;
    minRate?: number;
    maxRate?: number;
    page?: number;
    limit?: number;
}
