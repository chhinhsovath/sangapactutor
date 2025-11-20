/**
 * EducatePro Theme Colors & Sizes
 * Integrated from EducatePro template license
 * Used for professional UI components and design system
 */

import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

// ============= COLORS =============
export const COLORS = {
  // Primary Colors
  primary: '#335EF7',
  secondary: '#FFD300',
  tertiary: '#6C4DDA',

  // Status Colors
  success: '#0ABE75',
  info: '#246BFD',
  warning: '#FACC15',
  error: '#F75555',

  // Neutral Colors
  black: '#181A20',
  black2: '#1D272F',
  white: '#FFFFFF',
  disabled: '#D8D8D8',

  // Shades of White
  secondaryWhite: '#F9F9FF',
  tertiaryWhite: '#fafafa',

  // Grays & Dark
  gray: '#9E9E9E',
  gray2: '#35383F',
  gray3: '#9E9E9E',
  dark1: '#000000',
  dark2: '#1F222A',
  dark3: '#35383F',

  // Grayscale (Light to Dark)
  grayscale100: '#F5F5F5',
  grayscale200: '#EEEEEE',
  greyscale300: '#E0E0E0',
  grayscale400: '#BDBDBD',
  grayscale700: '#616161',
  greyScale800: '#424242',
  greyscale900: '#212121',
  greyscale500: '#FAFAFA',
  greyscale600: '#757575',

  // Aliases
  greeen: '#0ABE75', // Note: typo from original

  // Transparent Variants
  tansparentPrimary: 'rgba(51, 94, 247, 0.08)',
  transparentSecondary: 'rgba(108, 77, 218, 0.15)',
  transparentTertiary: 'rgba(51, 94, 247, 0.1)',
  transparentRed: 'rgba(255, 62, 61, 0.15)',

  // Additional shades
  blackTie: '#474747',
  grayTie: '#BCBCBC',
};

// ============= SIZES =============
export const SIZES = {
  // Global base unit
  base: 8,
  font: 14,
  radius: 30,

  // Padding variants
  padding: 8,
  padding2: 12,
  padding3: 16,

  // Font sizes
  largeTitle: 50,
  h1: 36,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,

  // Screen dimensions
  width,
  height,
};

// ============= FONTS =============
// Note: Uses Urbanist font family
// For SA Jobs, we recommend combining with Hanuman for Khmer support
export const FONTS = {
  largeTitle: {
    fontFamily: 'black',
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
    color: COLORS.black,
  },
  h1: {
    fontFamily: 'bold',
    fontSize: SIZES.h1,
    lineHeight: 36,
    color: COLORS.black,
  },
  h2: {
    fontFamily: 'bold',
    fontSize: SIZES.h2,
    lineHeight: 30,
    color: COLORS.black,
  },
  h3: {
    fontFamily: 'bold',
    fontSize: SIZES.h3,
    lineHeight: 22,
    color: COLORS.black,
  },
  h4: {
    fontFamily: 'bold',
    fontSize: SIZES.h4,
    lineHeight: 20,
  },
  body1: {
    fontFamily: 'regular',
    fontSize: SIZES.body1,
    lineHeight: 36,
    color: COLORS.black,
  },
  body2: {
    fontFamily: 'regular',
    fontSize: SIZES.body2,
    lineHeight: 30,
    color: COLORS.black,
  },
  body3: {
    fontFamily: 'regular',
    fontSize: SIZES.body3,
    lineHeight: 22,
    color: COLORS.black,
  },
  body4: {
    fontFamily: 'regular',
    fontSize: SIZES.body4,
    lineHeight: 20,
    color: COLORS.black,
  },
};

// ============= THEME EXPORT =============
export const educateProTheme = {
  COLORS,
  SIZES,
  FONTS,
};

export default educateProTheme;
