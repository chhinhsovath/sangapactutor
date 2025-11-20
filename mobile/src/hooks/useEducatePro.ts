/**
 * Custom React Hooks for EducatePro API Integration
 * Handles data fetching, caching, and state management
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import educateProService from '../services/educatepro.service';
import {
  Course,
  CourseDetail,
  Lesson,
  LessonDetail,
  Mentor,
  MentorProfile,
  Quiz,
  QuizAttempt,
  Assignment,
  Certificate,
  Review,
  Bookmark,
  Notification,
  Conversation,
  Enrollment,
  LeaderboardEntry,
  MentorSession,
  TimeSlot,
  PaymentMethod,
  Transaction,
} from '../types/educatepro.types';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseAsyncOptions {
  skip?: boolean;
  cacheKey?: string;
  cacheDuration?: number; // in milliseconds
}

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();

const getCachedData = (key: string, duration: number): any | null => {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > duration) {
    cache.delete(key);
    return null;
  }
  return cached.data;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Generic async hook
const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  options: UseAsyncOptions = {}
): UseAsyncState<T> => {
  const { skip = false, cacheKey, cacheDuration = 5 * 60 * 1000 } = options;
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: !skip,
    error: null,
    refetch: async () => {},
  });

  const refetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      let data: T;

      if (cacheKey) {
        const cached = getCachedData(cacheKey, cacheDuration);
        if (cached) {
          data = cached;
        } else {
          data = await asyncFunction();
          setCachedData(cacheKey, data);
        }
      } else {
        data = await asyncFunction();
      }

      setState({ data, loading: false, error: null, refetch });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
        refetch,
      });
    }
  }, [asyncFunction, cacheKey, cacheDuration]);

  useEffect(() => {
    if (!skip && immediate) {
      refetch();
    }
  }, [skip, immediate, refetch]);

  return { ...state, refetch };
};

// ============ COURSE HOOKS ============

export const useCourses = (page = 1, limit = 10) => {
  return useAsync(
    () => educateProService.getCourses(page, limit),
    true,
    { cacheKey: `courses-${page}-${limit}` }
  );
};

export const useCourseDetail = (courseId: string) => {
  return useAsync(
    () => educateProService.getCourseDetail(courseId),
    true,
    { cacheKey: `course-${courseId}` }
  );
};

export const useCourseSearch = (query: string, page = 1, limit = 10) => {
  return useAsync(
    () => educateProService.searchCourses(query, page, limit),
    !!query,
    { cacheKey: `search-courses-${query}-${page}-${limit}` }
  );
};

export const useCoursesByCategory = (category: string, page = 1, limit = 10) => {
  return useAsync(
    () => educateProService.getCoursesByCategory(category, page, limit),
    true,
    { cacheKey: `courses-category-${category}-${page}-${limit}` }
  );
};

// ============ LESSON HOOKS ============

export const useCourseLessons = (courseId: string) => {
  return useAsync(
    () => educateProService.getCourseLessons(courseId),
    !!courseId,
    { cacheKey: `lessons-${courseId}` }
  );
};

export const useLessonDetail = (lessonId: string) => {
  return useAsync(
    () => educateProService.getLessonDetail(lessonId),
    !!lessonId,
    { cacheKey: `lesson-${lessonId}` }
  );
};

// ============ MENTOR HOOKS ============

export const useMentors = (page = 1, limit = 10) => {
  return useAsync(
    () => educateProService.getMentors(page, limit),
    true,
    { cacheKey: `mentors-${page}-${limit}` }
  );
};

export const useMentorProfile = (mentorId: string) => {
  return useAsync(
    () => educateProService.getMentorProfile(mentorId),
    !!mentorId,
    { cacheKey: `mentor-${mentorId}` }
  );
};

export const useMentorSearch = (query: string, page = 1, limit = 10) => {
  return useAsync(
    () => educateProService.searchMentors(query, page, limit),
    !!query,
    { cacheKey: `search-mentors-${query}-${page}-${limit}` }
  );
};

export const useMentorsBySpecialization = (specialization: string, page = 1, limit = 10) => {
  return useAsync(
    () => educateProService.getMentorsBySpecialization(specialization, page, limit),
    !!specialization,
    { cacheKey: `mentors-spec-${specialization}-${page}-${limit}` }
  );
};

export const useTopMentors = (limit = 10) => {
  return useAsync(
    () => educateProService.getTopMentors(limit),
    true,
    { cacheKey: `top-mentors-${limit}`, cacheDuration: 10 * 60 * 1000 }
  );
};

// ============ MENTOR SESSIONS HOOKS ============

export const useMentorTimeSlots = (mentorId: string, date?: string) => {
  return useAsync(
    () => educateProService.getMentorTimeSlots(mentorId, date),
    !!mentorId,
    { cacheKey: `time-slots-${mentorId}-${date}` }
  );
};

export const useMentorSessions = (status?: string) => {
  return useAsync(
    () => educateProService.getMentorSessions(status),
    true,
    { cacheKey: `mentor-sessions-${status}`, cacheDuration: 2 * 60 * 1000 }
  );
};

// ============ QUIZ HOOKS ============

export const useQuiz = (quizId: string) => {
  return useAsync(
    () => educateProService.getQuiz(quizId),
    !!quizId,
    { cacheKey: `quiz-${quizId}` }
  );
};

export const useLessonQuizzes = (lessonId: string) => {
  return useAsync(
    () => educateProService.getLessonQuizzes(lessonId),
    !!lessonId,
    { cacheKey: `quizzes-${lessonId}` }
  );
};

export const useQuizAttempts = (quizId: string) => {
  return useAsync(
    () => educateProService.getQuizAttempts(quizId),
    !!quizId,
    { cacheKey: `quiz-attempts-${quizId}`, cacheDuration: 2 * 60 * 1000 }
  );
};

// ============ ASSIGNMENT HOOKS ============

export const useAssignment = (assignmentId: string) => {
  return useAsync(
    () => educateProService.getAssignment(assignmentId),
    !!assignmentId,
    { cacheKey: `assignment-${assignmentId}` }
  );
};

export const useLessonAssignments = (lessonId: string) => {
  return useAsync(
    () => educateProService.getLessonAssignments(lessonId),
    !!lessonId,
    { cacheKey: `assignments-${lessonId}` }
  );
};

// ============ CERTIFICATE HOOKS ============

export const useCertificate = (certificateId: string) => {
  return useAsync(
    () => educateProService.getCertificate(certificateId),
    !!certificateId,
    { cacheKey: `certificate-${certificateId}` }
  );
};

export const useUserCertificates = () => {
  return useAsync(
    () => educateProService.getUserCertificates(),
    true,
    { cacheKey: 'user-certificates' }
  );
};

// ============ REVIEWS HOOKS ============

export const useReviews = (entityType: 'course' | 'mentor', entityId: string, page = 1, limit = 10) => {
  return useAsync(
    () => educateProService.getReviews(entityType, entityId, page, limit),
    !!entityId,
    { cacheKey: `reviews-${entityType}-${entityId}-${page}-${limit}` }
  );
};

// ============ BOOKMARKS HOOKS ============

export const useBookmarks = (entityType?: 'course' | 'mentor') => {
  return useAsync(
    () => educateProService.getBookmarks(entityType),
    true,
    { cacheKey: `bookmarks-${entityType}`, cacheDuration: 2 * 60 * 1000 }
  );
};

export const useIsBookmarked = (entityType: 'course' | 'mentor', entityId: string) => {
  return useAsync(
    () => educateProService.isBookmarked(entityType, entityId),
    !!entityId,
    { cacheKey: `is-bookmarked-${entityType}-${entityId}`, cacheDuration: 1 * 60 * 1000 }
  );
};

// ============ NOTIFICATIONS HOOKS ============

export const useNotifications = (filter?: 'all' | 'unread' | 'archived') => {
  return useAsync(
    () => educateProService.getNotifications(filter),
    true,
    { cacheKey: `notifications-${filter}`, cacheDuration: 30 * 1000 }
  );
};

// ============ MESSAGING HOOKS ============

export const useConversations = () => {
  return useAsync(
    () => educateProService.getConversations(),
    true,
    { cacheKey: 'conversations', cacheDuration: 2 * 60 * 1000 }
  );
};

export const useConversationMessages = (conversationId: string, page = 1, limit = 50) => {
  return useAsync(
    () => educateProService.getConversationMessages(conversationId, page, limit),
    !!conversationId,
    { cacheKey: `messages-${conversationId}-${page}-${limit}` }
  );
};

// ============ ENROLLMENT HOOKS ============

export const useEnrollments = (status?: 'active' | 'completed' | 'dropped') => {
  return useAsync(
    () => educateProService.getEnrollments(status),
    true,
    { cacheKey: `enrollments-${status}`, cacheDuration: 2 * 60 * 1000 }
  );
};

export const useEnrollmentProgress = (enrollmentId: string) => {
  return useAsync(
    () => educateProService.getEnrollmentProgress(enrollmentId),
    !!enrollmentId,
    { cacheKey: `enrollment-progress-${enrollmentId}`, cacheDuration: 1 * 60 * 1000 }
  );
};

// ============ PAYMENT HOOKS ============

export const usePaymentMethods = () => {
  return useAsync(
    () => educateProService.getPaymentMethods(),
    true,
    { cacheKey: 'payment-methods', cacheDuration: 5 * 60 * 1000 }
  );
};

export const useTransactions = (page = 1, limit = 10) => {
  return useAsync(
    () => educateProService.getTransactions(page, limit),
    true,
    { cacheKey: `transactions-${page}-${limit}`, cacheDuration: 5 * 60 * 1000 }
  );
};

// ============ LEADERBOARD HOOKS ============

export const useLeaderboard = (period: 'overall' | 'weekly' | 'monthly' = 'overall') => {
  return useAsync(
    () => educateProService.getLeaderboard(period),
    true,
    { cacheKey: `leaderboard-${period}`, cacheDuration: 10 * 60 * 1000 }
  );
};

export const useUserRank = (period: 'overall' | 'weekly' | 'monthly' = 'overall') => {
  return useAsync(
    () => educateProService.getUserRank(period),
    true,
    { cacheKey: `user-rank-${period}`, cacheDuration: 5 * 60 * 1000 }
  );
};

// ============ MUTATION HOOKS ============

export const useMutateBookmark = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toggleBookmark = useCallback(
    async (entityType: 'course' | 'mentor', entityId: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await educateProService.toggleBookmark(entityType, entityId);
        // Clear cache
        cache.delete(`bookmarks-${entityType}`);
        cache.delete(`is-bookmarked-${entityType}-${entityId}`);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { toggleBookmark, loading, error };
};

export const useMutateQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitQuiz = useCallback(
    async (quizId: string, answers: Record<string, string>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await educateProService.submitQuiz(quizId, answers);
        // Clear cache
        cache.delete(`quiz-attempts-${quizId}`);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { submitQuiz, loading, error };
};

export const useMutateEnrollment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enrollCourse = useCallback(
    async (courseId: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await educateProService.enrollCourse(courseId);
        // Clear cache
        cache.delete('enrollments-active');
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { enrollCourse, loading, error };
};

export const useMutateMentorSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bookSession = useCallback(
    async (sessionData: {
      mentorId: string;
      timeSlotId: string;
      duration: number;
      courseId?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await educateProService.bookMentorSession(sessionData);
        // Clear cache
        cache.delete('mentor-sessions-scheduled');
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { bookSession, loading, error };
};

export const useMutateMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(
    async (conversationId: string, message: { text: string; image?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await educateProService.sendMessage(conversationId, message);
        // Clear cache
        cache.delete(`messages-${conversationId}-1-50`);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { sendMessage, loading, error };
};
