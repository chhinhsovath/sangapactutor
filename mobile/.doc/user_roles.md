  Test User Credentials for Mobile App

  Admin Account

  Email: admin@tutorhub.com
  Password: admin123
  Role: admin
  Name: Admin User

  Tutor Account

  Email: sarah@example.com
  Password: tutor123
  Role: tutor
  Name: Sarah Johnson

  Student Account

  Email: john@example.com
  Password: student123
  Role: student
  Name: John Smith
  Credit Balance: 100.00

  Additional Accounts (Institution/Faculty)

  Email: sovan.kim@rupp.edu.kh
  Password: demo123
  Role: faculty_coordinator
  Name: Sovan Kim

  Email: sokha.chan@rupp.edu.kh
  Password: demo123
  Role: tutor
  Name: Sokha Chan

  Email: sophea.prak@kcu.edu.kh
  Password: demo123
  Role: student
  Name: Sophea Prak

  ---
  Next Steps: Test Login Flow

  Now let's test the app with different roles. Let me create a simple guide:

  1. Currently logged in: You're viewing an Institution Admin account
  2. To test other roles:
    - Go to Profile tab (far right) → Scroll down
    - Tap Logout button
    - Login with different credentials to see role-based navigation

  Recommended test sequence:
  1. ✅ Admin role: admin@tutorhub.com / admin123 → See AdminTabNavigator
  2. ✅ Student role: john@example.com / student123 → See StudentTabNavigator (with real
  content)
  3. ✅ Tutor role: sarah@example.com / tutor123 → See TutorTabNavigator


Next Available Options

  Option 1: Continue Phase 5 - TIER 3 Screens (Estimated 2-3 hours)

  - MyCourseScreen - User's enrolled courses
  - MentorProfileScreen - Mentor details
  - TopMentorsScreen - Mentor directory
  - HelpCenterScreen - Support/FAQ
  - PrivacyPolicyScreen - Legal
  - SettingsLanguage - Localization
  - SettingsNotifications - Notification preferences
  - SettingsPayment - Payment settings
  - SettingsSecurity - Security options
  - InviteFriends - Referral system

  Option 2: Test Current Implementation (Estimated 1-2 hours)

  - Run all 11 screens on iOS simulator
  - Test navigation flows between screens
  - Verify form validation works
  - Check dark mode on each screen
  - Test search/filter functionality
  - Verify list scrolling performance

  Option 3: Integrate with Main Navigation (Estimated 1-2 hours)

  - Update AppNavigator with all 11 new screens
  - Set up proper screen stack configuration
  - Configure bottom tab navigation
  - Test full navigation flow
  - Set up deep linking (optional)

  Option 4: Connect to Real APIs (Estimated varies)

  - Set up API service layer
  - Replace mock data with real endpoints
  - Implement error handling
  - Add loading states for all API calls
  - Set up authentication flow