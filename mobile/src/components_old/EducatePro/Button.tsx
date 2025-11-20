/**
 * Button Component
 * From EducatePro template (licensed)
 * Adapted for TypeScript and React Native Paper compatibility
 */

import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  filled?: boolean;
  color?: string;
  textColor?: string;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const Button = ({
  title,
  onPress,
  filled = true,
  color,
  textColor,
  isLoading = false,
  style,
  disabled = false,
}: ButtonProps) => {
  const filledBgColor = color || COLORS.primary;
  const outlinedBgColor = COLORS.white;
  const bgColor = filled ? filledBgColor : outlinedBgColor;
  const btnTextColor = filled ? (textColor || COLORS.white) : (textColor || COLORS.primary);

  return (
    <TouchableOpacity
      disabled={disabled || isLoading}
      style={[
        styles.btn,
        {
          backgroundColor: disabled ? COLORS.disabled : bgColor,
        },
        style,
      ]}
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={COLORS.white} />
      ) : (
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'semiBold',
            color: disabled ? COLORS.gray : btnTextColor,
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: SIZES.padding3,
    paddingVertical: SIZES.padding2,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
});

export default Button;
