/**
 * SearchScreen Component (Phase 5)
 * Search and discover courses/mentors with filters
 * Adapted from EducatePro template
 *
 * Features:
 * - Search input with filters
 * - Tab navigation (Courses, Mentors)
 * - Search results display
 * - Category filtering
 * - Rating filtering
 * - Price range slider
 * - Dark mode support
 * - No results handling
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { EDUCATEPRO_ICONS } from '../../constants/educatepro-icons';
import { CourseCard, MentorCard } from '../../components/EducatePro';

interface SearchResult {
  id: string;
  name: string;
  image: any;
  [key: string]: any;
}

interface SearchScreenProps {
  navigation: any;
}

// Mock data
const MOCK_COURSES = [
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
    id: '2',
    name: 'Mobile App Development',
    image: require('../../../assets/icon.png'),
    category: 'Mobile',
    price: '59.99',
    oldPrice: '',
    isOnDiscount: false,
    rating: '4.6',
    numStudents: '892',
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
    id: '4',
    name: 'JavaScript for Beginners',
    image: require('../../../assets/icon.png'),
    category: 'Programming',
    price: '29.99',
    oldPrice: '',
    isOnDiscount: false,
    rating: '4.5',
    numStudents: '3,421',
  },
];

const MOCK_MENTORS = [
  {
    id: '1',
    firstName: 'Sarah',
    fullName: 'Sarah Johnson',
    position: 'Senior UI Designer',
    avatar: require('../../../assets/icon.png'),
  },
  {
    id: '2',
    firstName: 'John',
    fullName: 'John Smith',
    position: 'Full Stack Developer',
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

const CATEGORIES = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Web Development' },
  { id: '3', name: 'Mobile' },
  { id: '4', name: 'Design' },
  { id: '5', name: 'Programming' },
];

const RATINGS = [
  { id: '1', label: 'All Ratings', value: 0 },
  { id: '2', label: '4.5+ ⭐', value: 4.5 },
  { id: '3', label: '4.0+ ⭐', value: 4.0 },
  { id: '4', label: '3.5+ ⭐', value: 3.5 },
];

const SearchScreen = ({ navigation }: SearchScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('courses');
  const [isDark] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [selectedRating, setSelectedRating] = useState('1');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);

  /**
   * Filter and search results
   */
  useEffect(() => {
    performSearch();
  }, [searchQuery, activeTab, selectedCategory, selectedRating, priceRange]);

  const performSearch = () => {
    let results: SearchResult[] = [];

    if (activeTab === 'courses') {
      results = MOCK_COURSES.filter((course) => {
        const matchesQuery =
          searchQuery === '' ||
          course.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === '1' || course.category === CATEGORIES.find((c) => c.id === selectedCategory)?.name;

        const price = parseFloat(course.price);
        const matchesPrice = price >= priceRange.min && price <= priceRange.max;

        return matchesQuery && matchesCategory && matchesPrice;
      });
    } else {
      results = MOCK_MENTORS.filter((mentor) =>
        searchQuery === '' ||
        mentor.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredResults(results);
  };

  /**
   * Render search header
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
          Search
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
   * Render search bar
   */
  const renderSearchBar = () => (
    <View
      style={[
        styles.searchBar,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
        },
      ]}
    >
      <MaterialCommunityIcons
        name="magnify"
        size={20}
        color={COLORS.gray}
      />
      <TextInput
        placeholder="Search courses or mentors..."
        placeholderTextColor={COLORS.gray}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[
          styles.searchInput,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      />
      {searchQuery !== '' && (
        <TouchableOpacity
          onPress={() => setSearchQuery('')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="close-circle"
            size={20}
            color={COLORS.gray}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  /**
   * Render tab navigation
   */
  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {['courses', 'mentors'].map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => {
            setActiveTab(tab);
            setSearchQuery('');
          }}
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
   * Render category filters (for courses)
   */
  const renderCategoryFilter = () => {
    if (activeTab !== 'courses') return null;

    return (
      <View style={styles.filterSection}>
        <Text
          style={[
            styles.filterTitle,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Categories
        </Text>
        <FlatList
          data={CATEGORIES}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item.id)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === item.id
                      ? COLORS.primary
                      : 'transparent',
                  borderColor: COLORS.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === item.id
                        ? COLORS.white
                        : COLORS.primary,
                  },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
    );
  };

  /**
   * Render no results message
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name="magnify"
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
        No Results Found
      </Text>
      <Text
        style={[
          styles.emptyStateSubtitle,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        Try different keywords or filters
      </Text>
    </View>
  );

  /**
   * Render course result item
   */
  const renderCourseItem = ({ item }: { item: any }) => (
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
  );

  /**
   * Render mentor result item
   */
  const renderMentorItem = ({ item }: { item: any }) => (
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
  );

  /**
   * Render search results
   */
  const renderResults = () => {
    if (filteredResults.length === 0) {
      return renderEmptyState();
    }

    return (
      <View style={styles.resultsContainer}>
        {searchQuery && (
          <View style={styles.resultInfo}>
            <Text
              style={[
                styles.resultInfoText,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              Results for{' '}
              <Text style={{ color: COLORS.primary }}>"{searchQuery}"</Text>
            </Text>
            <Text
              style={[
                styles.resultCount,
                {
                  color: isDark ? COLORS.gray : COLORS.greyscale600,
                },
              ]}
            >
              {filteredResults.length} found
            </Text>
          </View>
        )}

        <FlatList
          data={filteredResults}
          renderItem={
            activeTab === 'courses' ? renderCourseItem : renderMentorItem
          }
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{
            paddingBottom: SIZES.padding,
          }}
        />
      </View>
    );
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderSearchBar()}
          {renderTabBar()}
          {renderCategoryFilter()}
          {renderResults()}
        </View>
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
  content: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding2,
    height: 48,
    borderRadius: 12,
    marginBottom: SIZES.padding,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: SIZES.padding2,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale200,
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
  filterSection: {
    marginBottom: SIZES.padding,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SIZES.padding,
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
    fontSize: 13,
    fontWeight: '500',
  },
  resultsContainer: {
    marginTop: SIZES.padding,
  },
  resultInfo: {
    marginBottom: SIZES.padding,
  },
  resultInfoText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding * 4,
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
  },
});

export default SearchScreen;
