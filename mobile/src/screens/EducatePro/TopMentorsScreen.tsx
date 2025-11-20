/**
 * TopMentorsScreen Component (Phase 5 - Tier 3)
 * Display top mentors directory with filtering
 * Adapted from EducatePro template
 *
 * Features:
 * - Mentors list with rating and details
 * - Category filtering
 * - Search functionality
 * - Follow/Message buttons
 * - Dark mode support
 * - Mentor cards with stats
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
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface Mentor {
  id: string;
  fullName: string;
  position: string;
  avatar: any;
  rating: string;
  reviews: string;
  students: string;
  category: string;
  isFollowing?: boolean;
}

interface TopMentorsScreenProps {
  navigation: any;
}

const MOCK_MENTORS: Mentor[] = [
  {
    id: '1',
    fullName: 'Sarah Johnson',
    position: 'Senior UI Designer',
    avatar: require('../../../assets/icon.png'),
    rating: '4.8',
    reviews: '234',
    students: '5,234',
    category: 'Design',
    isFollowing: false,
  },
  {
    id: '2',
    fullName: 'John Smith',
    position: 'Full Stack Developer',
    avatar: require('../../../assets/icon.png'),
    rating: '4.7',
    reviews: '189',
    students: '4,567',
    category: 'Development',
    isFollowing: false,
  },
  {
    id: '3',
    fullName: 'Emma Wilson',
    position: 'Product Manager',
    avatar: require('../../../assets/icon.png'),
    rating: '4.9',
    reviews: '267',
    students: '6,123',
    category: 'Business',
    isFollowing: false,
  },
  {
    id: '4',
    fullName: 'David Lee',
    position: 'Data Scientist',
    avatar: require('../../../assets/icon.png'),
    rating: '4.6',
    reviews: '156',
    students: '3,456',
    category: 'Data',
    isFollowing: false,
  },
];

const CATEGORIES = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Design' },
  { id: '3', name: 'Development' },
  { id: '4', name: 'Business' },
  { id: '5', name: 'Data' },
];

const TopMentorsScreen = ({ navigation }: TopMentorsScreenProps) => {
  const [isDark] = useState(false);
  const [mentors, setMentors] = useState(MOCK_MENTORS);
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Filter mentors
   */
  const getFilteredMentors = () => {
    return mentors.filter((mentor) => {
      const matchesCategory =
        selectedCategory === '1' ||
        mentor.category === CATEGORIES.find((c) => c.id === selectedCategory)?.name;
      const matchesSearch =
        searchQuery === '' ||
        mentor.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  /**
   * Toggle follow
   */
  const handleToggleFollow = (id: string) => {
    setMentors(
      mentors.map((m) =>
        m.id === id ? { ...m, isFollowing: !m.isFollowing } : m
      )
    );
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
        Top Mentors
      </Text>

      <View style={{ width: 24 }} />
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
        placeholder="Search mentors..."
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
    </View>
  );

  /**
   * Render category filter
   */
  const renderCategoryFilter = () => (
    <FlatList
      data={CATEGORIES}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => setSelectedCategory(item.id)}
          style={[
            styles.categoryChip,
            {
              backgroundColor:
                selectedCategory === item.id ? COLORS.primary : 'transparent',
              borderColor: COLORS.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              {
                color:
                  selectedCategory === item.id ? COLORS.white : COLORS.primary,
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
      contentContainerStyle={styles.categoryContainer}
    />
  );

  /**
   * Render mentor card
   */
  const renderMentorCard = ({ item }: { item: Mentor }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('MentorProfile', { mentorId: item.id })
      }
      style={[
        styles.mentorCard,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.white,
          borderColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
        },
      ]}
      activeOpacity={0.7}
    >
      <Image
        source={item.avatar}
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
        {item.fullName}
      </Text>

      <Text
        style={[
          styles.mentorPosition,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        {item.position}
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
        <Text
          style={[
            styles.reviewsText,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          ({item.reviews})
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text
            style={[
              styles.statValue,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            {item.students}
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
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          onPress={() => handleToggleFollow(item.id)}
          style={[
            styles.actionButton,
            {
              backgroundColor: item.isFollowing
                ? COLORS.primary
                : 'transparent',
              borderColor: COLORS.primary,
              borderWidth: 1.5,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={item.isFollowing ? 'check' : 'plus'}
            size={16}
            color={item.isFollowing ? COLORS.white : COLORS.primary}
          />
          <Text
            style={[
              styles.actionButtonText,
              {
                color: item.isFollowing ? COLORS.white : COLORS.primary,
              },
            ]}
          >
            {item.isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Chat')}
          style={[
            styles.actionButton,
            {
              backgroundColor: COLORS.primary,
              borderColor: COLORS.primary,
              borderWidth: 1.5,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="message-outline"
            size={16}
            color={COLORS.white}
          />
          <Text style={[styles.actionButtonText, { color: COLORS.white }]}>
            Message
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const filteredMentors = getFilteredMentors();

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

      <FlatList
        data={filteredMentors}
        renderItem={renderMentorCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {renderSearchBar()}
            {renderCategoryFilter()}
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
      />
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding2,
    height: 48,
    borderRadius: 12,
    marginHorizontal: SIZES.padding,
    marginVertical: SIZES.padding2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: SIZES.padding2,
  },
  categoryContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding2,
    gap: SIZES.padding2,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
  },
  mentorCard: {
    marginBottom: SIZES.padding,
    padding: SIZES.padding2,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: SIZES.padding2,
  },
  mentorName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  mentorPosition: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: SIZES.padding2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
    marginRight: 4,
  },
  reviewsText: {
    fontSize: 11,
    fontWeight: '500',
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: SIZES.padding2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: SIZES.padding2,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default TopMentorsScreen;
