/**
 * EducatePro Service Layer
 * Handles all API calls for courses, lessons, mentors, bookings, quizzes, etc.
 */

import api from './api';
import {
  ApiResponse,
  PaginatedResponse,
  Course,
  CourseDetail,
  Lesson,
  LessonDetail,
  Mentor,
  MentorProfile,
  Quiz,
  QuizAttempt,
  Assignment,
  AssignmentSubmission,
  Certificate,
  Review,
  Bookmark,
  Notification,
  Message,
  Conversation,
  Enrollment,
  PaymentMethod,
  Transaction,
  LeaderboardEntry,
  MentorSession,
  TimeSlot,
  CreateCourseForm,
  EditProfileForm,
} from '../types/educatepro.types';

class EducateProService {
  // ============ COURSES ============

  /**
   * Get all courses with pagination and filtering
   */
  async getCourses(page = 1, limit = 10, filters?: any): Promise<PaginatedResponse<Course>> {
    const response = await api.get<PaginatedResponse<Course>>('/courses', {
      params: { page, limit, ...filters },
    });
    return response.data;
  }

  /**
   * Get course by ID with full details
   */
  async getCourseDetail(courseId: string): Promise<ApiResponse<CourseDetail>> {
    const response = await api.get<ApiResponse<CourseDetail>>(`/courses/${courseId}`);
    return response.data;
  }

  /**
   * Search courses
   */
  async searchCourses(
    query: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Course>> {
    const response = await api.get<PaginatedResponse<Course>>('/courses/search', {
      params: { q: query, page, limit },
    });
    return response.data;
  }

  /**
   * Get courses by category
   */
  async getCoursesByCategory(
    category: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Course>> {
    const response = await api.get<PaginatedResponse<Course>>(
      `/courses/category/${category}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  }

  /**
   * Create new course
   */
  async createCourse(courseData: CreateCourseForm): Promise<ApiResponse<Course>> {
    const response = await api.post<ApiResponse<Course>>('/courses', courseData);
    return response.data;
  }

  /**
   * Update course
   */
  async updateCourse(courseId: string, courseData: Partial<CreateCourseForm>): Promise<ApiResponse<Course>> {
    const response = await api.put<ApiResponse<Course>>(`/courses/${courseId}`, courseData);
    return response.data;
  }

  /**
   * Delete course
   */
  async deleteCourse(courseId: string): Promise<ApiResponse<{ success: boolean }>> {
    const response = await api.delete<ApiResponse<{ success: boolean }>>(`/courses/${courseId}`);
    return response.data;
  }

  // ============ LESSONS ============

  /**
   * Get lessons for a course
   */
  async getCourseLessons(courseId: string): Promise<ApiResponse<Lesson[]>> {
    const response = await api.get<ApiResponse<Lesson[]>>(`/courses/${courseId}/lessons`);
    return response.data;
  }

  /**
   * Get lesson detail by ID
   */
  async getLessonDetail(lessonId: string): Promise<ApiResponse<LessonDetail>> {
    const response = await api.get<ApiResponse<LessonDetail>>(`/lessons/${lessonId}`);
    return response.data;
  }

  /**
   * Mark lesson as completed
   */
  async markLessonComplete(lessonId: string): Promise<ApiResponse<Lesson>> {
    const response = await api.post<ApiResponse<Lesson>>(`/lessons/${lessonId}/complete`);
    return response.data;
  }

  /**
   * Update lesson watch progress
   */
  async updateLessonProgress(lessonId: string, watchedDuration: number): Promise<ApiResponse<Lesson>> {
    const response = await api.post<ApiResponse<Lesson>>(`/lessons/${lessonId}/progress`, {
      watchedDuration,
    });
    return response.data;
  }

  // ============ MENTORS ============

  /**
   * Get all mentors with pagination
   */
  async getMentors(page = 1, limit = 10): Promise<PaginatedResponse<Mentor>> {
    const response = await api.get<PaginatedResponse<Mentor>>('/mentors', {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Get mentor by ID with full profile
   */
  async getMentorProfile(mentorId: string): Promise<ApiResponse<MentorProfile>> {
    const response = await api.get<ApiResponse<MentorProfile>>(`/mentors/${mentorId}`);
    return response.data;
  }

  /**
   * Search mentors
   */
  async searchMentors(
    query: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Mentor>> {
    const response = await api.get<PaginatedResponse<Mentor>>('/mentors/search', {
      params: { q: query, page, limit },
    });
    return response.data;
  }

  /**
   * Get mentors by specialization
   */
  async getMentorsBySpecialization(
    specialization: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Mentor>> {
    const response = await api.get<PaginatedResponse<Mentor>>(
      `/mentors/specialization/${specialization}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  }

  /**
   * Get top mentors by rating
   */
  async getTopMentors(limit = 10): Promise<ApiResponse<Mentor[]>> {
    const response = await api.get<ApiResponse<Mentor[]>>('/mentors/top', {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Follow/unfollow a mentor
   */
  async toggleFollowMentor(mentorId: string): Promise<ApiResponse<{ isFollowing: boolean }>> {
    const response = await api.post<ApiResponse<{ isFollowing: boolean }>>(
      `/mentors/${mentorId}/toggle-follow`
    );
    return response.data;
  }

  // ============ MENTOR SESSIONS & BOOKINGS ============

  /**
   * Get available time slots for a mentor
   */
  async getMentorTimeSlots(mentorId: string, date?: string): Promise<ApiResponse<TimeSlot[]>> {
    const response = await api.get<ApiResponse<TimeSlot[]>>(`/mentors/${mentorId}/time-slots`, {
      params: { date },
    });
    return response.data;
  }

  /**
   * Book a mentor session
   */
  async bookMentorSession(sessionData: {
    mentorId: string;
    timeSlotId: string;
    duration: number;
    courseId?: string;
  }): Promise<ApiResponse<MentorSession>> {
    const response = await api.post<ApiResponse<MentorSession>>(
      '/mentor-sessions/book',
      sessionData
    );
    return response.data;
  }

  /**
   * Get mentor sessions for current user
   */
  async getMentorSessions(status?: string): Promise<ApiResponse<MentorSession[]>> {
    const response = await api.get<ApiResponse<MentorSession[]>>('/mentor-sessions', {
      params: { status },
    });
    return response.data;
  }

  /**
   * Cancel a mentor session
   */
  async cancelMentorSession(sessionId: string): Promise<ApiResponse<MentorSession>> {
    const response = await api.post<ApiResponse<MentorSession>>(
      `/mentor-sessions/${sessionId}/cancel`
    );
    return response.data;
  }

  // ============ QUIZZES & ASSESSMENTS ============

  /**
   * Get quiz by ID
   */
  async getQuiz(quizId: string): Promise<ApiResponse<Quiz>> {
    const response = await api.get<ApiResponse<Quiz>>(`/quizzes/${quizId}`);
    return response.data;
  }

  /**
   * Get lesson quizzes
   */
  async getLessonQuizzes(lessonId: string): Promise<ApiResponse<Quiz[]>> {
    const response = await api.get<ApiResponse<Quiz[]>>(`/lessons/${lessonId}/quizzes`);
    return response.data;
  }

  /**
   * Submit quiz answers
   */
  async submitQuiz(quizId: string, answers: Record<string, string>): Promise<ApiResponse<QuizAttempt>> {
    const response = await api.post<ApiResponse<QuizAttempt>>(`/quizzes/${quizId}/submit`, {
      answers,
    });
    return response.data;
  }

  /**
   * Get quiz attempts for current user
   */
  async getQuizAttempts(quizId: string): Promise<ApiResponse<QuizAttempt[]>> {
    const response = await api.get<ApiResponse<QuizAttempt[]>>(`/quizzes/${quizId}/attempts`);
    return response.data;
  }

  // ============ ASSIGNMENTS ============

  /**
   * Get assignment by ID
   */
  async getAssignment(assignmentId: string): Promise<ApiResponse<Assignment>> {
    const response = await api.get<ApiResponse<Assignment>>(`/assignments/${assignmentId}`);
    return response.data;
  }

  /**
   * Get lesson assignments
   */
  async getLessonAssignments(lessonId: string): Promise<ApiResponse<Assignment[]>> {
    const response = await api.get<ApiResponse<Assignment[]>>(
      `/lessons/${lessonId}/assignments`
    );
    return response.data;
  }

  /**
   * Submit assignment with file
   */
  async submitAssignment(assignmentId: string, formData: FormData): Promise<ApiResponse<AssignmentSubmission>> {
    const response = await api.post<ApiResponse<AssignmentSubmission>>(
      `/assignments/${assignmentId}/submit`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Get assignment submission
   */
  async getAssignmentSubmission(submissionId: string): Promise<ApiResponse<AssignmentSubmission>> {
    const response = await api.get<ApiResponse<AssignmentSubmission>>(
      `/submissions/${submissionId}`
    );
    return response.data;
  }

  // ============ CERTIFICATES ============

  /**
   * Get certificate by ID
   */
  async getCertificate(certificateId: string): Promise<ApiResponse<Certificate>> {
    const response = await api.get<ApiResponse<Certificate>>(`/certificates/${certificateId}`);
    return response.data;
  }

  /**
   * Get user certificates
   */
  async getUserCertificates(): Promise<ApiResponse<Certificate[]>> {
    const response = await api.get<ApiResponse<Certificate[]>>('/certificates');
    return response.data;
  }

  /**
   * Verify certificate authenticity
   */
  async verifyCertificate(certificateId: string): Promise<ApiResponse<{ isValid: boolean }>> {
    const response = await api.get<ApiResponse<{ isValid: boolean }>>(
      `/certificates/${certificateId}/verify`
    );
    return response.data;
  }

  /**
   * Download certificate as PDF
   */
  async downloadCertificatePDF(certificateId: string): Promise<Blob> {
    const response = await api.get(`/certificates/${certificateId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // ============ REVIEWS ============

  /**
   * Get reviews for course/mentor
   */
  async getReviews(
    entityType: 'course' | 'mentor',
    entityId: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Review>> {
    const response = await api.get<PaginatedResponse<Review>>(`/${entityType}s/${entityId}/reviews`, {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Submit review
   */
  async submitReview(
    entityType: 'course' | 'mentor',
    entityId: string,
    review: { rating: number; title: string; text: string }
  ): Promise<ApiResponse<Review>> {
    const response = await api.post<ApiResponse<Review>>(
      `/${entityType}s/${entityId}/reviews`,
      review
    );
    return response.data;
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId: string): Promise<ApiResponse<{ success: boolean }>> {
    const response = await api.delete<ApiResponse<{ success: boolean }>>(`/reviews/${reviewId}`);
    return response.data;
  }

  // ============ BOOKMARKS ============

  /**
   * Get user bookmarks
   */
  async getBookmarks(entityType?: 'course' | 'mentor'): Promise<ApiResponse<Bookmark[]>> {
    const response = await api.get<ApiResponse<Bookmark[]>>('/bookmarks', {
      params: { entityType },
    });
    return response.data;
  }

  /**
   * Toggle bookmark
   */
  async toggleBookmark(
    entityType: 'course' | 'mentor',
    entityId: string
  ): Promise<ApiResponse<{ isBookmarked: boolean }>> {
    const response = await api.post<ApiResponse<{ isBookmarked: boolean }>>(
      `/bookmarks/toggle`,
      { entityType, entityId }
    );
    return response.data;
  }

  /**
   * Check if entity is bookmarked
   */
  async isBookmarked(entityType: 'course' | 'mentor', entityId: string): Promise<ApiResponse<{ isBookmarked: boolean }>> {
    const response = await api.get<ApiResponse<{ isBookmarked: boolean }>>(
      `/bookmarks/check`,
      {
        params: { entityType, entityId },
      }
    );
    return response.data;
  }

  // ============ NOTIFICATIONS ============

  /**
   * Get notifications
   */
  async getNotifications(filter?: 'all' | 'unread' | 'archived'): Promise<ApiResponse<Notification[]>> {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications', {
      params: { filter },
    });
    return response.data;
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    const response = await api.post<ApiResponse<Notification>>(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  }

  /**
   * Archive notification
   */
  async archiveNotification(notificationId: string): Promise<ApiResponse<Notification>> {
    const response = await api.post<ApiResponse<Notification>>(
      `/notifications/${notificationId}/archive`
    );
    return response.data;
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<ApiResponse<{ success: boolean }>> {
    const response = await api.delete<ApiResponse<{ success: boolean }>>(
      `/notifications/${notificationId}`
    );
    return response.data;
  }

  // ============ MESSAGING ============

  /**
   * Get conversations
   */
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    const response = await api.get<ApiResponse<Conversation[]>>('/conversations');
    return response.data;
  }

  /**
   * Get conversation messages
   */
  async getConversationMessages(
    conversationId: string,
    page = 1,
    limit = 50
  ): Promise<PaginatedResponse<Message>> {
    const response = await api.get<PaginatedResponse<Message>>(
      `/conversations/${conversationId}/messages`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  }

  /**
   * Send message
   */
  async sendMessage(
    conversationId: string,
    message: { text: string; image?: string }
  ): Promise<ApiResponse<Message>> {
    const response = await api.post<ApiResponse<Message>>(
      `/conversations/${conversationId}/messages`,
      message
    );
    return response.data;
  }

  /**
   * Start conversation with user
   */
  async startConversation(userId: string): Promise<ApiResponse<Conversation>> {
    const response = await api.post<ApiResponse<Conversation>>('/conversations/start', {
      userId,
    });
    return response.data;
  }

  // ============ ENROLLMENTS ============

  /**
   * Get user enrollments
   */
  async getEnrollments(status?: 'active' | 'completed' | 'dropped'): Promise<ApiResponse<Enrollment[]>> {
    const response = await api.get<ApiResponse<Enrollment[]>>('/enrollments', {
      params: { status },
    });
    return response.data;
  }

  /**
   * Enroll in course
   */
  async enrollCourse(courseId: string): Promise<ApiResponse<Enrollment>> {
    const response = await api.post<ApiResponse<Enrollment>>('/enrollments', { courseId });
    return response.data;
  }

  /**
   * Get enrollment progress
   */
  async getEnrollmentProgress(enrollmentId: string): Promise<ApiResponse<Enrollment>> {
    const response = await api.get<ApiResponse<Enrollment>>(`/enrollments/${enrollmentId}`);
    return response.data;
  }

  // ============ PAYMENTS ============

  /**
   * Get payment methods
   */
  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    const response = await api.get<ApiResponse<PaymentMethod[]>>('/payment-methods');
    return response.data;
  }

  /**
   * Add payment method
   */
  async addPaymentMethod(paymentData: any): Promise<ApiResponse<PaymentMethod>> {
    const response = await api.post<ApiResponse<PaymentMethod>>(
      '/payment-methods',
      paymentData
    );
    return response.data;
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(paymentMethodId: string): Promise<ApiResponse<PaymentMethod>> {
    const response = await api.put<ApiResponse<PaymentMethod>>(
      `/payment-methods/${paymentMethodId}/default`
    );
    return response.data;
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(paymentMethodId: string): Promise<ApiResponse<{ success: boolean }>> {
    const response = await api.delete<ApiResponse<{ success: boolean }>>(
      `/payment-methods/${paymentMethodId}`
    );
    return response.data;
  }

  /**
   * Process payment
   */
  async processPayment(paymentData: {
    courseId: string;
    paymentMethodId: string;
    promoCode?: string;
  }): Promise<ApiResponse<Transaction>> {
    const response = await api.post<ApiResponse<Transaction>>('/payments/process', paymentData);
    return response.data;
  }

  /**
   * Get transaction history
   */
  async getTransactions(page = 1, limit = 10): Promise<PaginatedResponse<Transaction>> {
    const response = await api.get<PaginatedResponse<Transaction>>('/transactions', {
      params: { page, limit },
    });
    return response.data;
  }

  // ============ LEADERBOARD ============

  /**
   * Get leaderboard
   */
  async getLeaderboard(
    period: 'overall' | 'weekly' | 'monthly' = 'overall'
  ): Promise<ApiResponse<LeaderboardEntry[]>> {
    const response = await api.get<ApiResponse<LeaderboardEntry[]>>('/leaderboard', {
      params: { period },
    });
    return response.data;
  }

  /**
   * Get user rank
   */
  async getUserRank(period: 'overall' | 'weekly' | 'monthly' = 'overall'): Promise<ApiResponse<LeaderboardEntry>> {
    const response = await api.get<ApiResponse<LeaderboardEntry>>('/leaderboard/my-rank', {
      params: { period },
    });
    return response.data;
  }

  // ============ USER PROFILE ============

  /**
   * Update user profile
   */
  async updateProfile(profileData: EditProfileForm): Promise<ApiResponse<any>> {
    const response = await api.put<ApiResponse<any>>('/user/profile', profileData);
    return response.data;
  }

  /**
   * Upload profile avatar
   */
  async uploadAvatar(formData: FormData): Promise<ApiResponse<{ avatarUrl: string }>> {
    const response = await api.post<ApiResponse<{ avatarUrl: string }>>(
      '/user/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<ApiResponse<any>> {
    const response = await api.get<ApiResponse<any>>('/user/stats');
    return response.data;
  }
}

export default new EducateProService();
