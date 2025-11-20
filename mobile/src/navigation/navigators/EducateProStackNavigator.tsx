/**
 * EducatePro Stack Navigator
 * Manages all EducatePro app screens and navigation flow
 * Includes Tier 1-4 screens with proper linking
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

// Tier 1 - Foundational Screens (5)
import HomeScreen from '../../screens/EducatePro/HomeScreen';
import ProfileScreen from '../../screens/EducatePro/ProfileScreen';
import EditProfileScreen from '../../screens/EducatePro/EditProfileScreen';
import CourseDetailsScreen from '../../screens/EducatePro/CourseDetailsScreen';
import SearchScreen from '../../screens/EducatePro/SearchScreen';

// Tier 2 - Core Screens (6)
import ChatScreen from '../../screens/EducatePro/ChatScreen';
import LoginScreen from '../../screens/EducatePro/LoginScreen';
import SignupScreen from '../../screens/EducatePro/SignupScreen';
import BookmarkScreen from '../../screens/EducatePro/BookmarkScreen';
import NotificationsScreen from '../../screens/EducatePro/NotificationsScreen';
import ConfirmPaymentScreen from '../../screens/EducatePro/ConfirmPaymentScreen';

// Tier 3 - Support Screens (10)
import MyCourseScreen from '../../screens/EducatePro/MyCourseScreen';
import MentorProfileScreen from '../../screens/EducatePro/MentorProfileScreen';
import TopMentorsScreen from '../../screens/EducatePro/TopMentorsScreen';
import HelpCenterScreen from '../../screens/EducatePro/HelpCenterScreen';
import PrivacyPolicyScreen from '../../screens/EducatePro/PrivacyPolicyScreen';
import SettingsLanguageScreen from '../../screens/EducatePro/SettingsLanguageScreen';
import SettingsNotificationsScreen from '../../screens/EducatePro/SettingsNotificationsScreen';
import SettingsPaymentScreen from '../../screens/EducatePro/SettingsPaymentScreen';
import SettingsSecurityScreen from '../../screens/EducatePro/SettingsSecurityScreen';
import InviteFriendsScreen from '../../screens/EducatePro/InviteFriendsScreen';

// Tier 4 - Specialized Screens (10)
import LessonScreen from '../../screens/EducatePro/LessonScreen';
import LiveSessionScreen from '../../screens/EducatePro/LiveSessionScreen';
import CourseCreationScreen from '../../screens/EducatePro/CourseCreationScreen';
import AssignmentScreen from '../../screens/EducatePro/AssignmentScreen';
import QuizScreen from '../../screens/EducatePro/QuizScreen';
import CertificateScreen from '../../screens/EducatePro/CertificateScreen';
import MentorScheduleScreen from '../../screens/EducatePro/MentorScheduleScreen';
import WishlistScreen from '../../screens/EducatePro/WishlistScreen';
import DownloadedCoursesScreen from '../../screens/EducatePro/DownloadedCoursesScreen';
import LeaderboardScreen from '../../screens/EducatePro/LeaderboardScreen';

const Stack = createNativeStackNavigator();

export default function EducateProStackNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      {/* Tier 1 - Foundational Screens */}
      <Stack.Screen
        name="EducateProHome"
        component={HomeScreen}
        options={{
          title: t('educatepro.home'),
        }}
      />

      <Stack.Screen
        name="EducateProProfile"
        component={ProfileScreen}
        options={{
          title: t('educatepro.profile'),
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: t('educatepro.editProfile'),
        }}
      />

      <Stack.Screen
        name="CourseDetails"
        component={CourseDetailsScreen}
        options={{
          title: t('educatepro.courseDetails'),
        }}
      />

      <Stack.Screen
        name="EducateProSearch"
        component={SearchScreen}
        options={{
          title: t('educatepro.search'),
        }}
      />

      {/* Tier 2 - Core Screens */}
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: t('educatepro.chat'),
        }}
      />

      <Stack.Screen
        name="EducateProLogin"
        component={LoginScreen}
        options={{
          title: t('educatepro.login'),
        }}
      />

      <Stack.Screen
        name="EducateProSignup"
        component={SignupScreen}
        options={{
          title: t('educatepro.signup'),
        }}
      />

      <Stack.Screen
        name="Bookmarks"
        component={BookmarkScreen}
        options={{
          title: t('educatepro.bookmarks'),
        }}
      />

      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: t('educatepro.notifications'),
        }}
      />

      <Stack.Screen
        name="ConfirmPayment"
        component={ConfirmPaymentScreen}
        options={{
          title: t('educatepro.confirmPayment'),
        }}
      />

      {/* Tier 3 - Support Screens */}
      <Stack.Screen
        name="MyCourse"
        component={MyCourseScreen}
        options={{
          title: t('educatepro.myCourses'),
        }}
      />

      <Stack.Screen
        name="MentorProfile"
        component={MentorProfileScreen}
        options={{
          title: t('educatepro.mentorProfile'),
        }}
      />

      <Stack.Screen
        name="TopMentors"
        component={TopMentorsScreen}
        options={{
          title: t('educatepro.topMentors'),
        }}
      />

      <Stack.Screen
        name="HelpCenter"
        component={HelpCenterScreen}
        options={{
          title: t('educatepro.helpCenter'),
        }}
      />

      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          title: t('educatepro.privacyPolicy'),
        }}
      />

      <Stack.Screen
        name="SettingsLanguage"
        component={SettingsLanguageScreen}
        options={{
          title: t('educatepro.settings'),
        }}
      />

      <Stack.Screen
        name="SettingsNotifications"
        component={SettingsNotificationsScreen}
        options={{
          title: t('educatepro.settings'),
        }}
      />

      <Stack.Screen
        name="SettingsPayment"
        component={SettingsPaymentScreen}
        options={{
          title: t('educatepro.settings'),
        }}
      />

      <Stack.Screen
        name="SettingsSecurity"
        component={SettingsSecurityScreen}
        options={{
          title: t('educatepro.settings'),
        }}
      />

      <Stack.Screen
        name="InviteFriends"
        component={InviteFriendsScreen}
        options={{
          title: t('educatepro.inviteFriends'),
        }}
      />

      {/* Tier 4 - Specialized Screens */}
      <Stack.Screen
        name="Lesson"
        component={LessonScreen}
        options={{
          title: t('educatepro.lesson'),
        }}
      />

      <Stack.Screen
        name="LiveSession"
        component={LiveSessionScreen}
        options={{
          title: t('educatepro.liveSession'),
        }}
      />

      <Stack.Screen
        name="CreateCourse"
        component={CourseCreationScreen}
        options={{
          title: t('educatepro.createCourse'),
        }}
      />

      <Stack.Screen
        name="Assignment"
        component={AssignmentScreen}
        options={{
          title: t('educatepro.assignment'),
        }}
      />

      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          title: t('educatepro.quiz'),
        }}
      />

      <Stack.Screen
        name="Certificate"
        component={CertificateScreen}
        options={{
          title: t('educatepro.certificate'),
        }}
      />

      <Stack.Screen
        name="BookMentorSession"
        component={MentorScheduleScreen}
        options={{
          title: t('educatepro.bookSession'),
        }}
      />

      <Stack.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          title: t('educatepro.wishlist'),
        }}
      />

      <Stack.Screen
        name="DownloadedCourses"
        component={DownloadedCoursesScreen}
        options={{
          title: t('educatepro.downloadedCourses'),
        }}
      />

      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          title: t('educatepro.leaderboard'),
        }}
      />
    </Stack.Navigator>
  );
}
