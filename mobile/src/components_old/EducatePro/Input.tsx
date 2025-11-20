/**
 * Input Component
 * From EducatePro template (licensed)
 * Adapted for TypeScript and React Native
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TextInputProps,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface InputProps extends TextInputProps {
  id?: string;
  icon?: ImageSourcePropType;
  onInputChanged?: (id: string, value: string) => void;
  errorText?: string[];
  placeholderTextColor?: string;
  isDark?: boolean;
}

const Input = ({
  id = '',
  icon,
  onInputChanged,
  errorText,
  placeholderTextColor = '#BCBCBC',
  isDark = false,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChangeText = (text: string) => {
    if (onInputChanged && id) {
      onInputChanged(id, text);
    }
    props.onChangeText?.(text);
  };

  const bgColor = isFocused
    ? COLORS.tansparentPrimary
    : isDark
      ? COLORS.dark2
      : COLORS.greyscale500;

  const borderColor = isFocused ? COLORS.primary : isDark ? COLORS.dark2 : COLORS.greyscale500;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor: bgColor,
          },
        ]}
      >
        {icon && (
          <Image
            source={icon}
            style={[
              styles.icon,
              {
                tintColor: isFocused ? COLORS.primary : '#BCBCBC',
              },
            ]}
          />
        )}
        <TextInput
          {...props}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, { color: isDark ? COLORS.white : COLORS.black }]}
          placeholderTextColor={placeholderTextColor}
          autoCapitalize="none"
        />
      </View>
      {errorText && errorText.length > 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorText[0]}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 5,
    flexDirection: 'row',
    height: 52,
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
    height: 20,
    width: 20,
  },
  input: {
    color: COLORS.black,
    flex: 1,
    fontFamily: 'regular',
    fontSize: 14,
    paddingTop: 0,
    paddingBottom: 0,
  },
  errorContainer: {
    marginVertical: 4,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontFamily: 'regular',
  },
});

export default Input;
