/**
 * SectionHeader Component
 * Header for content sections with optional action button
 *
 * Usage:
 * <SectionHeader
 *   title="Popular Courses"
 *   onSeeAll={() => navigation.navigate('All')}
 *   isDark={isDark}
 * />
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  actionText?: string;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
}

const SectionHeader = ({
  title,
  onSeeAll,
  actionText = 'See all',
  isDark = false,
  style,
}: SectionHeaderProps) => {
  return (
    <View
      style={[
        styles.container,
        style,
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: isDark ? COLORS.white : COLORS.greyscale900,
          },
        ]}
      >
        {title}
      </Text>

      {onSeeAll && (
        <TouchableOpacity
          onPress={onSeeAll}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.action,
              {
                color: COLORS.primary,
              },
            ]}
          >
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
  },
  title: {
    fontSize: 18,
    fontFamily: 'bold',
    fontWeight: '700',
    flex: 1,
  },
  action: {
    fontSize: 14,
    fontFamily: 'medium',
    fontWeight: '500',
    paddingHorizontal: SIZES.padding,
  },
});

export default SectionHeader;
