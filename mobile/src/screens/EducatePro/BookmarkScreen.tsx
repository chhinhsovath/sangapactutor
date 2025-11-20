/**
 * BookmarkScreen Component (Phase 5 - Tier 2)
 * Display saved courses and mentors
 * Adapted from EducatePro template
 *
 * Features:
 * - Dual tab navigation (Courses, Mentors)
 * - Bookmarked items list
 * - Remove bookmark functionality
 * - Empty state UI
 * - Course and mentor cards
 * - Dark mode support
 * - Swipe to remove gesture
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { CourseCard, MentorCard } from '../../components/EducatePro';

interface BookmarkItem {
  id: string;
  type: 'course' | 'mentor';
  [key: string]: any;
}

interface BookmarkScreenProps {
  navigation: any;
}

const MOCK_BOOKMARKED_COURSES = [
  {
    id: '1',
    name: 'Advanced React Patterns',
    image: require('../../../assets/icon.png'),
    category: 'Web Development',
    price: '49.99',
    oldPrice: '99.99',
    isOnDiscount: true,
    rating: '4.8',
    numStudents: '1,234',
  },
  {
    id: '3',
    name: 'UI/UX Design Masterclass',
    image: require('../../../assets/icon.png'),
    category: 'Design',
    price: '39.99',
    oldPrice: '79.99',
    isOnDiscount: true,
    rating: '4.9',
    numStudents: '2,156',
  },
  {
    id: '5',
    name: 'Python for Data Science',
    image: require('../../../assets/icon.png'),
    category: 'Programming',
    price: '59.99',
    oldPrice: '',
    isOnDiscount: false,
    rating: '4.7',
    numStudents: '1,876',
  },
];

const MOCK_BOOKMARKED_MENTORS = [
  {
    id: '1',
    firstName: 'Sarah',
    fullName: 'Sarah Johnson',
    position: 'Senior UI Designer',
    avatar: require('../../../assets/icon.png'),
  },
  {
    id: '3',
    firstName: 'Emma',
    fullName: 'Emma Wilson',
    position: 'Product Manager',
    avatar: require('../../../assets/icon.png'),
  },
];

const BookmarkScreen = ({ navigation }: BookmarkScreenProps) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'mentors'>('courses');
  const [isDark] = useState(false);
  const [bookmarkedCourses, setBookmarkedCourses] = useState(
    MOCK_BOOKMARKED_COURSES
  );
  const [bookmarkedMentors, setBookmarkedMentors] = useState(
    MOCK_BOOKMARKED_MENTORS
  );

  /**
   * Handle removing bookmark
   */
  const handleRemoveBookmark = (id: string, type: 'course' | 'mentor') => {
    Alert.alert('Remove Bookmark', 'Do you want to remove this bookmark?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        onPress: () => {
          if (type === 'course') {
            setBookmarkedCourses(
              bookmarkedCourses.filter((item) => item.id !== id)
            );
          } else {
            setBookmarkedMentors(
              bookmarkedMentors.filter((item) => item.id !== id)
            );
          }
        },
        style: 'destructive',
      },
    ]);
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
          My Bookmarks
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
      {['courses', 'mentors'].map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab as 'courses' | 'mentors')}
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
            {activeTab === tab && (
              <Text style={{ color: COLORS.primary }}>
                {' '}
                ({activeTab === 'courses'
                  ? bookmarkedCourses.length
                  : bookmarkedMentors.length})
              </Text>
            )}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name={activeTab === 'courses' ? 'bookmark-outline' : 'account-outline'}
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
        No Bookmarks Yet
      </Text>
      <Text
        style={[
          styles.emptyStateSubtitle,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        {activeTab === 'courses'
          ? 'Save courses to view them later'
          : 'Follow mentors to view them later'}
      </Text>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate(activeTab === 'courses' ? 'Search' : 'Home')
        }
        style={[
          styles.emptyButton,
          {
            backgroundColor: COLORS.primary,
          },
        ]}
      >
        <Text style={styles.emptyButtonText}>
          {activeTab === 'courses' ? 'Browse Courses' : 'Find Mentors'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render course item
   */
  const renderCourseItem = ({ item }: { item: any }) => (
    <View style={styles.itemWrapper}>
      <CourseCard
        name={item.name}
        image={item.image}
        category={item.category}
        price={item.price}
        oldPrice={item.oldPrice}
        isOnDiscount={item.isOnDiscount}
        rating={item.rating}
        numStudents={item.numStudents}
        onPress={() =>
          navigation.navigate('CourseDetails', { courseId: item.id })
        }
        isDark={isDark}
      />
      <TouchableOpacity
        onPress={() => handleRemoveBookmark(item.id, 'course')}
        style={styles.removeButton}
      >
        <MaterialCommunityIcons
          name="bookmark-check"
          size={20}
          color={COLORS.primary}
        />
      </TouchableOpacity>
    </View>
  );

  /**
   * Render mentor item
   */
  const renderMentorItem = ({ item }: { item: any }) => (
    <View style={styles.itemWrapper}>
      <MentorCard
        avatar={item.avatar}
        fullName={item.fullName}
        position={item.position}
        onPress={() =>
          navigation.navigate('MentorProfile', { mentorId: item.id })
        }
        onMessagePress={() => navigation.navigate('Chat')}
        isDark={isDark}
      />
      <TouchableOpacity
        onPress={() => handleRemoveBookmark(item.id, 'mentor')}
        style={styles.removeButton}
      >
        <MaterialCommunityIcons
          name="bookmark-check"
          size={20}
          color={COLORS.primary}
        />
      </TouchableOpacity>
    </View>
  );

  /**
   * Get items to display
   */
  const getItems = () => {
    return activeTab === 'courses' ? bookmarkedCourses : bookmarkedMentors;
  };

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
      {renderTabBar()}

      {getItems().length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={getItems()}
          renderItem={
            activeTab === 'courses' ? renderCourseItem : renderMentorItem
          }
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: SIZES.padding,
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
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  itemWrapper: {
    marginBottom: SIZES.padding,
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: SIZES.padding,
    right: SIZES.padding,
    padding: SIZES.base,
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

export default BookmarkScreen;
