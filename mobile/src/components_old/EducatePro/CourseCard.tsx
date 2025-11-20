/**
 * CourseCard Component
 * From EducatePro template (licensed)
 * Premium course display card with image, rating, and price
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface CourseCardProps {
  name: string;
  image: ImageSourcePropType;
  category: string;
  price: string | number;
  isOnDiscount?: boolean;
  oldPrice?: string | number;
  rating: string | number;
  numStudents: string | number;
  onPress?: () => void;
  onBookmarkPress?: (bookmarked: boolean) => void;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
}

const CourseCard = ({
  name,
  image,
  category,
  price,
  isOnDiscount = false,
  oldPrice,
  rating,
  numStudents,
  onPress,
  onBookmarkPress,
  isDark = false,
  style,
}: CourseCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkPress = () => {
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    onBookmarkPress?.(newState);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.white,
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      <Image source={image} resizeMode="cover" style={styles.courseImage} />

      <View style={{ flex: 1 }}>
        <View style={styles.topContainer}>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryName}>{category}</Text>
          </View>
          <TouchableOpacity onPress={handleBookmarkPress}>
            <Text
              style={{
                fontSize: 20,
                color: isBookmarked ? COLORS.primary : COLORS.gray,
              }}
            >
              {isBookmarked ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.name,
            {
              color: isDark ? COLORS.white : COLORS.greyscale900,
            },
          ]}
          numberOfLines={2}
        >
          {name}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${price}</Text>
          {isOnDiscount && (
            <Text style={styles.oldPrice}>
              {'   '}${oldPrice}
            </Text>
          )}
        </View>

        <View style={styles.ratingContainer}>
          <FontAwesome name="star-half-empty" size={16} color="orange" />
          <Text style={styles.rating}>{rating}</Text>
          <Text style={styles.numStudents}> | {numStudents} students</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 32,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 148,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 8,
  },
  courseImage: {
    width: 124,
    height: 124,
    borderRadius: 16,
    marginRight: 16,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.transparentTertiary,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'semiBold',
    color: COLORS.primary,
  },
  name: {
    fontSize: 16,
    fontFamily: 'bold',
    color: COLORS.black,
    marginVertical: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontFamily: 'bold',
    color: COLORS.primary,
  },
  oldPrice: {
    fontSize: 14,
    fontFamily: 'medium',
    color: COLORS.gray,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontFamily: 'medium',
    color: COLORS.gray,
    marginLeft: 4,
  },
  numStudents: {
    fontSize: 12,
    fontFamily: 'regular',
    color: COLORS.gray,
  },
});

export default CourseCard;
