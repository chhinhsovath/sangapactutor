/**
 * StudentCard Component
 * From EducatePro template (licensed)
 * Profile card for students with avatar, name, status/level, and action button
 */

import React from 'react';
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
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface StudentCardProps {
  avatar: ImageSourcePropType;
  fullName: string;
  position: string; // Can be status, level, or other info
  onPress?: () => void;
  onActionPress?: () => void;
  actionIcon?: string;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
}

const StudentCard = ({
  avatar,
  fullName,
  position,
  onPress,
  onActionPress,
  actionIcon = 'message-outline',
  isDark = false,
  style,
}: StudentCardProps) => {
  return (
    <View
      style={[
        styles.studentContainer,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.white,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={styles.chatLeftContainer}
        activeOpacity={0.7}
      >
        <Image
          source={avatar}
          resizeMode="cover"
          style={styles.avatarImage}
        />
        <View style={styles.userInfoContainer}>
          <Text
            style={[
              styles.fullName,
              {
                color: isDark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
            numberOfLines={1}
          >
            {fullName}
          </Text>
          <Text style={styles.position} numberOfLines={1}>
            {position}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onActionPress}
        style={styles.actionButton}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={actionIcon as any}
          size={24}
          color={COLORS.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  studentContainer: {
    width: SIZES.width - 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  fullName: {
    fontSize: 16,
    fontFamily: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  position: {
    fontSize: 12,
    fontFamily: 'medium',
    color: COLORS.gray,
  },
  chatLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userInfoContainer: {
    marginLeft: 12,
    flex: 1,
  },
  actionButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StudentCard;
