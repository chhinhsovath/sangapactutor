/**
 * Generic Card Component
 * From EducatePro template (licensed)
 * Adapted for TypeScript and React Native
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ReactNode,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface CardProps {
  children?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  isDark?: boolean;
  padding?: number;
  borderRadius?: number;
  shadow?: boolean;
}

const Card = ({
  children,
  onPress,
  style,
  containerStyle,
  isDark = false,
  padding = SIZES.padding3,
  borderRadius = 12,
  shadow = true,
}: CardProps) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.white,
          borderRadius,
          padding,
          ...(shadow && {
            shadowColor: COLORS.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }),
        },
        containerStyle,
        style,
      ]}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 8,
  },
});

export default Card;
