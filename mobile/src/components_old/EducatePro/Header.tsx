/**
 * Header Component
 * From EducatePro template (licensed)
 * Navigation header with back button and title
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  showBackButton?: boolean;
}

const Header = ({
  title,
  onBackPress,
  rightComponent,
  isDark = false,
  style,
  showBackButton = true,
}: HeaderProps) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
        },
        style,
      ]}
    >
      {showBackButton && (
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={isDark ? COLORS.white : COLORS.black}
          />
        </TouchableOpacity>
      )}

      <Text
        style={[
          styles.title,
          {
            color: isDark ? COLORS.white : COLORS.black,
            flex: 1,
            marginLeft: showBackButton ? 0 : 16,
          },
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>

      {rightComponent && <View style={styles.rightContainer}>{rightComponent}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale200,
  },
  backButton: {
    paddingRight: 16,
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'bold',
    color: COLORS.black,
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
});

export default Header;
