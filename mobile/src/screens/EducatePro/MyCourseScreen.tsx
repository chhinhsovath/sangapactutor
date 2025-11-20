/**
 * MyCourseScreen Component (Phase 5 - Tier 3)
 * Display user's enrolled courses with progress tracking
 * Adapted from EducatePro template
 *
 * Features:
 * - Enrolled courses list
 * - Progress bars for each course
 * - Continue learning button
 * - Course completion percentage
 * - Dark mode support
 * - Empty state UI
 * - Course filtering/sorting
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface EnrolledCourse {
  id: string;
  name: string;
  image: any;
  instructor: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  rating: string;
  category: string;
}

interface MyCourseScreenProps {
  navigation: any;
}

const MOCK_ENROLLED_COURSES: EnrolledCourse[] = [
  {
    id: '1',
    name: 'Advanced React Patterns',
    image: require('../../../assets/icon.png'),
    instructor: 'John Smith',
    progress: 75,
    lessonsCompleted: 12,
    totalLessons: 16,
    rating: '4.8',
    category: 'Web Development',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    image: require('../../../assets/icon.png'),
    instructor: 'Sarah Johnson',
    progress: 45,
    lessonsCompleted: 9,
    totalLessons: 20,
    rating: '4.6',
    category: 'Mobile',
  },
  {
    id: '3',
    name: 'UI/UX Design Masterclass',
    image: require('../../../assets/icon.png'),
    instructor: 'Emma Wilson',
    progress: 30,
    lessonsCompleted: 3,
    totalLessons: 10,
    rating: '4.9',
    category: 'Design',
  },
];

const MyCourseScreen = ({ navigation }: MyCourseScreenProps) => {
  const [isDark] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed'>(
    'all'
  );
  const [courses, setCourses] = useState(MOCK_ENROLLED_COURSES);

  /**
   * Get filtered courses
   */
  const getFilteredCourses = () => {
    if (selectedFilter === 'active') {
      return courses.filter((c) => c.progress < 100);
    }
    if (selectedFilter === 'completed') {
      return courses.filter((c) => c.progress === 100);
    }
    return courses;
  };

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
      <View style={styles.headerLeft}>
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
          My Courses
        </Text>
      </View>

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
   * Render filter tabs
   */
  const renderFilterTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
    >
      {['all', 'active', 'completed'].map((filter) => (
        <TouchableOpacity
          key={filter}
          onPress={() => setSelectedFilter(filter as 'all' | 'active' | 'completed')}
          style={[
            styles.filterButton,
            selectedFilter === filter && styles.filterButtonActive,
            {
              backgroundColor:
                selectedFilter === filter ? COLORS.primary : 'transparent',
              borderColor:
                selectedFilter === filter ? COLORS.primary : COLORS.greyscale300,
            },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              {
                color:
                  selectedFilter === filter ? COLORS.white : COLORS.greyscale600,
              },
            ]}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name="school-outline"
        size={64}
        color={COLORS.greyscale300}
      />
      <Text
        style={[
          styles.emptyStateTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        No Courses Yet
      </Text>
      <Text
        style={[
          styles.emptyStateSubtitle,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        Start learning by exploring our course catalog
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Search')}
        style={styles.emptyButton}
      >
        <Text style={styles.emptyButtonText}>Explore Courses</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render course item
   */
  const renderCourseItem = ({ item }: { item: EnrolledCourse }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('CourseDetails', { courseId: item.id })
      }
      style={[
        styles.courseCard,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.white,
          borderColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
        },
      ]}
      activeOpacity={0.7}
    >
      <Image
        source={item.image}
        resizeMode="cover"
        style={styles.courseImage}
      />

      <View style={styles.courseContent}>
        <Text
          style={[
            styles.courseCategory,
            {
              color: COLORS.primary,
            },
          ]}
        >
          {item.category}
        </Text>

        <Text
          style={[
            styles.courseName,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          {item.name}
        </Text>

        <Text
          style={[
            styles.instructorName,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          {item.instructor}
        </Text>

        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons
            name="star"
            size={14}
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
            {item.rating}
          </Text>
        </View>

        <View style={styles.progressSection}>
          <View
            style={[
              styles.progressBar,
              {
                backgroundColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${item.progress}%`,
                  backgroundColor: COLORS.primary,
                },
              ]}
            />
          </View>

          <View style={styles.progressInfo}>
            <Text
              style={[
                styles.progressPercentage,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              {item.progress}%
            </Text>
            <Text
              style={[
                styles.lessonsCount,
                {
                  color: isDark ? COLORS.gray : COLORS.greyscale600,
                },
              ]}
            >
              {item.lessonsCompleted}/{item.totalLessons} lessons
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor: COLORS.primary,
            },
          ]}
          activeOpacity={0.7}
        >
          <Text style={styles.continueButtonText}>
            {item.progress === 100 ? 'Review' : 'Continue Learning'}
          </Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={16}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const filteredCourses = getFilteredCourses();

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
      {renderFilterTabs()}

      {filteredCourses.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredCourses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        />
      )}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: SIZES.padding2,
  },
  filterContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
  },
  filterContent: {
    gap: SIZES.padding2,
  },
  filterButton: {
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.base,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  filterButtonActive: {
    borderWidth: 0,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  courseCard: {
    marginBottom: SIZES.padding,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 180,
  },
  courseContent: {
    padding: SIZES.padding2,
  },
  courseCategory: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  courseName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  progressSection: {
    marginBottom: SIZES.padding2,
  },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '700',
  },
  lessonsCount: {
    fontSize: 11,
    fontWeight: '500',
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.base,
    paddingVertical: 10,
    borderRadius: 8,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: SIZES.padding * 2,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MyCourseScreen;
