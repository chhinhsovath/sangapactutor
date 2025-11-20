/**
 * HomeScreen Component (Phase 5)
 * Main dashboard screen with banners, courses, and mentors
 * Adapted from EducatePro template
 *
 * Features:
 * - User greeting and profile quick access
 * - Search bar with filters
 * - Promotional banners carousel
 * - Top mentors horizontal list
 * - Popular courses with category filters
 * - Dark mode support
 * - Navigation integration
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { EDUCATEPRO_ICONS } from '../../constants/educatepro-icons';
import { SectionHeader, CourseCard } from '../../components/EducatePro';

// Mock data - Replace with API calls in production
const MOCK_BANNERS = [
  {
    id: '1',
    discount: '50%',
    discountName: 'Summer Sale',
    bottomTitle: 'Limited Time Offer',
    bottomSubtitle: 'Get 50% off on all courses',
  },
  {
    id: '2',
    discount: '30%',
    discountName: 'Weekend Deal',
    bottomTitle: 'Exclusive Discount',
    bottomSubtitle: 'Valid for this weekend only',
  },
];

const MOCK_CATEGORIES = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Web Development' },
  { id: '3', name: 'Mobile Apps' },
  { id: '4', name: 'UI/UX Design' },
];

const MOCK_COURSES = [
  {
    id: '1',
    name: 'Advanced React Patterns',
    image: require('../../../assets/illustrations/success.png'),
    category: 'Web Development',
    categoryId: '2',
    price: '49.99',
    oldPrice: '99.99',
    isOnDiscount: true,
    rating: '4.8',
    numStudents: '1,234',
  },
  {
    id: '2',
    name: 'Mobile Development Masterclass',
    image: require('../../../assets/illustrations/fingerprint.png'),
    category: 'Mobile Apps',
    categoryId: '3',
    price: '59.99',
    oldPrice: '119.99',
    isOnDiscount: true,
    rating: '4.9',
    numStudents: '2,456',
  },
];

const MOCK_MENTORS = [
  {
    id: '1',
    firstName: 'Sarah',
    avatar: require('../../../assets/illustrations/success.png'),
  },
  {
    id: '2',
    firstName: 'John',
    avatar: require('../../../assets/illustrations/fingerprint.png'),
  },
  {
    id: '3',
    firstName: 'Emma',
    avatar: require('../../../assets/illustrations/password.png'),
  },
];

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState(['1']);
  const [isDark] = useState(false);

  // Filter courses based on selected categories
  const filteredCourses = MOCK_COURSES.filter(
    (course) =>
      selectedCategories.includes('1') ||
      selectedCategories.includes(course.categoryId)
  );

  /**
   * Render header with user greeting and quick actions
   */
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.viewLeft}>
        <Image
          source={require('../../../assets/icon.png')}
          resizeMode="contain"
          style={styles.userIcon}
        />
        <View style={styles.viewNameContainer}>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text
            style={[
              styles.userName,
              {
                color: isDark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            User Name
          </Text>
        </View>
      </View>

      <View style={styles.viewRight}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <Image
            source={EDUCATEPRO_ICONS.notificationBell}
            resizeMode="contain"
            style={[
              styles.iconButton,
              {
                tintColor: isDark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Bookmark')}
          activeOpacity={0.7}
          style={{ marginLeft: 12 }}
        >
          <Image
            source={EDUCATEPRO_ICONS.bookmarkOutline}
            resizeMode="contain"
            style={[
              styles.iconButton,
              {
                tintColor: isDark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Render search bar
   */
  const renderSearchBar = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Search')}
      activeOpacity={0.9}
      style={[
        styles.searchBarContainer,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
        },
      ]}
    >
      <Image
        source={EDUCATEPRO_ICONS.search}
        resizeMode="contain"
        style={styles.searchIcon}
      />
      <TextInput
        placeholder="Search courses..."
        placeholderTextColor={COLORS.gray}
        style={styles.searchInput}
        editable={false}
      />
      <Image
        source={EDUCATEPRO_ICONS.filter}
        resizeMode="contain"
        style={styles.filterIcon}
      />
    </TouchableOpacity>
  );

  /**
   * Render promotional banners with carousel
   */
  const renderBannerItem = ({ item }: any) => (
    <View
      style={[
        styles.bannerContainer,
        {
          width: SIZES.width - SIZES.padding * 2,
        },
      ]}
    >
      <View style={styles.bannerTopContainer}>
        <View>
          <Text style={styles.bannerDiscount}>{item.discount} OFF</Text>
          <Text style={styles.bannerDiscountName}>{item.discountName}</Text>
        </View>
        <Text style={styles.bannerDiscountNum}>{item.discount}</Text>
      </View>
      <View style={styles.bannerBottomContainer}>
        <Text style={styles.bannerBottomTitle}>{item.bottomTitle}</Text>
        <Text style={styles.bannerBottomSubtitle}>{item.bottomSubtitle}</Text>
      </View>
    </View>
  );

  const renderBanner = () => (
    <View style={styles.bannerSection}>
      <FlatList
        data={MOCK_BANNERS}
        renderItem={renderBannerItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / (SIZES.width - SIZES.padding * 2)
          );
          setCurrentBannerIndex(newIndex);
        }}
      />
      <View style={styles.dotsContainer}>
        {MOCK_BANNERS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentBannerIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );

  /**
   * Render top mentors section
   */
  const renderMentorItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('MentorProfile')}
      activeOpacity={0.7}
      style={styles.mentorCard}
    >
      <Image
        source={item.avatar}
        resizeMode="cover"
        style={styles.mentorAvatar}
      />
      <Text
        style={[
          styles.mentorName,
          {
            color: isDark ? COLORS.white : COLORS.greyscale900,
          },
        ]}
      >
        {item.firstName}
      </Text>
    </TouchableOpacity>
  );

  const renderTopMentors = () => (
    <View>
      <SectionHeader
        title="Top Mentors"
        onSeeAll={() => navigation.navigate('TopMentors')}
        isDark={isDark}
      />
      <FlatList
        data={MOCK_MENTORS}
        renderItem={renderMentorItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );

  /**
   * Render popular courses section with category filters
   */
  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        {
          backgroundColor: selectedCategories.includes(item.id)
            ? COLORS.primary
            : 'transparent',
          borderColor: COLORS.primary,
        },
      ]}
      onPress={() => toggleCategory(item.id)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.categoryText,
          {
            color: selectedCategories.includes(item.id)
              ? COLORS.white
              : COLORS.primary,
          },
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const toggleCategory = (categoryId: string) => {
    const updatedCategories = [...selectedCategories];
    const index = updatedCategories.indexOf(categoryId);

    if (index === -1) {
      updatedCategories.push(categoryId);
    } else {
      updatedCategories.splice(index, 1);
    }

    setSelectedCategories(updatedCategories);
  };

  const renderPopularCourses = () => (
    <View>
      <SectionHeader
        title="Popular Courses"
        onSeeAll={() => navigation.navigate('AllCourses')}
        isDark={isDark}
      />
      <FlatList
        data={MOCK_CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ marginBottom: SIZES.padding }}
      />
      <FlatList
        data={filteredCourses}
        renderItem={({ item }) => (
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
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
          },
        ]}
      >
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderSearchBar()}
          {renderBanner()}
          {renderTopMentors()}
          {renderPopularCourses()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
    marginTop: SIZES.padding,
  },
  viewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  viewNameContainer: {
    marginLeft: SIZES.padding2,
  },
  greeting: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  viewRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 24,
    height: 24,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding2,
    height: 52,
    borderRadius: 12,
    marginVertical: SIZES.padding2,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.gray,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: SIZES.padding2,
    color: COLORS.black,
  },
  filterIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
  },
  bannerSection: {
    marginVertical: SIZES.padding,
  },
  bannerContainer: {
    height: 154,
    paddingHorizontal: 28,
    paddingTop: 20,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'space-between',
  },
  bannerTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bannerDiscount: {
    fontSize: 12,
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerDiscountName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  bannerDiscountNum: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.white,
  },
  bannerBottomContainer: {
    marginTop: 8,
  },
  bannerBottomTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  bannerBottomSubtitle: {
    fontSize: 13,
    color: COLORS.white,
    marginTop: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.greyscale300,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.white,
    width: 24,
  },
  mentorCard: {
    alignItems: 'center',
    marginRight: SIZES.padding,
    marginVertical: SIZES.base,
  },
  mentorAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  mentorName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HomeScreen;
