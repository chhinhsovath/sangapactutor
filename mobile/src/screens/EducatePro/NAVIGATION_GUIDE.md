# EducatePro Navigation Guide

Complete reference for all 31 screens across 4 tiers in the EducatePro app. Each screen is fully integrated with React Navigation and supports dark mode.

## Table of Contents
- [Tier 1: Foundational Screens](#tier-1-foundational-screens)
- [Tier 2: Core Screens](#tier-2-core-screens)
- [Tier 3: Support Screens](#tier-3-support-screens)
- [Tier 4: Specialized Screens](#tier-4-specialized-screens)
- [Navigation Flow](#navigation-flow)
- [Common Patterns](#common-patterns)

---

## Tier 1: Foundational Screens

These 5 screens form the core foundation of the app. Users interact with these screens most frequently.

### 1. HomeScreen
**Route Name**: `EducateProHome`
**File**: `src/screens/EducatePro/HomeScreen.tsx`
**Features**:
- Banner carousel with course promotions
- Featured courses grid
- Top mentors section with "View All" link
- Search integration
- Category filtering (6 categories)

**Navigation Links**:
- → SearchScreen (via search bar)
- → CourseDetailsScreen (tap course card)
- → MentorProfileScreen (tap mentor card)
- → ProfileScreen (via menu/settings)

**Mock Data**:
- 8 courses with pricing and ratings
- 3 featured mentors
- 6 categories

---

### 2. ProfileScreen
**Route Name**: `EducateProProfile`
**File**: `src/screens/EducatePro/ProfileScreen.tsx`
**Features**:
- User avatar and basic info
- Statistics (courses enrolled, progress, hours)
- Settings menu with 8 options:
  - Edit Profile
  - My Courses
  - Bookmarks
  - Notifications
  - Help Center
  - Privacy Policy
  - Settings (sub-menu)
  - Logout

**Navigation Links**:
- → EditProfileScreen (Edit Profile)
- → MyCourseScreen (My Courses)
- → BookmarkScreen (Bookmarks)
- → NotificationsScreen (Notifications)
- → HelpCenterScreen (Help Center)
- → PrivacyPolicyScreen (Privacy Policy)
- → SettingsLanguageScreen (Settings > Language)
- → SettingsNotificationsScreen (Settings > Notifications)
- → SettingsPaymentScreen (Settings > Payment)
- → SettingsSecurityScreen (Settings > Security)
- → HomeScreen (Logout)

**Settings Sub-Menu**:
- Language Settings (SettingsLanguageScreen)
- Notification Settings (SettingsNotificationsScreen)
- Payment Settings (SettingsPaymentScreen)
- Security Settings (SettingsSecurityScreen)

---

### 3. EditProfileScreen
**Route Name**: `EditProfile`
**File**: `src/screens/EducatePro/EditProfileScreen.tsx`
**Features**:
- Form with 4 fields:
  - Full Name (text input, required)
  - Email (text input, email validation)
  - Phone (text input, phone validation)
  - Gender (dropdown: Male/Female/Other)
- Date picker for birthday
- Form state management with validation
- Save button with success alert

**Navigation Links**:
- ← ProfileScreen (back button)

**Form Validation**:
- Name: minimum 2 characters
- Email: valid email format
- Phone: valid phone format
- Gender: required selection

---

### 4. CourseDetailsScreen
**Route Name**: `CourseDetails`
**File**: `src/screens/EducatePro/CourseDetailsScreen.tsx`
**Features**:
- 3-tab interface:
  - **Lessons Tab**: 6 lessons list with completion tracking
  - **Reviews Tab**: 4 course reviews with ratings and text
  - **Instructor Tab**: Instructor profile with bio
- Course header with title, instructor, rating, price
- Course completion modal
- Enroll button

**Navigation Links**:
- ← HomeScreen (back button)
- → LessonScreen (tap lesson to watch)
- → CourseDetailsScreen (modal for completion info)

**Tab Content**:
- Lessons: List of 6 lessons with video icons and completion badges
- Reviews: Reviewer cards with avatar, name, rating, and review text
- Instructor: Full instructor profile with details and message button

---

### 5. SearchScreen
**Route Name**: `EducateProSearch`
**File**: `src/screens/EducatePro/SearchScreen.tsx`
**Features**:
- Dual-tab search:
  - **Courses Tab**: Search and filter courses
  - **Mentors Tab**: Search and filter mentors
- Real-time search filtering
- Category filtering (6 categories for courses)
- Search results grid/list
- Empty state when no results

**Navigation Links**:
- ← HomeScreen (back button)
- → CourseDetailsScreen (tap course)
- → MentorProfileScreen (tap mentor)

---

## Tier 2: Core Screens

These 6 screens handle authentication, communication, and transactions.

### 6. ChatScreen
**Route Name**: `Chat`
**File**: `src/screens/EducatePro/ChatScreen.tsx`
**Features**:
- Message interface with sent/received bubbles
- Different styling for user vs other person
- Typing indicator
- Input field with send button
- Auto-scroll to latest messages
- Online status indicator
- Avatar display for participants

**Navigation Links**:
- ← Previous screen (back button)

---

### 7. LoginScreen
**Route Name**: `EducateProLogin`
**File**: `src/screens/EducatePro/LoginScreen.tsx`
**Features**:
- Email and password fields with validation
- Remember me checkbox
- Forgot password link
- Social login buttons (Google, Facebook, Apple)
- Password visibility toggle
- Sign up link

**Navigation Links**:
- → EducateProSignup (via Sign up link)
- → HomeScreen (on successful login)

**Form Validation**:
- Email: required, valid format
- Password: required, minimum 6 characters

---

### 8. SignupScreen
**Route Name**: `EducateProSignup`
**File**: `src/screens/EducatePro/SignupScreen.tsx`
**Features**:
- 4-field registration form:
  - Full Name
  - Email
  - Password
  - Confirm Password
- Password strength indicator with 3 visual bars
- Terms and conditions checkbox
- Password matching validation
- Sign up button
- Login link

**Navigation Links**:
- → EducateProLogin (via Login link)
- → HomeScreen (on successful signup)

**Form Validation**:
- Name: minimum 2 characters
- Email: valid email format
- Password: minimum 8 characters
- Confirm Password: must match password
- Terms: must be accepted

---

### 9. BookmarkScreen
**Route Name**: `Bookmarks`
**File**: `src/screens/EducatePro/BookmarkScreen.tsx`
**Features**:
- Dual-tab interface:
  - **Courses Tab**: Saved courses (2 bookmarked courses)
  - **Mentors Tab**: Saved mentors (3 bookmarked mentors)
- Bookmark counters (e.g., "3 Mentors")
- Delete functionality with confirmation
- Empty state with browse button
- Course/mentor cards with quick actions

**Navigation Links**:
- ← Previous screen (back button)
- → CourseDetailsScreen (tap course)
- → MentorProfileScreen (tap mentor)

---

### 10. NotificationsScreen
**Route Name**: `Notifications`
**File**: `src/screens/EducatePro/NotificationsScreen.tsx`
**Features**:
- Triple-tab navigation:
  - **All Tab**: All 9 notifications
  - **Unread Tab**: 4 unread notifications
  - **Archive Tab**: 3 archived notifications
- Notifications grouped by date
- Mark as read/unread buttons
- Delete with action buttons
- Unread highlighting (blue dot indicator)
- Notification types: course updates, payments, messages

**Navigation Links**:
- ← Previous screen (back button)

---

### 11. ConfirmPaymentScreen
**Route Name**: `ConfirmPayment`
**File**: `src/screens/EducatePro/ConfirmPaymentScreen.tsx`
**Features**:
- Order summary with course details
- Price breakdown:
  - Original price
  - Discount (with promo code)
  - Tax
  - Final total
- Promo code system (working codes: SAVE50, SAVE20)
- Payment method selection:
  - Credit card
  - PayPal
  - Google Pay
  - Apple Pay
- Billing details section
- Terms and conditions checkbox
- Pay now button

**Navigation Links**:
- ← Previous screen (back button)
- → HomeScreen (on successful payment)

**Promo Codes**:
- SAVE50: 50% discount
- SAVE20: 20% discount

---

## Tier 3: Support Screens

These 10 screens provide learning and account management features.

### 12. MyCourseScreen
**Route Name**: `MyCourse`
**File**: `src/screens/EducatePro/MyCourseScreen.tsx`
**Features**:
- Dual-tab interface:
  - **Active Tab**: 4 in-progress courses
  - **Completed Tab**: 2 completed courses
- Course cards with:
  - Progress bar
  - Lesson count
  - Duration
  - "Continue Learning" button
- Filter by status

**Navigation Links**:
- ← Previous screen (back button)
- → LessonScreen (via Continue Learning)
- → CourseDetailsScreen (tap course card)

---

### 13. MentorProfileScreen
**Route Name**: `MentorProfile`
**File**: `src/screens/EducatePro/MentorProfileScreen.tsx`
**Features**:
- 3-tab interface:
  - **About Tab**: Bio, qualifications, experience timeline
  - **Courses Tab**: 3 courses taught by mentor
  - **Reviews Tab**: 4 student reviews with ratings
- Mentor header with avatar, name, rating, hourly rate
- Follow and message buttons
- Statistics (students taught, courses, rating)
- Reviews with detailed feedback

**Navigation Links**:
- ← Previous screen (back button)
- → ChatScreen (via Message button)
- → CourseDetailsScreen (tap course in Courses tab)
- → MentorScheduleScreen (via Book Session button)

---

### 14. TopMentorsScreen
**Route Name**: `TopMentors`
**File**: `src/screens/EducatePro/TopMentorsScreen.tsx`
**Features**:
- Mentor directory with search bar
- Category filtering:
  - Design
  - Development
  - Business
  - Data
  - Marketing
  - Music
- Mentor cards with:
  - Avatar
  - Name
  - Specialization
  - Rating and review count
  - Hourly rate
- Follow and message buttons
- Empty state

**Navigation Links**:
- ← Previous screen (back button)
- → MentorProfileScreen (tap mentor card)
- → ChatScreen (via Message button)
- → MentorScheduleScreen (via Book Session button)

---

### 15. HelpCenterScreen
**Route Name**: `HelpCenter`
**File**: `src/screens/EducatePro/HelpCenterScreen.tsx`
**Features**:
- FAQ accordion list (6 FAQ items)
- Search functionality for FAQs
- Quick action cards:
  - Live Chat
  - Email Support
  - Call Support
  - Knowledge Base
- Categorized FAQ items
- Expandable/collapsible sections

**Navigation Links**:
- ← Previous screen (back button)

---

### 16. PrivacyPolicyScreen
**Route Name**: `PrivacyPolicy`
**File**: `src/screens/EducatePro/PrivacyPolicyScreen.tsx`
**Features**:
- Privacy policy text content
- Collapsible sections
- Last updated date
- Contact information
- Scrollable content

**Navigation Links**:
- ← Previous screen (back button)

---

### 17. SettingsLanguageScreen
**Route Name**: `SettingsLanguage`
**File**: `src/screens/EducatePro/SettingsLanguageScreen.tsx`
**Features**:
- Language selection (6 languages):
  - English
  - Spanish
  - French
  - German
  - Chinese
  - Japanese
- Region selection with flag icons
- Timezone configuration (6 options)
- Radio button selection UI
- Save button

**Navigation Links**:
- ← ProfileScreen (back button)

---

### 18. SettingsNotificationsScreen
**Route Name**: `SettingsNotifications`
**File**: `src/screens/EducatePro/SettingsNotificationsScreen.tsx`
**Features**:
- Toggle switches organized by channel:
  - **Push Notifications**:
    - Course updates
    - New messages
    - Promotions
  - **Email Notifications**:
    - Course updates
    - Newsletter
    - Promotions
  - **SMS Notifications**:
    - Order updates
    - Course reminders

**Navigation Links**:
- ← ProfileScreen (back button)

---

### 19. SettingsPaymentScreen
**Route Name**: `SettingsPayment`
**File**: `src/screens/EducatePro/SettingsPaymentScreen.tsx`
**Features**:
- Saved payment methods display
- Set default payment method
- Delete payment method
- Add new card button with form
- Billing history with 3 mock transactions
- Payment method details (last 4 digits, expiry)

**Navigation Links**:
- ← ProfileScreen (back button)

---

### 20. SettingsSecurityScreen
**Route Name**: `SettingsSecurity`
**File**: `src/screens/EducatePro/SettingsSecurityScreen.tsx`
**Features**:
- Change password section
- Two-factor authentication toggle
- Biometric login toggle
- Active sessions display (3 devices)
- Device info (device type, location, last active)
- Sign out all sessions button

**Navigation Links**:
- ← ProfileScreen (back button)

---

### 21. InviteFriendsScreen
**Route Name**: `InviteFriends`
**File**: `src/screens/EducatePro/InviteFriendsScreen.tsx`
**Features**:
- Referral code display: "REFER2025"
- Copy to clipboard functionality
- Referral rewards statistics
- Share via multiple channels:
  - WhatsApp
  - Facebook
  - Twitter
  - Email
  - SMS
- Invited friends list with status tracking
- Rewards earned display

**Navigation Links**:
- ← ProfileScreen (back button)

---

## Tier 4: Specialized Screens

These 10 screens handle advanced learning and gamification features.

### 22. LessonScreen
**Route Name**: `Lesson`
**File**: `src/screens/EducatePro/LessonScreen.tsx`
**Features**:
- Video player interface:
  - Play/pause controls
  - Progress bar with time display
  - Full-screen toggle
- Lesson header with badge, title, instructor name
- Progress indicator (e.g., 75% completed)
- Resources section with 3 resource types:
  - PDF download
  - External link
  - Downloadable file
- Transcript tab with full lesson text
- Mark as complete button

**Navigation Links**:
- ← CourseDetailsScreen or MyCourseScreen (back button)
- → NextLesson (auto-nav on completion)
- → QuizScreen (if quiz assigned)
- → AssignmentScreen (if assignment assigned)

**Resources Available**:
- Course syllabus (PDF)
- Reference documentation (Link)
- Code examples (File)

---

### 23. LiveSessionScreen
**Route Name**: `LiveSession`
**File**: `src/screens/EducatePro/LiveSessionScreen.tsx`
**Features**:
- Live video call interface:
  - Main video area with instructor
  - Recording badge
  - Control buttons:
    - Mute/unmute
    - Camera on/off
    - Raise hand
    - Leave call
- Participant list showing 4 active participants
- Speaker indicator
- Hand-raised badges on participant names
- Crown icon for instructor
- Live chat (via ChatScreen)
- Time remaining display

**Navigation Links**:
- ← Previous screen (back button)
- → ChatScreen (via chat area)

**Participant Features**:
- View all participants
- Mute/unmute controls
- Raise hand to speak
- See active speaker

---

### 24. CourseCreationScreen
**Route Name**: `CreateCourse`
**File**: `src/screens/EducatePro/CourseCreationScreen.tsx`
**Features**:
- Course creation form with:
  - Thumbnail upload area (with cloud icon)
  - Course name input (required)
  - Category chip selection (5 categories):
    - Web Development
    - Mobile Development
    - Design
    - Business
    - Data Science
  - Price input (in USD)
  - Description textarea
  - Publish toggle
- Save as draft and publish buttons
- Form state management

**Navigation Links**:
- ← Previous screen (back button)
- → MyCourseScreen (on successful creation)

**Form Validation**:
- Course name: required, minimum 5 characters
- Category: required selection
- Price: required, numeric, minimum $0.01
- Description: required, minimum 50 characters

---

### 25. AssignmentScreen
**Route Name**: `Assignment`
**File**: `src/screens/EducatePro/AssignmentScreen.tsx`
**Features**:
- Assignment details display:
  - Title
  - Description
  - Due date
  - Points
  - Status badge (Not Submitted/Submitted)
- File upload interface:
  - Cloud upload icon
  - Drag-and-drop area
  - File selection from gallery
  - File display with icon and name
  - Remove file button
- Submit assignment button
- Completion status with checkmark

**Navigation Links**:
- ← LessonScreen (back button)

**File Upload**:
- Maximum file size: 100MB
- Supported formats: .zip, .pdf, .doc, .docx, .jpg, .png

---

### 26. QuizScreen
**Route Name**: `Quiz`
**File**: `src/screens/EducatePro/QuizScreen.tsx`
**Features**:
- Multiple choice quiz with 3 questions
- Progress bar showing question progress
- Question display with number (e.g., "Question 1 of 3")
- Radio button options for answers
- Previous/next navigation buttons
- Submit quiz button
- Results display showing:
  - Score percentage
  - Performance message (Excellent/Good Job/Try Again)
  - Correct/incorrect count
  - Total questions count
- Back to lesson button

**Navigation Links**:
- ← LessonScreen (back button)
- → LessonScreen (via Back to Lesson button)

**Scoring**:
- 80%+: Excellent!
- 60%-79%: Good Job!
- <60%: Try Again

---

### 27. CertificateScreen
**Route Name**: `Certificate`
**File**: `src/screens/EducatePro/CertificateScreen.tsx`
**Features**:
- Certificate display with decorative design:
  - Medal icon
  - "CERTIFICATE OF COMPLETION" text
  - Student name (large text)
  - Course name
  - Completion date
  - Instructor name
  - Certificate ID with verification link
- Details section showing:
  - Score: 95%
  - Completed on date
  - Status: Verified badge
- Download and share buttons

**Navigation Links**:
- ← Previous screen (back button)
- Share via: WhatsApp, Facebook, Twitter, Email

**Features**:
- Download certificate as PDF
- Share on social media
- Verify certificate online
- Display certificate ID

---

### 28. MentorScheduleScreen
**Route Name**: `BookMentorSession`
**File**: `src/screens/EducatePro/MentorScheduleScreen.tsx`
**Features**:
- Session booking interface with:
  - Mentor card (avatar, name, role, rating, hourly rate)
  - Week day selection (7 days with highlighting)
  - Time slot grid (8 time slots):
    - Available slots (enabled)
    - Booked slots (disabled, marked "Booked")
  - Selected slot highlighting
  - Session duration display (30 minutes default)
  - Price calculation ($50/hour rate)
  - Summary card showing duration and total price
- Confirm booking button with success alert

**Navigation Links**:
- ← MentorProfileScreen or TopMentorsScreen (back button)
- → BookmarkScreen (on successful booking)

**Time Slots Available**:
- 09:00 AM - 05:00 PM (8 slots total)
- Showing booked/available status

---

### 29. WishlistScreen
**Route Name**: `Wishlist`
**File**: `src/screens/EducatePro/WishlistScreen.tsx`
**Features**:
- Wishlist items display using CourseCard component
- 2 mock saved courses with:
  - Course name
  - Instructor
  - Rating and price
  - Original and sale prices
- Added date tracking
- Heart-remove button for deletion
- Empty state with heart icon and navigation

**Navigation Links**:
- ← ProfileScreen (back button)
- → CourseDetailsScreen (tap course card)
- → SearchScreen (via Browse Courses in empty state)

---

### 30. DownloadedCoursesScreen
**Route Name**: `DownloadedCourses`
**File**: `src/screens/EducatePro/DownloadedCoursesScreen.tsx`
**Features**:
- Storage usage tracking:
  - Total storage used (7.0 GB of 10.0 GB)
  - Storage bar visualization
  - Used/capacity display
- Downloaded courses list with:
  - Course name and category
  - Progress bar (download % or completion %)
  - Total and downloaded size
  - Last accessed date
  - Lesson count
- Filter tabs:
  - All courses
  - Downloading (in-progress)
  - Completed (100% downloaded)
- Delete downloaded content with confirmation
- "Watch Offline" button for each course
- Empty state

**Navigation Links**:
- ← ProfileScreen (back button)
- → LessonScreen (via Watch Offline button)

---

### 31. LeaderboardScreen
**Route Name**: `Leaderboard`
**File**: `src/screens/EducatePro/LeaderboardScreen.tsx`
**Features**:
- User statistics card showing:
  - Current user's rank (#42)
  - Points earned (1850)
  - Courses completed (4)
  - Level (Beginner/Intermediate/Advanced/Expert)
- Category tabs:
  - Overall rankings
  - Weekly rankings
  - Monthly rankings
- Top 3 featured users with:
  - Special badge icons (Trophy/Medal/Award)
  - Colored by rank
  - Avatar display
  - Name and points
- Full leaderboard list showing:
  - Rank number for positions 4+
  - Top 3 get special badge icons
  - Avatar
  - Name and level
  - Points earned
  - Chevron for profile link

**Navigation Links**:
- ← ProfileScreen (back button)
- → MentorProfileScreen (tap user in leaderboard)

---

## Navigation Flow

### Main Navigation Structure
```
StudentTabNavigator (Bottom Tab Navigation)
├── Home (existing)
├── Search (existing)
├── EducatePro (NEW - Stack Navigator with all 31 screens)
├── Bookings (existing)
├── Messages (existing)
└── Profile (existing)
```

### EducatePro Stack Navigator
```
EducateProStackNavigator (Stack Navigation)
├── Tier 1: Foundational
│   ├── EducateProHome
│   ├── EducateProProfile
│   ├── EditProfile
│   ├── CourseDetails
│   └── EducateProSearch
├── Tier 2: Core
│   ├── Chat
│   ├── EducateProLogin
│   ├── EducateProSignup
│   ├── Bookmarks
│   ├── Notifications
│   └── ConfirmPayment
├── Tier 3: Support
│   ├── MyCourse
│   ├── MentorProfile
│   ├── TopMentors
│   ├── HelpCenter
│   ├── PrivacyPolicy
│   ├── SettingsLanguage
│   ├── SettingsNotifications
│   ├── SettingsPayment
│   ├── SettingsSecurity
│   └── InviteFriends
└── Tier 4: Specialized
    ├── Lesson
    ├── LiveSession
    ├── CreateCourse
    ├── Assignment
    ├── Quiz
    ├── Certificate
    ├── BookMentorSession
    ├── Wishlist
    ├── DownloadedCourses
    └── Leaderboard
```

### Typical User Flow
```
1. User logs in via LoginScreen or SignupScreen
2. Enters app at StudentTabNavigator
3. Can switch between tabs:
   - Home: Browse courses and mentors
   - Search: Find specific content
   - EducatePro (Learn): Full learning experience
   - Bookings: Manage appointments
   - Messages: Communicate
   - Profile: Account management
4. Within EducatePro tab:
   - Start at HomeScreen
   - Browse courses → CourseDetailsScreen
   - Enroll → ConfirmPaymentScreen
   - Learn → LessonScreen → QuizScreen → AssignmentScreen → CertificateScreen
   - Manage → MyCourseScreen, DownloadedCoursesScreen
   - Connect → TopMentorsScreen → MentorProfileScreen → MentorScheduleScreen
   - Settings → SettingsLanguageScreen, etc.
   - Gamification → LeaderboardScreen
   - Community → InviteFriendsScreen
```

---

## Common Patterns

### Dark Mode Support
All screens support dark mode via `isDark` state prop and COLORS constants:
```typescript
const [isDark] = useState(false);
// Use isDark to conditionally apply dark colors
backgroundColor: isDark ? COLORS.dark1 : COLORS.white
```

### Form State Management
Complex forms use custom `formReducer` pattern:
```typescript
const [formState, dispatch] = useReducer(formReducer, initialState);
// Dispatch actions: SET_FIELD, SET_ERROR, RESET_FORM
```

### List Filtering
Search and filter screens use useEffect with dependencies:
```typescript
useEffect(() => {
  const filtered = data.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  setFilteredData(filtered);
}, [data, search, selectedCategory]);
```

### Navigation Parameters
Pass data between screens via route params:
```typescript
navigation.navigate('CourseDetails', { courseId: item.id })
// Access: route.params?.courseId
```

### Lazy Imports
For code-splitting, consider lazy loading less-used screens:
```typescript
const LessonScreen = lazy(() => import('./LessonScreen'));
```

---

## Integration Checklist

- [x] All 31 screens created with TypeScript
- [x] Dark mode support added to all screens
- [x] Mock data provided for all screens
- [x] EducateProStackNavigator created
- [x] StudentTabNavigator updated with EducatePro tab
- [x] Screen route names defined
- [x] Navigation parameters documented
- [ ] API integration (pending)
- [ ] Image assets optimization (pending)
- [ ] Translations/i18n keys (pending)
- [ ] Testing on iOS simulator (pending)
- [ ] Testing on Android emulator (pending)
- [ ] Performance optimization (pending)

---

## Next Steps

1. **API Integration**: Replace mock data with API calls
2. **Image Assets**: Optimize and compress images
3. **Internationalization**: Add translation keys for all strings
4. **Testing**: Test all navigation flows on device
5. **Performance**: Profile and optimize slow screens
6. **Animations**: Add transitions and gesture handlers
7. **State Management**: Consider Redux/Context API for global state
8. **Error Handling**: Add error boundaries and error screens
9. **Offline Support**: Implement offline data persistence
10. **Analytics**: Add event tracking for user behavior
