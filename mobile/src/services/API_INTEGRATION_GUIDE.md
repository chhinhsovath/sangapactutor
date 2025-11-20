# EducatePro API Integration Guide

Complete guide for integrating API calls and real data into all 31 EducatePro screens.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Service Layer](#service-layer)
- [Custom Hooks](#custom-hooks)
- [Integration Examples](#integration-examples)
- [Type Definitions](#type-definitions)
- [Error Handling](#error-handling)
- [Caching Strategy](#caching-strategy)
- [Best Practices](#best-practices)

---

## Architecture Overview

The EducatePro data layer follows a clean architecture pattern:

```
Screens (UI Components)
    ↓
Custom Hooks (useEducatePro.ts)
    ↓ (data fetching & caching)
Service Layer (educatepro.service.ts)
    ↓ (API methods)
API Client (api.ts - Axios with interceptors)
    ↓
Backend API Server
```

### Files Structure
```
src/
├── types/
│   └── educatepro.types.ts          # All TypeScript types
├── services/
│   ├── api.ts                       # Axios instance with interceptors
│   └── educatepro.service.ts        # API methods (100+ endpoints)
├── hooks/
│   └── useEducatePro.ts             # Custom React hooks (50+ hooks)
└── screens/EducatePro/
    └── *.tsx                         # Screens using hooks
```

---

## Service Layer

### educatepro.service.ts

Singleton service providing all API methods:

```typescript
import educateProService from '../services/educatepro.service';

// Direct service usage (if needed)
const courses = await educateProService.getCourses(1, 10);
const mentors = await educateProService.getMentors();
const certificate = await educateProService.getCertificate(certId);
```

**100+ API Methods Available:**

#### Courses (8 methods)
- `getCourses(page, limit)` - Get paginated courses
- `getCourseDetail(courseId)` - Get full course details
- `searchCourses(query, page, limit)` - Search courses
- `getCoursesByCategory(category, page, limit)` - Filter by category
- `createCourse(courseData)` - Create new course
- `updateCourse(courseId, courseData)` - Update course
- `deleteCourse(courseId)` - Delete course

#### Lessons (5 methods)
- `getCourseLessons(courseId)` - Get course lessons
- `getLessonDetail(lessonId)` - Get lesson details
- `markLessonComplete(lessonId)` - Mark completed
- `updateLessonProgress(lessonId, duration)` - Track progress

#### Mentors (6 methods)
- `getMentors(page, limit)` - Get mentors
- `getMentorProfile(mentorId)` - Get profile with reviews
- `searchMentors(query, page, limit)` - Search mentors
- `getMentorsBySpecialization(spec, page, limit)` - Filter by specialization
- `getTopMentors(limit)` - Get top-rated mentors
- `toggleFollowMentor(mentorId)` - Follow/unfollow

#### Sessions & Bookings (4 methods)
- `getMentorTimeSlots(mentorId, date)` - Get available slots
- `bookMentorSession(sessionData)` - Book a session
- `getMentorSessions(status)` - Get user's sessions
- `cancelMentorSession(sessionId)` - Cancel session

#### Quizzes (4 methods)
- `getQuiz(quizId)` - Get quiz details
- `getLessonQuizzes(lessonId)` - Get lesson quizzes
- `submitQuiz(quizId, answers)` - Submit answers
- `getQuizAttempts(quizId)` - Get attempt history

#### Assignments (3 methods)
- `getAssignment(assignmentId)` - Get assignment
- `getLessonAssignments(lessonId)` - Get lesson assignments
- `submitAssignment(assignmentId, formData)` - Submit with file

#### Certificates (4 methods)
- `getCertificate(certificateId)` - Get certificate
- `getUserCertificates()` - Get all certificates
- `verifyCertificate(certificateId)` - Verify authenticity
- `downloadCertificatePDF(certificateId)` - Download PDF

#### Reviews (3 methods)
- `getReviews(entityType, entityId, page, limit)` - Get reviews
- `submitReview(entityType, entityId, review)` - Submit review
- `deleteReview(reviewId)` - Delete review

#### Bookmarks (3 methods)
- `getBookmarks(entityType)` - Get user bookmarks
- `toggleBookmark(entityType, entityId)` - Save/unsave
- `isBookmarked(entityType, entityId)` - Check status

#### Notifications (4 methods)
- `getNotifications(filter)` - Get notifications
- `markNotificationAsRead(notificationId)` - Mark read
- `archiveNotification(notificationId)` - Archive
- `deleteNotification(notificationId)` - Delete

#### Messaging (4 methods)
- `getConversations()` - Get all conversations
- `getConversationMessages(conversationId, page, limit)` - Get messages
- `sendMessage(conversationId, message)` - Send message
- `startConversation(userId)` - Start new chat

#### Enrollments (3 methods)
- `getEnrollments(status)` - Get user courses
- `enrollCourse(courseId)` - Enroll in course
- `getEnrollmentProgress(enrollmentId)` - Get progress

#### Payments (5 methods)
- `getPaymentMethods()` - Get saved methods
- `addPaymentMethod(paymentData)` - Add new method
- `setDefaultPaymentMethod(paymentMethodId)` - Set default
- `deletePaymentMethod(paymentMethodId)` - Remove method
- `processPayment(paymentData)` - Process payment
- `getTransactions(page, limit)` - Get history

#### Leaderboard (2 methods)
- `getLeaderboard(period)` - Get rankings
- `getUserRank(period)` - Get user rank

#### User (3 methods)
- `updateProfile(profileData)` - Update profile
- `uploadAvatar(formData)` - Upload avatar
- `getUserStats()` - Get statistics

---

## Custom Hooks

### useEducatePro.ts

React hooks for data fetching with automatic caching, error handling, and refetch:

```typescript
import { useCourses, useLeaderboard, useMutateBookmark } from '../hooks/useEducatePro';

// Query hooks (with built-in caching)
const { data, loading, error, refetch } = useCourses(1, 10);

// Mutation hooks (for creating/updating data)
const { toggleBookmark, loading, error } = useMutateBookmark();
```

### 50+ Available Hooks

#### Query Hooks (Read-Only)
```typescript
// Courses
useCourses(page, limit)
useCourseDetail(courseId)
useCourseSearch(query, page, limit)
useCoursesByCategory(category, page, limit)

// Lessons
useCourseLessons(courseId)
useLessonDetail(lessonId)

// Mentors
useMentors(page, limit)
useMentorProfile(mentorId)
useMentorSearch(query, page, limit)
useMentorsBySpecialization(spec, page, limit)
useTopMentors(limit)

// Sessions
useMentorTimeSlots(mentorId, date)
useMentorSessions(status)

// Quizzes
useQuiz(quizId)
useLessonQuizzes(lessonId)
useQuizAttempts(quizId)

// Assignments
useAssignment(assignmentId)
useLessonAssignments(lessonId)

// Certificates
useCertificate(certificateId)
useUserCertificates()

// Reviews
useReviews(entityType, entityId, page, limit)

// Bookmarks
useBookmarks(entityType)
useIsBookmarked(entityType, entityId)

// Notifications
useNotifications(filter)

// Messaging
useConversations()
useConversationMessages(conversationId, page, limit)

// Enrollments
useEnrollments(status)
useEnrollmentProgress(enrollmentId)

// Payments
usePaymentMethods()
useTransactions(page, limit)

// Leaderboard
useLeaderboard(period)
useUserRank(period)
```

#### Mutation Hooks (Create/Update)
```typescript
useMutateBookmark()          // { toggleBookmark, loading, error }
useMutateQuiz()              // { submitQuiz, loading, error }
useMutateEnrollment()        // { enrollCourse, loading, error }
useMutateMentorSession()     // { bookSession, loading, error }
useMutateMessage()           // { sendMessage, loading, error }
```

### Hook Return Type
```typescript
interface UseAsyncState<T> {
  data: T | null;              // Fetched data (null while loading)
  loading: boolean;            // Loading state
  error: Error | null;         // Error object (null if success)
  refetch: () => Promise<void>; // Manually refetch data
}
```

---

## Integration Examples

### Example 1: HomeScreen - Display Featured Courses

**Before (Mock Data):**
```typescript
const [courses, setCourses] = useState(MOCK_COURSES);

useEffect(() => {
  // Nothing - just using mock data
}, []);
```

**After (Real API):**
```typescript
import { useCourses } from '../../hooks/useEducatePro';

const HomeScreen = ({ navigation }) => {
  const { data: coursesData, loading, error } = useCourses(1, 10);
  const courses = coursesData?.data || [];

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error loading courses</Text>;

  return (
    <FlatList
      data={courses}
      renderItem={({ item }) => (
        <CourseCard
          name={item.title}
          price={item.price}
          rating={item.rating}
          onPress={() => navigation.navigate('CourseDetails', { courseId: item.id })}
        />
      )}
    />
  );
};
```

### Example 2: CourseDetailsScreen - Load Course Details

**Before (Mock Data):**
```typescript
const courseData = {
  title: 'Advanced React Patterns',
  description: '...',
  lessons: [/* 6 mock lessons */],
};
```

**After (Real API):**
```typescript
import { useCourseDetail, useMutateBookmark } from '../../hooks/useEducatePro';

const CourseDetailsScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const { data: course, loading, error, refetch } = useCourseDetail(courseId);
  const { toggleBookmark, loading: bookmarking } = useMutateBookmark();

  const handleBookmark = async () => {
    try {
      await toggleBookmark('course', courseId);
      // Refetch to update bookmark status
      refetch();
    } catch (err) {
      Alert.alert('Error', 'Failed to bookmark course');
    }
  };

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error loading course</Text>;
  if (!course?.data) return null;

  return (
    <ScrollView>
      <Text>{course.data.title}</Text>
      <Text>{course.data.description}</Text>
      <FlatList
        data={course.data.lessons}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Lesson', {
                lessonId: item.id,
                courseId,
              })
            }
          >
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <Button
        title={course.data.isSaved ? 'Remove Bookmark' : 'Save Course'}
        onPress={handleBookmark}
        disabled={bookmarking}
      />
    </ScrollView>
  );
};
```

### Example 3: QuizScreen - Submit Quiz

**Before (Mock Results):**
```typescript
const handleSubmitQuiz = () => {
  const score = calculateScore(); // Manual calculation
  setShowResults(true);
};
```

**After (Real API):**
```typescript
import { useQuiz, useMutateQuiz } from '../../hooks/useEducatePro';

const QuizScreen = ({ route }) => {
  const { quizId } = route.params;
  const { data: quiz, loading } = useQuiz(quizId);
  const { submitQuiz, loading: submitting } = useMutateQuiz();
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleSubmitQuiz = async () => {
    try {
      const result = await submitQuiz(quizId, selectedAnswers);
      // Use actual result from server
      setQuizResult(result.data);
      setShowResults(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit quiz');
    }
  };

  if (loading) return <ActivityIndicator />;
  if (!quiz?.data) return null;

  return (
    <ScrollView>
      {quiz.data.questions.map((question) => (
        <View key={question.id}>
          <Text>{question.text}</Text>
          {question.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() =>
                setSelectedAnswers({
                  ...selectedAnswers,
                  [question.id]: option.id,
                })
              }
            >
              <Text>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <Button
        title="Submit Quiz"
        onPress={handleSubmitQuiz}
        disabled={submitting}
      />
    </ScrollView>
  );
};
```

### Example 4: BookmarkScreen - Manage Bookmarks

**Before (Mock Bookmarks):**
```typescript
const [bookmarks, setBookmarks] = useState(MOCK_BOOKMARKS);

const handleRemove = (id) => {
  setBookmarks(bookmarks.filter((b) => b.id !== id));
};
```

**After (Real API):**
```typescript
import { useBookmarks, useMutateBookmark } from '../../hooks/useEducatePro';

const BookmarkScreen = ({ navigation }) => {
  const { data: bookmarksData, loading, refetch } = useBookmarks('course');
  const { toggleBookmark, loading: toggling } = useMutateBookmark();
  const bookmarks = bookmarksData?.data || [];

  const handleRemove = async (entityId) => {
    try {
      await toggleBookmark('course', entityId);
      refetch(); // Refresh the list
    } catch (error) {
      Alert.alert('Error', 'Failed to remove bookmark');
    }
  };

  if (loading) return <ActivityIndicator />;

  return (
    <FlatList
      data={bookmarks}
      renderItem={({ item }) => (
        <TouchableOpacity
          onLongPress={() => handleRemove(item.entityId)}
        >
          <Text>{item.entity?.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
};
```

### Example 5: LeaderboardScreen - Display Rankings

**Before (Mock Data):**
```typescript
const [leaderboard] = useState(MOCK_LEADERBOARD);
const [userRank] = useState(42);
```

**After (Real API):**
```typescript
import { useLeaderboard, useUserRank } from '../../hooks/useEducatePro';

const LeaderboardScreen = ({ navigation }) => {
  const [period, setPeriod] = useState('overall');
  const { data: leaderboardData, loading: loadingBoard } = useLeaderboard(period);
  const { data: userRankData, loading: loadingRank } = useUserRank(period);

  const leaderboard = leaderboardData?.data || [];
  const userRank = userRankData?.data;

  if (loadingBoard || loadingRank) return <ActivityIndicator />;

  return (
    <View>
      {userRank && (
        <View>
          <Text>Your Rank: #{userRank.rank}</Text>
          <Text>Points: {userRank.points}</Text>
        </View>
      )}
      <FlatList
        data={leaderboard}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('MentorProfile', { mentorId: item.userId })}
          >
            <Text>#{item.rank} {item.user.firstName} - {item.points} pts</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
```

### Example 6: DownloadedCoursesScreen - Track Storage

**Before (Mock Storage):**
```typescript
const [downloadedCourses] = useState(MOCK_DOWNLOADED_COURSES);
```

**After (Real API):**
```typescript
import { useEnrollments } from '../../hooks/useEducatePro';

const DownloadedCoursesScreen = ({ navigation }) => {
  const { data: enrollmentsData, loading } = useEnrollments('active');
  const enrollments = enrollmentsData?.data || [];

  // Calculate storage from enrollment progress
  const totalStorage = enrollments.reduce((sum, e) => {
    const progressPercentage = e.progressPercentage / 100;
    return sum + (2.5 * progressPercentage); // Assuming ~2.5GB per course
  }, 0);

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Text>Storage Used: {totalStorage.toFixed(1)} GB</Text>
      <FlatList
        data={enrollments}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Lesson', { enrollmentId: item.id })
            }
          >
            <ProgressBar value={item.progressPercentage / 100} />
            <Text>{item.course?.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
```

---

## Type Definitions

All types are defined in `src/types/educatepro.types.ts`:

```typescript
// User types
interface User { ... }
interface UserProfile { ... }

// Course types
interface Course { ... }
interface CourseDetail { ... }
type CourseCategory = '...' | '...' | ...

// Lesson types
interface Lesson { ... }
interface LessonDetail { ... }
interface Resource { ... }

// Mentor types
interface Instructor { ... }
interface InstructorProfile { ... }
interface Mentor { ... }
interface MentorProfile { ... }
interface Qualification { ... }
interface ExperienceItem { ... }

// Booking types
interface TimeSlot { ... }
interface MentorSession { ... }
interface LiveSession { ... }
interface LiveSessionParticipant { ... }

// Assessment types
interface Quiz { ... }
interface Question { ... }
interface QuestionOption { ... }
interface QuizAttempt { ... }
interface QuizAnswer { ... }

// Assignment types
interface Assignment { ... }
interface AssignmentSubmission { ... }

// Certificate types
interface Certificate { ... }

// Other types
interface Review { ... }
interface Bookmark { ... }
interface Notification { ... }
interface Message { ... }
interface Conversation { ... }
interface Enrollment { ... }
interface PaymentMethod { ... }
interface Transaction { ... }
interface LeaderboardEntry { ... }
interface UserSettings { ... }
interface NotificationSettings { ... }

// API Response types
interface ApiResponse<T> { ... }
interface PaginatedResponse<T> { ... }

// Form types
interface CreateCourseForm { ... }
interface EditProfileForm { ... }
interface LoginForm { ... }
interface SignupForm { ... }
```

---

## Error Handling

### Service Layer Error Handling

All service methods return `ApiResponse<T>` with error handling:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: Record<string, any>;
  };
}
```

### Hook Error Handling

Hooks capture errors and provide them in the return object:

```typescript
const { data, error, loading } = useCourses(1, 10);

if (error) {
  return <Text>Error: {error.message}</Text>;
}
```

### Global Error Handling (API Interceptor)

The API client (`api.ts`) has built-in error handling:

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
    }
    return Promise.reject(error);
  }
);
```

---

## Caching Strategy

Custom hooks implement smart caching:

```typescript
// Cache expires after 5 minutes
useCourses() // cacheKey: 'courses-1-10', duration: 5*60*1000

// Cache expires after 10 minutes
useTopMentors() // cacheKey: 'top-mentors-10', duration: 10*60*1000

// Cache expires after 30 seconds (real-time data)
useNotifications() // cacheKey: 'notifications-all', duration: 30*1000
```

### Cache Management

Manual cache clearing for mutations:

```typescript
const { toggleBookmark } = useMutateBookmark();

const handleToggle = async () => {
  await toggleBookmark('course', courseId);
  // Cache automatically cleared:
  // - 'bookmarks-course'
  // - 'is-bookmarked-course-{courseId}'
};
```

### Cache Key Patterns

```
// Query caches
courses-{page}-{limit}
course-{id}
search-courses-{query}-{page}-{limit}
mentors-{page}-{limit}
mentor-{id}
leaderboard-{period}

// Real-time caches (shorter duration)
mentor-sessions-{status}
notifications-{filter}
enrollments-{status}

// Static caches (longer duration)
top-mentors-{limit}
payment-methods
user-certificates
```

---

## Best Practices

### 1. Always use hooks instead of direct service calls

❌ **Wrong:**
```typescript
useEffect(() => {
  educateProService.getCourses().then(setCourses);
}, []);
```

✅ **Correct:**
```typescript
const { data, loading, error } = useCourses(1, 10);
```

### 2. Handle loading and error states

✅ **Good:**
```typescript
const { data, loading, error } = useCourses();

if (loading) return <ActivityIndicator />;
if (error) return <Text>Error: {error.message}</Text>;

return <FlatList data={data?.data} ... />;
```

### 3. Use proper TypeScript types

✅ **Good:**
```typescript
import { Course, CourseDetail } from '../types/educatepro.types';

const MyComponent: React.FC = () => {
  const { data } = useCourseDetail(courseId);
  const course: CourseDetail | null = data?.data || null;

  return <Text>{course?.title}</Text>;
};
```

### 4. Refetch data when needed

✅ **Good:**
```typescript
const { data, refetch } = useCourseDetail(courseId);

const handleUpdate = async () => {
  await updateCourse(courseId, newData);
  refetch(); // Refresh data
};
```

### 5. Use mutations for modifying data

✅ **Good:**
```typescript
const { toggleBookmark, loading, error } = useMutateBookmark();

const handleBookmark = async () => {
  try {
    await toggleBookmark('course', courseId);
  } catch (err) {
    Alert.alert('Error', 'Failed to bookmark');
  }
};
```

### 6. Implement proper pagination

✅ **Good:**
```typescript
const [page, setPage] = useState(1);
const { data, loading } = useCourses(page, 10);

const handleLoadMore = () => {
  setPage(page + 1);
};
```

### 7. Combine multiple hooks efficiently

✅ **Good:**
```typescript
const courseDetail = useCourseDetail(courseId);
const reviews = useReviews('course', courseId);
const isBookmarked = useIsBookmarked('course', courseId);

if (courseDetail.loading || reviews.loading) return <ActivityIndicator />;
```

### 8. Handle form submissions with mutations

✅ **Good:**
```typescript
const { submitQuiz, loading } = useMutateQuiz();

const handleSubmit = async () => {
  try {
    const result = await submitQuiz(quizId, answers);
    setQuizResult(result.data);
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

---

## API Endpoint Reference

### Base URL

```
API_BASE_URL (from config)
Default: http://localhost:3000/api/v1
```

### Endpoints Used

#### Courses
```
GET    /courses
GET    /courses/{id}
POST   /courses
PUT    /courses/{id}
DELETE /courses/{id}
GET    /courses/search
GET    /courses/category/{category}
```

#### Lessons
```
GET  /courses/{courseId}/lessons
GET  /lessons/{id}
POST /lessons/{id}/complete
POST /lessons/{id}/progress
```

#### Mentors
```
GET    /mentors
GET    /mentors/{id}
GET    /mentors/search
GET    /mentors/specialization/{spec}
GET    /mentors/top
POST   /mentors/{id}/toggle-follow
```

#### Sessions & Bookings
```
GET  /mentors/{id}/time-slots
POST /mentor-sessions/book
GET  /mentor-sessions
POST /mentor-sessions/{id}/cancel
```

#### Quizzes & Assessments
```
GET  /quizzes/{id}
GET  /lessons/{lessonId}/quizzes
POST /quizzes/{id}/submit
GET  /quizzes/{id}/attempts
```

#### Assignments
```
GET  /assignments/{id}
GET  /lessons/{lessonId}/assignments
POST /assignments/{id}/submit
GET  /submissions/{id}
```

#### Certificates
```
GET  /certificates/{id}
GET  /certificates
GET  /certificates/{id}/verify
GET  /certificates/{id}/download
```

#### Reviews
```
GET  /{entityType}s/{entityId}/reviews
POST /{entityType}s/{entityId}/reviews
DELETE /reviews/{id}
```

#### Bookmarks
```
GET  /bookmarks
POST /bookmarks/toggle
GET  /bookmarks/check
```

#### Notifications
```
GET  /notifications
POST /notifications/{id}/read
POST /notifications/{id}/archive
DELETE /notifications/{id}
```

#### Messaging
```
GET  /conversations
GET  /conversations/{id}/messages
POST /conversations/{id}/messages
POST /conversations/start
```

#### Enrollments
```
GET  /enrollments
POST /enrollments
GET  /enrollments/{id}
```

#### Payments
```
GET  /payment-methods
POST /payment-methods
PUT  /payment-methods/{id}/default
DELETE /payment-methods/{id}
POST /payments/process
GET  /transactions
```

#### Leaderboard
```
GET /leaderboard
GET /leaderboard/my-rank
```

#### User
```
PUT  /user/profile
POST /user/avatar
GET  /user/stats
```

---

## Migration Checklist

For each screen, follow this checklist to migrate from mock data to real API:

- [ ] Import required hook(s) from `useEducatePro`
- [ ] Replace `useState` mock data with hook calls
- [ ] Handle `loading` state (show spinner)
- [ ] Handle `error` state (show error message)
- [ ] Update component to use `data?.data` structure
- [ ] Add proper TypeScript types from `educatepro.types`
- [ ] Add `refetch()` calls after mutations
- [ ] Test with real backend data
- [ ] Verify pagination if applicable
- [ ] Test error scenarios

---

## Support

For issues or questions about API integration:
1. Check this guide first
2. Review example implementations
3. Check hook return types
4. Verify API endpoint in service layer
5. Check network requests in browser DevTools
