/**
 * ReviewCard Component
 * From EducatePro template (licensed)
 * Displays reviews with avatar, name, rating, and like functionality
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/educatepro-theme';

interface ReviewCardProps {
  avatar: ImageSourcePropType;
  name: string;
  description: string;
  avgRating: string | number;
  date: Date | string;
  numLikes?: string | number;
  onLikePress?: (liked: boolean) => void;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Helper function to get time ago string
const getTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return past.toLocaleDateString();
};

const ReviewCard = ({
  avatar,
  name,
  description,
  avgRating,
  date,
  numLikes = 0,
  onLikePress,
  isDark = false,
  style,
}: ReviewCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikePress = () => {
    const newState = !isLiked;
    setIsLiked(newState);
    onLikePress?.(newState);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Header with avatar and rating */}
      <View style={styles.reviewHeaderContainer}>
        <View style={styles.reviewHeaderLeft}>
          <Image
            source={avatar}
            resizeMode="cover"
            style={styles.avatar}
          />
          <Text
            style={[
              styles.name,
              {
                color: isDark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            {name}
          </Text>
        </View>

        <View style={styles.reviewHeaderRight}>
          <View style={styles.starContainer}>
            <MaterialCommunityIcons
              name="star"
              size={12}
              color={COLORS.primary}
            />
            <Text style={styles.rating}>{avgRating}</Text>
          </View>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={20}
            color={isDark ? COLORS.white : COLORS.greyscale900}
            style={styles.moreIcon}
          />
        </View>
      </View>

      {/* Description */}
      <Text
        style={[
          styles.description,
          {
            color: isDark ? COLORS.secondaryWhite : COLORS.greyscale900,
          },
        ]}
      >
        {description}
      </Text>

      {/* Footer with like and date */}
      <View style={styles.reviewBottomContainer}>
        <View style={styles.likeContainer}>
          <TouchableOpacity onPress={handleLikePress} style={styles.likeButton}>
            <MaterialCommunityIcons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={isLiked ? COLORS.error : COLORS.gray}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.numLikes,
              {
                color: isDark ? COLORS.secondaryWhite : COLORS.greyscale900,
              },
            ]}
          >
            {numLikes}
          </Text>
        </View>
        <Text style={styles.date}>{getTimeAgo(date)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale300,
  },
  reviewHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: 'bold',
    color: COLORS.black,
  },
  starContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderColor: COLORS.primary,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  reviewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontFamily: 'semiBold',
    color: COLORS.primary,
    marginLeft: 4,
  },
  moreIcon: {
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'regular',
    color: COLORS.black,
    marginBottom: 12,
    lineHeight: 20,
  },
  reviewBottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    paddingRight: 8,
  },
  numLikes: {
    fontSize: 12,
    fontFamily: 'semiBold',
    color: COLORS.black,
  },
  date: {
    fontSize: 12,
    fontFamily: 'regular',
    color: COLORS.gray,
  },
});

export default ReviewCard;
