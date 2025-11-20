/**
 * WishlistScreen Component (Phase 5 - Tier 4)
 * Saved courses wishlist
 * Adapted from EducatePro template
 *
 * Features:
 * - Wishlist items
 * - Remove from wishlist
 * - Course preview
 * - Price tracking
 * - Enroll button
 * - Empty state
 * - Dark mode support
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { CourseCard } from '../../components/EducatePro';

interface WishlistItem {
  id: string;
  name: string;
  image: any;
  instructor: string;
  price: string;
  oldPrice: string;
  rating: string;
  category: string;
  addedDate: string;
}

interface WishlistScreenProps {
  navigation: any;
}

const MOCK_WISHLIST: WishlistItem[] = [
  {
    id: '1',
    name: 'Advanced React Patterns',
    image: require('../../../assets/icon.png'),
    instructor: 'John Smith',
    price: '49.99',
    oldPrice: '99.99',
    rating: '4.8',
    category: 'Web Development',
    addedDate: '2025-01-10',
  },
  {
    id: '3',
    name: 'UI/UX Design Masterclass',
    image: require('../../../assets/icon.png'),
    instructor: 'Emma Wilson',
    price: '39.99',
    oldPrice: '79.99',
    rating: '4.9',
    category: 'Design',
    addedDate: '2025-01-05',
  },
];

const WishlistScreen = ({ navigation }: WishlistScreenProps) => {
  const [isDark] = useState(false);
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST);

  /**
   * Handle remove from wishlist
   */
  const handleRemove = (id: string) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
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
      <TouchableOpacity onPress={() => navigation.goBack()}>
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
        My Wishlist
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name="heart-outline"
        size={64}
        color={COLORS.greyscale300}
      />
      <Text
        style={[
          styles.emptyTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Wishlist is Empty
      </Text>
      <Text
        style={[
          styles.emptySubtitle,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        Add courses to your wishlist to save them for later
      </Text>
    </View>
  );

  /**
   * Render wishlist item
   */
  const renderWishlistItem = ({ item }: { item: WishlistItem }) => (
    <View
      style={[
        styles.itemContainer,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.white,
          borderColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
        },
      ]}
    >
      <CourseCard
        name={item.name}
        image={item.image}
        instructor={item.instructor}
        price={item.price}
        oldPrice={item.oldPrice}
        rating={item.rating}
        category={item.category}
        onPress={() =>
          navigation.navigate('CourseDetails', { courseId: item.id })
        }
        isDark={isDark}
      />

      <View
        style={[
          styles.itemFooter,
          {
            borderTopColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
          },
        ]}
      >
        <Text
          style={[
            styles.addedText,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          Added {item.addedDate}
        </Text>

        <TouchableOpacity
          onPress={() => handleRemove(item.id)}
          style={styles.removeButton}
        >
          <MaterialCommunityIcons
            name="heart-remove"
            size={20}
            color={COLORS.red}
          />
        </TouchableOpacity>
      </View>
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

      {wishlist.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  itemContainer: {
    marginBottom: SIZES.padding,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.padding2,
    borderTopWidth: 1,
  },
  addedText: {
    fontSize: 11,
    fontWeight: '500',
  },
  removeButton: {
    padding: SIZES.base,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: SIZES.padding,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: SIZES.padding,
    textAlign: 'center',
  },
});

export default WishlistScreen;
