/**
 * SettingsItem Component
 * Reusable settings menu item with icon and label
 *
 * Usage:
 * <SettingsItem
 *   icon={require('...')}
 *   label="Edit Profile"
 *   onPress={() => navigation.navigate('EditProfile')}
 *   isDark={isDark}
 * />
 */

import React from 'react';
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface SettingsItemProps {
  icon?: ImageSourcePropType;
  iconName?: string; // Material Community Icons name
  label: string;
  onPress: () => void;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  iconName,
  label,
  onPress,
  isDark = false,
  style,
  rightElement,
  showArrow = true,
}: SettingsItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
          borderBottomColor: isDark ? COLORS.dark1 : COLORS.greyscale200,
        },
        style,
      ]}
    >
      <View style={styles.leftContainer}>
        {icon && (
          <Image
            source={icon}
            resizeMode="contain"
            style={[
              styles.icon,
              {
                tintColor: isDark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          />
        )}

        {iconName && (
          <MaterialCommunityIcons
            name={iconName as any}
            size={24}
            color={isDark ? COLORS.white : COLORS.greyscale900}
            style={styles.iconMaterial}
          />
        )}

        <Text
          style={[
            styles.label,
            {
              color: isDark ? COLORS.white : COLORS.greyscale900,
            },
          ]}
        >
          {label}
        </Text>
      </View>

      {rightElement ? (
        rightElement
      ) : showArrow ? (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={isDark ? COLORS.gray : COLORS.greyscale400}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
    marginVertical: SIZES.base,
    borderRadius: 12,
    borderBottomWidth: 0.5,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: SIZES.padding2,
  },
  iconMaterial: {
    marginRight: SIZES.padding2,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});

export default SettingsItem;
