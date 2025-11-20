# EducatePro Implementation Examples

Complete examples showing how to integrate API calls and state management into screens.
Copy these patterns to migrate all 31 screens from mock data to real API.

## Table of Contents
- [Example 1: HomeScreen](#example-1-homescreen)
- [Example 2: CourseDetailsScreen](#example-2-coursedetailsscreen)
- [Example 3: SearchScreen](#example-3-searchscreen)
- [Example 4: LeaderboardScreen](#example-4-leaderboardscreen)
- [Example 5: ConfirmPaymentScreen](#example-5-confirmpaymentscreen)
- [Example 6: DownloadedCoursesScreen](#example-6-downloadedcoursesscreen)
- [Integration Pattern Summary](#integration-pattern-summary)

---

## Example 1: HomeScreen

**Location**: `src/screens/EducatePro/HomeScreen.tsx`

### Before (Mock Data)
```typescript
import React, { useState } from 'react';
import { MOCK_COURSES, MOCK_MENTORS } from '../../data/mockData';

const HomeScreen = ({ navigation }) => {
  const [isDark] = useState(false);
  const [courses] = useState(MOCK_COURSES);
  const [mentors] = useState(MOCK_MENTORS);

  return (
    <SafeAreaView>
      <FlatList
        data={courses}
        renderItem={({ item }) => <CourseCard {...item} />}
      />
    </SafeAreaView>
  );
};
```

### After (Real API)
```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useCourses, useTopMentors, useCoursesByCategory } from '../../hooks/useEducatePro';
import { useApp } from '../../contexts/AppContext';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { CourseCard, MentorCard, Button } from '../../components/EducatePro';
import { showErrorToast } from '../../utils/toast';

const HomeScreen = ({ navigation }) => {
  // ============ STATE & HOOKS ============
  const { isDark } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  // API Hooks - with automatic caching
  const featuredCoursesQuery = useCourses(1, 5); // First page, 5 items
  const topMentorsQuery = useTopMentors(5);
  const categoryCoursesQuery = useCoursesByCategory(
    selectedCategory || 'web_development',
    pageNumber,
    10
  );

  // ============ ERROR HANDLING ============
  useEffect(() => {
    if (featuredCoursesQuery.error) {
      showErrorToast('Failed to load featured courses');
    }
  }, [featuredCoursesQuery.error]);

  useEffect(() => {
    if (topMentorsQuery.error) {
      showErrorToast('Failed to load top mentors');
    }
  }, [topMentorsQuery.error]);

  useEffect(() => {
    if (categoryCoursesQuery.error) {
      showErrorToast('Failed to load category courses');
    }
  }, [categoryCoursesQuery.error]);

  // ============ DATA EXTRACTION ============
  const featuredCourses = featuredCoursesQuery.data?.data || [];
  const topMentors = topMentorsQuery.data?.data || [];
  const categoryCourses = categoryCoursesQuery.data?.data || [];

  // ============ LOADING STATE ============
  const isLoading =
    featuredCoursesQuery.loading ||
    topMentorsQuery.loading ||
    categoryCoursesQuery.loading;

  // ============ HANDLERS ============
  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetails', { courseId });
  };

  const handleMentorPress = (mentorId: string) => {
    navigation.navigate('MentorProfile', { mentorId });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setPageNumber(1); // Reset to first page
  };

  const handleLoadMore = () => {
    if (!categoryCoursesQuery.loading && categoryCourses.length > 0) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([
      featuredCoursesQuery.refetch(),
      topMentorsQuery.refetch(),
      categoryCoursesQuery.refetch(),
    ]);
  };

  // ============ RENDER BANNER CAROUSEL ============
  const renderBanner = () => {
    if (!featuredCourses.length) return null;

    return (
      <View style={styles.bannerSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bannerScroll}
        >
          {featuredCourses.map((course) => (
            <TouchableOpacity
              key={course.id}
              onPress={() => handleCoursePress(course.id)}
              style={[
                styles.bannerCard,
                { backgroundColor: COLORS.primary },
              ]}
            >
              <Text style={styles.bannerTitle}>{course.title}</Text>
              <Text style={styles.bannerPrice}>${course.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // ============ RENDER CATEGORY FILTERS ============
  const renderCategories = () => {
    const categories = [
      'web_development',
      'mobile_development',
      'design',
      'business',
      'data_science',
      'marketing',
    ];

    return (
      <View style={styles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => handleCategorySelect(category)}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
                {
                  backgroundColor:
                    selectedCategory === category
                      ? COLORS.primary
                      : isDark
                      ? COLORS.dark2
                      : COLORS.greyscale50,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color:
                      selectedCategory === category ? COLORS.white : COLORS.greyscale600,
                  },
                ]}
              >
                {category.replace('_', ' ').toTitleCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // ============ RENDER FEATURED COURSES ============
  const renderFeaturedCourses = () => {
    if (featuredCoursesQuery.loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    return (
      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? COLORS.white : COLORS.black }]}>
            Featured Courses
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('EducateProSearch')}>
            <Text style={{ color: COLORS.primary, fontWeight: '600' }}>View All</Text>
          </TouchableOpacity>
        </View>

        {featuredCourses.map((course) => (
          <CourseCard
            key={course.id}
            name={course.title}
            image={course.thumbnail ? { uri: course.thumbnail } : require('../../../assets/icon.png')}
            instructor={course.instructor.firstName}
            price={course.price}
            oldPrice={course.originalPrice}
            rating={course.rating.toString()}
            category={course.category}
            onPress={() => handleCoursePress(course.id)}
            isDark={isDark}
          />
        ))}
      </View>
    );
  };

  // ============ RENDER TOP MENTORS ============
  const renderTopMentors = () => {
    if (topMentorsQuery.loading) {
      return null;
    }

    return (
      <View style={styles.mentorsSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? COLORS.white : COLORS.black }]}>
            Top Mentors
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('TopMentors')}>
            <Text style={{ color: COLORS.primary, fontWeight: '600' }}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mentorsScroll}
        >
          {topMentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              name={mentor.firstName}
              avatar={mentor.avatar ? { uri: mentor.avatar } : require('../../../assets/icon.png')}
              specialization={mentor.specialization}
              rating={mentor.rating.toString()}
              price={mentor.hourlyRate}
              onPress={() => handleMentorPress(mentor.id)}
              isDark={isDark}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  // ============ RENDER CATEGORY COURSES ============
  const renderCategoryCourses = () => {
    if (categoryCoursesQuery.loading && pageNumber === 1) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    return (
      <View style={styles.coursesSection}>
        <Text style={[styles.sectionTitle, { color: isDark ? COLORS.white : COLORS.black }]}>
          {selectedCategory?.replace('_', ' ').toTitleCase()} Courses
        </Text>

        {categoryCourses.map((course) => (
          <CourseCard
            key={course.id}
            name={course.title}
            image={course.thumbnail ? { uri: course.thumbnail } : require('../../../assets/icon.png')}
            instructor={course.instructor.firstName}
            price={course.price}
            oldPrice={course.originalPrice}
            rating={course.rating.toString()}
            category={course.category}
            onPress={() => handleCoursePress(course.id)}
            isDark={isDark}
          />
        ))}

        {/* Load More Button */}
        {categoryCourses.length > 0 && (
          <Button
            title={categoryCoursesQuery.loading ? 'Loading...' : 'Load More'}
            onPress={handleLoadMore}
            filled={false}
            style={{ marginTop: SIZES.padding }}
            disabled={categoryCoursesQuery.loading}
          />
        )}
      </View>
    );
  };

  // ============ MAIN RENDER ============
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? COLORS.dark1 : COLORS.white },
      ]}
    >
      <FlatList
        data={[]} // Use FlatList's ListHeaderComponent pattern
        ListHeaderComponent={
          <>
            {renderBanner()}
            {renderCategories()}
            {renderFeaturedCourses()}
            {renderTopMentors()}
            {renderCategoryCourses()}
          </>
        }
        ListFooterComponent={<View style={{ height: SIZES.padding * 2 }} />}
        refreshing={isLoading}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bannerSection: { paddingVertical: SIZES.padding },
  bannerScroll: { paddingHorizontal: SIZES.padding },
  bannerCard: { borderRadius: 12, padding: SIZES.padding * 1.5, marginRight: SIZES.padding },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.white },
  bannerPrice: { fontSize: 14, color: COLORS.white, marginTop: SIZES.padding },
  categorySection: { paddingHorizontal: SIZES.padding, marginBottom: SIZES.padding },
  categoryScroll: {},
  categoryChip: { paddingHorizontal: SIZES.padding, paddingVertical: SIZES.padding2, borderRadius: 20, marginRight: SIZES.padding2 },
  categoryChipActive: { borderWidth: 1, borderColor: COLORS.primary },
  categoryChipText: { fontWeight: '600', fontSize: 12 },
  featuredSection: { paddingHorizontal: SIZES.padding, marginBottom: SIZES.padding * 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.padding },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  mentorsSection: { paddingHorizontal: SIZES.padding, marginBottom: SIZES.padding * 2 },
  mentorsScroll: { marginTop: SIZES.padding },
  coursesSection: { paddingHorizontal: SIZES.padding, marginBottom: SIZES.padding * 2 },
});

export default HomeScreen;
```

---

## Example 2: CourseDetailsScreen

**Location**: `src/screens/EducatePro/CourseDetailsScreen.tsx`

### Key Changes
```typescript
import { useCourseDetail, useMutateBookmark, useReviews } from '../../hooks/useEducatePro';
import { useCart } from '../../contexts/CartContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const CourseDetailsScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const { isDark } = useApp();
  const { addToCart, isInCart } = useCart();

  // ============ API CALLS ============
  const courseQuery = useCourseDetail(courseId);
  const reviewsQuery = useReviews('course', courseId);
  const { toggleBookmark } = useMutateBookmark();

  const course = courseQuery.data?.data;
  const reviews = reviewsQuery.data?.data || [];

  // ============ ERROR HANDLING ============
  useEffect(() => {
    if (courseQuery.error) {
      showErrorToast('Failed to load course details');
    }
  }, [courseQuery.error]);

  // ============ HANDLERS ============
  const handleEnroll = async () => {
    if (!course) return;

    if (isInCart(courseId)) {
      showErrorToast('Course already in cart');
      return;
    }

    addToCart(course);
    showSuccessToast('Added to cart!');
    navigation.navigate('ConfirmPayment');
  };

  const handleBookmark = async () => {
    try {
      await toggleBookmark('course', courseId);
      courseQuery.refetch();
      showSuccessToast(course?.isSaved ? 'Removed from bookmarks' : 'Added to bookmarks');
    } catch (error) {
      showErrorToast('Failed to bookmark course');
    }
  };

  // ============ LOADING STATE ============
  if (courseQuery.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Course not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  // ============ RENDER ============
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header with image */}
        <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />

        {/* Title & Info */}
        <View style={styles.header}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.instructor}>{course.instructor.firstName}</Text>
          <View style={styles.ratingRow}>
            <Stars rating={course.rating} />
            <Text style={styles.reviewCount}>({course.reviewCount})</Text>
          </View>
        </View>

        {/* Price & Action */}
        <View style={styles.priceSection}>
          <View>
            <Text style={styles.price}>${course.price}</Text>
            {course.originalPrice && (
              <Text style={styles.originalPrice}>${course.originalPrice}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleBookmark}
            style={styles.bookmarkButton}
          >
            <MaterialCommunityIcons
              name={course.isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <TabNavigator
          tabs={['Lessons', 'Reviews', 'Instructor']}
          onTabChange={(tab) => setActiveTab(tab)}
        >
          {activeTab === 'Lessons' && (
            <FlatList
              data={course.lessons}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Lesson', { lessonId: item.id })}
                  style={styles.lessonItem}
                >
                  <MaterialCommunityIcons name="play-circle" size={20} />
                  <View style={{ flex: 1, marginLeft: SIZES.padding }}>
                    <Text style={styles.lessonTitle}>{item.title}</Text>
                    <ProgressBar value={item.isCompleted ? 1 : 0} />
                  </View>
                </TouchableOpacity>
              )}
              scrollEnabled={false}
            />
          )}

          {activeTab === 'Reviews' && (
            <FlatList
              data={reviews}
              renderItem={({ item }) => (
                <ReviewCard
                  name={item.student?.firstName}
                  rating={item.rating}
                  text={item.text}
                  date={formatDate(item.createdAt)}
                />
              )}
              scrollEnabled={false}
            />
          )}

          {activeTab === 'Instructor' && (
            <InstructorSection instructor={course.instructor} />
          )}
        </TabNavigator>

        {/* Enroll Button */}
        <Button
          title="Enroll Now"
          onPress={handleEnroll}
          filled
          style={styles.enrollButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
```

---

## Example 3: SearchScreen

**Location**: `src/screens/EducatePro/SearchScreen.tsx`

### Key Changes
```typescript
import { useCourseSearch, useMentorSearch } from '../../hooks/useEducatePro';
import { debounce } from '../../utils/helpers';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'courses' | 'mentors'>('courses');

  // API Hooks - only trigger search if query is not empty
  const coursesQuery = useCourseSearch(searchQuery, 1, 10);
  const mentorsQuery = useMentorSearch(searchQuery, 1, 10);

  const courses = coursesQuery.data?.data || [];
  const mentors = mentorsQuery.data?.data || [];

  // Debounced search to avoid excessive API calls
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  const handleSearchChange = (text: string) => {
    debouncedSearch(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Input */}
      <Input
        placeholder="Search courses or mentors..."
        onChangeText={handleSearchChange}
        leftIcon="magnify"
      />

      {/* Tab Navigation */}
      <TabBar
        tabs={['Courses', 'Mentors']}
        activeTab={activeTab === 'courses' ? 0 : 1}
        onTabChange={(index) => setActiveTab(index === 0 ? 'courses' : 'mentors')}
      />

      {/* Search Results */}
      {activeTab === 'courses' ? (
        <FlatList
          data={courses}
          renderItem={({ item }) => (
            <CourseCard
              {...item}
              onPress={() => navigation.navigate('CourseDetails', { courseId: item.id })}
            />
          )}
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <Text style={styles.emptyText}>No courses found</Text>
            ) : (
              <Text style={styles.hintText}>Start typing to search</Text>
            )
          }
          refreshing={coursesQuery.loading}
          onRefresh={coursesQuery.refetch}
        />
      ) : (
        <FlatList
          data={mentors}
          renderItem={({ item }) => (
            <MentorCard
              {...item}
              onPress={() => navigation.navigate('MentorProfile', { mentorId: item.id })}
            />
          )}
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <Text style={styles.emptyText}>No mentors found</Text>
            ) : (
              <Text style={styles.hintText}>Start typing to search</Text>
            )
          }
          refreshing={mentorsQuery.loading}
          onRefresh={mentorsQuery.refetch}
        />
      )}
    </SafeAreaView>
  );
};
```

---

## Example 4: LeaderboardScreen

**Location**: `src/screens/EducatePro/LeaderboardScreen.tsx`

### Key Changes
```typescript
import { useLeaderboard, useUserRank } from '../../hooks/useEducatePro';

const LeaderboardScreen = ({ navigation }) => {
  const [period, setPeriod] = useState<'overall' | 'weekly' | 'monthly'>('overall');

  // API Calls
  const leaderboardQuery = useLeaderboard(period);
  const userRankQuery = useUserRank(period);

  const leaderboard = leaderboardQuery.data?.data || [];
  const userRank = userRankQuery.data?.data;

  const isLoading = leaderboardQuery.loading || userRankQuery.loading;

  const handlePeriodChange = (newPeriod: 'overall' | 'weekly' | 'monthly') => {
    setPeriod(newPeriod);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* User Stats Card */}
      {userRank && (
        <View style={styles.userStatsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Your Rank</Text>
            <Text style={styles.statValue}>#{userRank.rank}</Text>
          </View>
          <Divider />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Points</Text>
            <Text style={styles.statValue}>{userRank.points}</Text>
          </View>
          <Divider />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Courses</Text>
            <Text style={styles.statValue}>{userRank.coursesCompleted}</Text>
          </View>
        </View>
      )}

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(['overall', 'weekly', 'monthly'] as const).map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => handlePeriodChange(p)}
            style={[
              styles.periodButton,
              period === p && styles.periodButtonActive,
            ]}
          >
            <Text style={styles.periodButtonText}>{p.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Leaderboard List */}
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={leaderboard}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MentorProfile', { mentorId: item.userId })
              }
              style={styles.leaderboardItem}
            >
              {/* Rank Badge */}
              <View style={styles.rankBadge}>
                {item.rank <= 3 ? (
                  <MaterialCommunityIcons
                    name={['trophy', 'medal', 'award'][item.rank - 1]}
                    size={20}
                    color={['#FFD700', '#C0C0C0', '#CD7F32'][item.rank - 1]}
                  />
                ) : (
                  <Text style={styles.rankNumber}>#{item.rank}</Text>
                )}
              </View>

              {/* User Info */}
              <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.user.firstName}</Text>
                <Text style={styles.userLevel}>{item.level}</Text>
              </View>

              {/* Points */}
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsValue}>{item.points}</Text>
                <Text style={styles.pointsLabel}>pts</Text>
              </View>
            </TouchableOpacity>
          )}
          refreshing={isLoading}
          onRefresh={() => {
            leaderboardQuery.refetch();
            userRankQuery.refetch();
          }}
        />
      )}
    </SafeAreaView>
  );
};
```

---

## Example 5: ConfirmPaymentScreen

**Location**: `src/screens/EducatePro/ConfirmPaymentScreen.tsx`

### Key Changes
```typescript
import { useCart } from '../contexts/CartContext';
import { usePaymentMethods, useMutateMentorSession } from '../hooks/useEducatePro';
import educateProService from '../services/educatepro.service';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const ConfirmPaymentScreen = ({ navigation }) => {
  const {
    items,
    subtotal,
    tax,
    discount,
    total,
    promoCode,
    applyPromoCode,
    removePromoCode,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    billingAddress,
    setBillingAddress,
    isProcessing,
    setIsProcessing,
    clearCart,
  } = useCart();

  // API Calls
  const paymentMethodsQuery = usePaymentMethods();
  const paymentMethods = paymentMethodsQuery.data?.data || [];

  // Form State
  const [promoInput, setPromoInput] = useState('');

  // ============ HANDLERS ============
  const handleApplyPromo = async () => {
    const success = await applyPromoCode(promoInput);
    if (success) {
      showSuccessToast('Promo code applied!');
      setPromoInput('');
    } else {
      showErrorToast('Invalid promo code');
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethodId) {
      showErrorToast('Please select a payment method');
      return;
    }

    if (!billingAddress?.fullName) {
      showErrorToast('Please enter billing address');
      return;
    }

    setIsProcessing(true);

    try {
      // Enroll in all courses in cart
      for (const item of items) {
        await educateProService.enrollCourse(item.courseId);
      }

      // Process payment
      const paymentResult = await educateProService.processPayment({
        courseIds: items.map((i) => i.courseId),
        paymentMethodId: selectedPaymentMethodId,
        promoCode: promoCode?.code,
      });

      showSuccessToast('Payment successful!');
      clearCart();

      // Navigate to enrollment confirmation
      navigation.navigate('MyCourse');
    } catch (error) {
      showErrorToast('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // ============ RENDER ORDER SUMMARY ============
  const renderOrderSummary = () => (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Order Summary</Text>

      {items.map((item) => (
        <View key={item.courseId} style={styles.summaryItem}>
          <Text style={styles.courseName}>{item.course.title}</Text>
          <Text style={styles.coursePrice}>${item.price.toFixed(2)}</Text>
        </View>
      ))}

      <Divider style={styles.divider} />

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tax (10%)</Text>
        <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
      </View>

      {discount > 0 && (
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: COLORS.primary }]}>
            Discount ({promoCode?.code})
          </Text>
          <Text style={[styles.summaryValue, { color: COLORS.primary }]}>
            -${discount.toFixed(2)}
          </Text>
        </View>
      )}

      <Divider style={styles.divider} />

      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );

  // ============ RENDER PROMO CODE ============
  const renderPromoCode = () => (
    <View style={styles.promoSection}>
      <Text style={styles.sectionTitle}>Promo Code</Text>

      {promoCode ? (
        <View style={styles.appliedPromo}>
          <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.primary} />
          <Text style={styles.appliedPromoText}>{promoCode.code}</Text>
          <TouchableOpacity onPress={removePromoCode}>
            <MaterialCommunityIcons name="close" size={20} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.promoInput}>
          <Input
            placeholder="Enter promo code"
            value={promoInput}
            onChangeText={setPromoInput}
          />
          <Button
            title="Apply"
            onPress={handleApplyPromo}
            filled={false}
          />
        </View>
      )}
    </View>
  );

  // ============ RENDER PAYMENT METHODS ============
  const renderPaymentMethods = () => (
    <View style={styles.paymentSection}>
      <Text style={styles.sectionTitle}>Payment Method</Text>

      {paymentMethodsQuery.loading ? (
        <ActivityIndicator />
      ) : (
        <View>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedPaymentMethodId(method.id)}
              style={[
                styles.paymentMethodItem,
                selectedPaymentMethodId === method.id && styles.paymentMethodActive,
              ]}
            >
              <RadioButton
                selected={selectedPaymentMethodId === method.id}
              />
              <View style={{ flex: 1, marginLeft: SIZES.padding }}>
                <Text style={styles.methodType}>{method.type}</Text>
                <Text style={styles.methodDetail}>
                  **** **** **** {method.last4}
                </Text>
              </View>
              {method.isDefault && (
                <Badge label="Default" color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  // ============ MAIN RENDER ============
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {renderOrderSummary()}
        {renderPromoCode()}
        {renderPaymentMethods()}

        <BillingAddressForm
          address={billingAddress}
          onChange={setBillingAddress}
        />

        <Button
          title={isProcessing ? 'Processing...' : 'Complete Payment'}
          onPress={handlePayment}
          filled
          disabled={isProcessing || !selectedPaymentMethodId}
          style={styles.payButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
```

---

## Example 6: DownloadedCoursesScreen

**Location**: `src/screens/EducatePro/DownloadedCoursesScreen.tsx`

### Key Changes
```typescript
import { useEnrollments } from '../../hooks/useEducatePro';

const DownloadedCoursesScreen = ({ navigation }) => {
  const [filter, setFilter] = useState<'all' | 'downloading' | 'completed'>('all');

  // API Call
  const enrollmentsQuery = useEnrollments('active');
  const enrollments = enrollmentsQuery.data?.data || [];

  // Calculate storage
  const totalStorage = enrollments.reduce((sum, e) => {
    // Assume ~2.5GB per course at 100% progress
    const progressPercentage = e.progressPercentage / 100;
    return sum + 2.5 * progressPercentage;
  }, 0);

  // Filter courses
  const getFilteredCourses = () => {
    if (filter === 'downloading') {
      return enrollments.filter((e) => e.progressPercentage < 100);
    } else if (filter === 'completed') {
      return enrollments.filter((e) => e.progressPercentage === 100);
    }
    return enrollments;
  };

  const filteredCourses = getFilteredCourses();

  return (
    <SafeAreaView style={styles.container}>
      {/* Storage Card */}
      <View style={styles.storageCard}>
        <View style={styles.storageInfo}>
          <Text style={styles.storageLabel}>Storage Used</Text>
          <Text style={styles.storageSizeText}>{totalStorage.toFixed(1)} GB</Text>
        </View>

        <MaterialCommunityIcons name="database" size={40} color={COLORS.primary} />
      </View>

      {/* Storage Bar */}
      <View style={styles.storageBar}>
        <View
          style={[
            styles.storageUsed,
            { width: `${(totalStorage / 10) * 100}%` }, // 10GB total
          ]}
        />
      </View>

      <Text style={styles.storageCapacity}>
        {totalStorage.toFixed(1)} GB of 10.0 GB used
      </Text>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'downloading', 'completed'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterTab,
              filter === f && styles.filterTabActive,
            ]}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === f && styles.filterTabActiveText,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Course List */}
      {enrollmentsQuery.loading ? (
        <ActivityIndicator size="large" />
      ) : filteredCourses.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="cloud-download-outline"
            size={64}
            color={COLORS.greyscale300}
          />
          <Text style={styles.emptyTitle}>No Downloaded Courses</Text>
          <Text style={styles.emptySubtitle}>
            Download courses to access them offline
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Lesson', {
                  enrollmentId: item.id,
                })
              }
              style={styles.courseCard}
            >
              {/* Course Image */}
              <Image
                source={{
                  uri: item.course?.thumbnail,
                }}
                style={styles.courseImage}
              />

              {/* Course Info */}
              <View style={{ flex: 1 }}>
                <Text style={styles.courseName}>{item.course?.title}</Text>
                <Text style={styles.courseCategory}>
                  {item.course?.category}
                </Text>

                {/* Progress Bar */}
                <ProgressBar
                  value={item.progressPercentage / 100}
                  style={{ marginTop: SIZES.padding }}
                />

                <Text style={styles.progressText}>
                  {item.progressPercentage}% completed
                </Text>
              </View>

              {/* Download Status */}
              <View style={styles.downloadStatus}>
                <MaterialCommunityIcons
                  name={
                    item.progressPercentage === 100
                      ? 'check-circle'
                      : 'download'
                  }
                  size={24}
                  color={COLORS.primary}
                />
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      )}
    </SafeAreaView>
  );
};
```

---

## Integration Pattern Summary

### Standard Pattern for All Screens

```typescript
// 1. IMPORTS
import { useApp } from '../contexts/AppContext';
import { useCart } from '../contexts/CartContext';
import { useSpecificHook } from '../hooks/useEducatePro';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { formatPrice, formatDate } from '../utils/helpers';

// 2. COMPONENT
const MyScreen = ({ navigation, route }) => {
  // 3. STATE
  const { isDark } = useApp();
  const [selectedTab, setSelectedTab] = useState(0);

  // 4. API CALLS
  const dataQuery = useSpecificHook(dependencies);
  const data = dataQuery.data?.data || [];

  // 5. ERROR HANDLING
  useEffect(() => {
    if (dataQuery.error) {
      showErrorToast('Failed to load data');
    }
  }, [dataQuery.error]);

  // 6. HANDLERS
  const handleAction = async () => {
    try {
      await action();
      showSuccessToast('Success!');
      dataQuery.refetch();
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  // 7. CONDITIONAL RENDERING
  if (dataQuery.loading) return <ActivityIndicator />;
  if (data.length === 0) return <EmptyState />;

  // 8. MAIN RENDER
  return (
    <SafeAreaView style={{ backgroundColor: isDark ? '#000' : '#fff' }}>
      <FlatList
        data={data}
        renderItem={({ item }) => <ItemComponent {...item} />}
        refreshing={dataQuery.loading}
        onRefresh={dataQuery.refetch}
      />
    </SafeAreaView>
  );
};
```

### Checklist for Each Screen Migration

- [ ] Import `useApp` for dark mode
- [ ] Import relevant API hooks
- [ ] Replace `useState` mock data with API hook
- [ ] Add error handling with `useEffect` + `showErrorToast`
- [ ] Replace hardcoded colors with `isDark ? dark : light` pattern
- [ ] Use utility functions for formatting
- [ ] Add pull-to-refresh with `dataQuery.refetch()`
- [ ] Handle loading state with `ActivityIndicator`
- [ ] Add empty state when `data.length === 0`
- [ ] Test with real API endpoint
- [ ] Verify dark mode works
- [ ] Test error scenarios

---

## Time Estimate

- **Per Screen**: 15-20 minutes
- **All 31 Screens**: 8-10 hours
- **Testing & QA**: 4-6 hours

Use these examples as templates to migrate remaining screens.
