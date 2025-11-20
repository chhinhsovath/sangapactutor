/**
 * MentorProfileScreen Component (Phase 5 - Tier 3)
 * Display mentor profile with details and reviews
 * Adapted from EducatePro template
 *
 * Features:
 * - Mentor avatar and bio
 * - Mentor statistics (students, courses, rating)
 * - Tab navigation (About, Courses, Reviews)
 * - Reviews list
 * - Message button
 * - Book session button
 * - Follow/Unfollow functionality
 * - Dark mode support
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { Button, ReviewCard } from '../../components/EducatePro';

interface MentorProfileScreenProps {
  navigation: any;
  route?: any;
}

const MOCK_MENTOR = {
  id: '1',
  fullName: 'Sarah Johnson',
  position: 'Senior UI Designer',
  avatar: require('../../../assets/icon.png'),
  bio: 'Passionate about creating beautiful and user-friendly interfaces. With 10+ years of experience in UI/UX design.',
  rating: '4.8',
  totalReviews: '234',
  totalStudents: '5,234',
  coursesCreated: '12',
  hourlyRate: '50',
};

const MOCK_REVIEWS = [
  {
    id: '1',
    author: 'John Doe',
    rating: '5',
    comment: 'Amazing teacher! Very knowledgeable and patient.',
    date: '2 weeks ago',
  },
  {
    id: '2',
    author: 'Jane Smith',
    rating: '5',
    comment: 'Best UI/UX course I\'ve taken. Highly recommended!',
    date: '1 month ago',
  },
  {
    id: '3',
    author: 'Mike Wilson',
    rating: '4',
    comment: 'Great content, would love more advanced topics.',
    date: '2 months ago',
  },
];

const MOCK_COURSES = [
  { id: '1', name: 'UI Design Fundamentals', students: '1,234' },
  { id: '2', name: 'Advanced UI/UX Patterns', students: '892' },
  { id: '3', name: 'Mobile App Design', students: '756' },
];

const MentorProfileScreen = ({
  navigation,
  route,
}: MentorProfileScreenProps) => {
  const [isDark] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'courses' | 'reviews'>(
    'about'
  );
  const [isFollowing, setIsFollowing] = useState(false);

  /**
   * Render header
   */
  const renderHeader = () => (
    <View
      style={[
        styles.header,
        {
          backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
          borderBottomColor: isDark ? COLORS.dark2 : COLORS.greyscale200,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={isDark ? COLORS.white : COLORS.black}
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.headerTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Mentor Profile
      </Text>

      <TouchableOpacity activeOpacity={0.7}>
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color={isDark ? COLORS.white : COLORS.greyscale900}
        />
      </TouchableOpacity>
    </View>
  );

  /**
   * Render mentor info section
   */
  const renderMentorInfo = () => (
    <View
      style={[
        styles.infoSection,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
        },
      ]}
    >
      <Image
        source={MOCK_MENTOR.avatar}
        resizeMode="cover"
        style={styles.avatar}
      />

      <Text
        style={[
          styles.mentorName,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        {MOCK_MENTOR.fullName}
      </Text>

      <Text
        style={[
          styles.mentorPosition,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        {MOCK_MENTOR.position}
      </Text>

      <View style={styles.ratingContainer}>
        <MaterialCommunityIcons
          name="star"
          size={16}
          color={COLORS.primary}
        />
        <Text
          style={[
            styles.ratingText,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          {MOCK_MENTOR.rating}
        </Text>
        <Text
          style={[
            styles.reviewsText,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          ({MOCK_MENTOR.totalReviews} reviews)
        </Text>
      </View>

      <Text
        style={[
          styles.bio,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        {MOCK_MENTOR.bio}
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text
            style={[
              styles.statValue,
              {
                color: COLORS.primary,
              },
            ]}
          >
            {MOCK_MENTOR.totalStudents}
          </Text>
          <Text
            style={[
              styles.statLabel,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            Students
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text
            style={[
              styles.statValue,
              {
                color: COLORS.primary,
              },
            ]}
          >
            {MOCK_MENTOR.coursesCreated}
          </Text>
          <Text
            style={[
              styles.statLabel,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            Courses
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text
            style={[
              styles.statValue,
              {
                color: COLORS.primary,
              },
            ]}
          >
            ${MOCK_MENTOR.hourlyRate}
          </Text>
          <Text
            style={[
              styles.statLabel,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            Per Hour
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={isFollowing ? 'Following' : 'Follow'}
          onPress={() => setIsFollowing(!isFollowing)}
          filled={isFollowing}
          color={isFollowing ? COLORS.primary : COLORS.greyscale200}
          textColor={isFollowing ? COLORS.white : COLORS.black}
          style={{ flex: 1, marginRight: SIZES.padding2 }}
        />

        <Button
          title="Message"
          onPress={() => navigation.navigate('Chat')}
          filled
          style={{ flex: 1 }}
        />
      </View>

      <Button
        title="Book Session"
        onPress={() => {
          // TODO: Navigate to booking screen
        }}
        filled
        style={{ marginTop: SIZES.padding2 }}
      />
    </View>
  );

  /**
   * Render tab navigation
   */
  const renderTabBar = () => (
    <View
      style={[
        styles.tabBar,
        {
          borderBottomColor: isDark ? COLORS.dark2 : COLORS.greyscale200,
        },
      ]}
    >
      {['about', 'courses', 'reviews'].map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab as 'about' | 'courses' | 'reviews')}
          style={[
            styles.tabButton,
            activeTab === tab && styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === tab ? COLORS.primary : COLORS.greyscale600,
                fontWeight: activeTab === tab ? '700' : '500',
              },
            ]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  /**
   * Render about tab
   */
  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        About
      </Text>

      <Text
        style={[
          styles.aboutText,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        {MOCK_MENTOR.bio}
      </Text>

      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
            marginTop: SIZES.padding * 1.5,
          },
        ]}
      >
        Experience
      </Text>

      <View
        style={[
          styles.experienceItem,
          {
            backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="briefcase-outline"
          size={24}
          color={COLORS.primary}
        />
        <View style={{ flex: 1, marginLeft: SIZES.padding2 }}>
          <Text
            style={[
              styles.experienceTitle,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Senior UI Designer
          </Text>
          <Text
            style={[
              styles.experienceCompany,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            Tech Company Inc. • 8 years
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.experienceItem,
          {
            backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="briefcase-outline"
          size={24}
          color={COLORS.primary}
        />
        <View style={{ flex: 1, marginLeft: SIZES.padding2 }}>
          <Text
            style={[
              styles.experienceTitle,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            UI/UX Designer
          </Text>
          <Text
            style={[
              styles.experienceCompany,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            Design Studio • 2 years
          </Text>
        </View>
      </View>
    </View>
  );

  /**
   * Render courses tab
   */
  const renderCoursesTab = () => (
    <View style={styles.tabContent}>
      {MOCK_COURSES.map((course) => (
        <TouchableOpacity
          key={course.id}
          style={[
            styles.courseItem,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
          onPress={() =>
            navigation.navigate('CourseDetails', { courseId: course.id })
          }
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="book-outline"
            size={24}
            color={COLORS.primary}
          />
          <View style={{ flex: 1, marginLeft: SIZES.padding2 }}>
            <Text
              style={[
                styles.courseName,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              {course.name}
            </Text>
            <Text
              style={[
                styles.courseStudents,
                {
                  color: isDark ? COLORS.gray : COLORS.greyscale600,
                },
              ]}
            >
              {course.students} students
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={COLORS.greyscale300}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  /**
   * Render reviews tab
   */
  const renderReviewsTab = () => (
    <View style={styles.tabContent}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Recent Reviews
      </Text>

      {MOCK_REVIEWS.map((review) => (
        <View
          key={review.id}
          style={[
            styles.reviewItem,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
        >
          <View style={styles.reviewHeader}>
            <Text
              style={[
                styles.reviewAuthor,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              {review.author}
            </Text>
            <Text
              style={[
                styles.reviewDate,
                {
                  color: isDark ? COLORS.gray : COLORS.greyscale600,
                },
              ]}
            >
              {review.date}
            </Text>
          </View>

          <View style={styles.reviewRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialCommunityIcons
                key={star}
                name="star"
                size={14}
                color={
                  star <= parseInt(review.rating) ? COLORS.primary : COLORS.gray
                }
              />
            ))}
          </View>

          <Text
            style={[
              styles.reviewComment,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            {review.comment}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
        },
      ]}
    >
      {renderHeader()}

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderMentorInfo()}
        {renderTabBar()}

        {activeTab === 'about' && renderAboutTab()}
        {activeTab === 'courses' && renderCoursesTab()}
        {activeTab === 'reviews' && renderReviewsTab()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  infoSection: {
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 1.5,
    borderRadius: 12,
    marginHorizontal: SIZES.padding,
    marginVertical: SIZES.padding,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SIZES.padding2,
  },
  mentorName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  mentorPosition: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: SIZES.padding,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
    marginRight: 4,
  },
  reviewsText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bio: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: SIZES.padding,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: SIZES.padding * 1.5,
    paddingVertical: SIZES.padding,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.greyscale200,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: SIZES.padding,
    marginTop: SIZES.padding,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SIZES.padding2,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
  },
  tabContent: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SIZES.padding,
  },
  aboutText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  experienceItem: {
    flexDirection: 'row',
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding2,
    alignItems: 'flex-start',
  },
  experienceTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  experienceCompany: {
    fontSize: 12,
    fontWeight: '500',
  },
  courseItem: {
    flexDirection: 'row',
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding2,
    alignItems: 'center',
  },
  courseName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  courseStudents: {
    fontSize: 12,
    fontWeight: '500',
  },
  reviewItem: {
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  reviewAuthor: {
    fontSize: 13,
    fontWeight: '700',
  },
  reviewDate: {
    fontSize: 11,
    fontWeight: '500',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: SIZES.base,
  },
  reviewComment: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
});

export default MentorProfileScreen;
