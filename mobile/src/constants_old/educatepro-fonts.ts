/**
 * EducatePro Fonts Constants
 * Custom Urbanist font family (18 font files) from EducatePro template
 *
 * USAGE INSTRUCTIONS:
 * ==================
 *
 * Option 1: Load fonts in App.tsx using useFonts hook
 * ─────────────────────────────────────────────────────
 *
 * import * as Font from 'expo-font';
 * import { EDUCATEPRO_FONTS } from '@/constants/educatepro-fonts';
 *
 * // In your App component:
 * const [fontsLoaded] = useFonts({
 *   ...existingFonts,
 *   ...EDUCATEPRO_FONTS,
 * });
 *
 *
 * Option 2: Load fonts manually with Font.loadAsync
 * ──────────────────────────────────────────────────
 *
 * import * as Font from 'expo-font';
 * import { EDUCATEPRO_FONTS } from '@/constants/educatepro-fonts';
 *
 * await Font.loadAsync(EDUCATEPRO_FONTS);
 *
 *
 * Using the fonts in styles:
 * ──────────────────────────
 *
 * const styles = StyleSheet.create({
 *   boldText: {
 *     fontFamily: 'Urbanist_700Bold',
 *     fontSize: 16,
 *   },
 * });
 */

/**
 * All Urbanist font weights and styles from EducatePro
 * Format: 'Urbanist_<weight><style>'
 */
export const EDUCATEPRO_FONTS = {
  // Thin weights
  Urbanist_100Thin: require('@/../assets/fonts/Urbanist-Thin.ttf'),
  Urbanist_100Thin_Italic: require('@/../assets/fonts/Urbanist-ThinItalic.ttf'),

  // Extra Light weights
  Urbanist_200ExtraLight: require('@/../assets/fonts/Urbanist-ExtraLight.ttf'),
  Urbanist_200ExtraLight_Italic: require('@/../assets/fonts/Urbanist-ExtraLightItalic.ttf'),

  // Light weights
  Urbanist_300Light: require('@/../assets/fonts/Urbanist-Light.ttf'),
  Urbanist_300Light_Italic: require('@/../assets/fonts/Urbanist-LightItalic.ttf'),

  // Regular weight
  Urbanist_400Regular: require('@/../assets/fonts/Urbanist-Regular.ttf'),
  Urbanist_400Regular_Italic: require('@/../assets/fonts/Urbanist-Italic.ttf'),

  // Medium weights
  Urbanist_500Medium: require('@/../assets/fonts/Urbanist-Medium.ttf'),
  Urbanist_500Medium_Italic: require('@/../assets/fonts/Urbanist-MediumItalic.ttf'),

  // Semi Bold weights
  Urbanist_600SemiBold: require('@/../assets/fonts/Urbanist-SemiBold.ttf'),
  Urbanist_600SemiBold_Italic: require('@/../assets/fonts/Urbanist-SemiBoldItalic.ttf'),

  // Bold weights
  Urbanist_700Bold: require('@/../assets/fonts/Urbanist-Bold.ttf'),
  Urbanist_700Bold_Italic: require('@/../assets/fonts/Urbanist-BoldItalic.ttf'),

  // Extra Bold weights
  Urbanist_800ExtraBold: require('@/../assets/fonts/Urbanist-ExtraBold.ttf'),
  Urbanist_800ExtraBold_Italic: require('@/../assets/fonts/Urbanist-ExtraBoldItalic.ttf'),

  // Black weights
  Urbanist_900Black: require('@/../assets/fonts/Urbanist-Black.ttf'),
  Urbanist_900Black_Italic: require('@/../assets/fonts/Urbanist-BlackItalic.ttf'),
};

/**
 * Font family names for easy reference in styles
 */
export const FONT_FAMILIES = {
  URBANIST_THIN: 'Urbanist_100Thin',
  URBANIST_THIN_ITALIC: 'Urbanist_100Thin_Italic',
  URBANIST_EXTRA_LIGHT: 'Urbanist_200ExtraLight',
  URBANIST_EXTRA_LIGHT_ITALIC: 'Urbanist_200ExtraLight_Italic',
  URBANIST_LIGHT: 'Urbanist_300Light',
  URBANIST_LIGHT_ITALIC: 'Urbanist_300Light_Italic',
  URBANIST_REGULAR: 'Urbanist_400Regular',
  URBANIST_REGULAR_ITALIC: 'Urbanist_400Regular_Italic',
  URBANIST_MEDIUM: 'Urbanist_500Medium',
  URBANIST_MEDIUM_ITALIC: 'Urbanist_500Medium_Italic',
  URBANIST_SEMI_BOLD: 'Urbanist_600SemiBold',
  URBANIST_SEMI_BOLD_ITALIC: 'Urbanist_600SemiBold_Italic',
  URBANIST_BOLD: 'Urbanist_700Bold',
  URBANIST_BOLD_ITALIC: 'Urbanist_700Bold_Italic',
  URBANIST_EXTRA_BOLD: 'Urbanist_800ExtraBold',
  URBANIST_EXTRA_BOLD_ITALIC: 'Urbanist_800ExtraBold_Italic',
  URBANIST_BLACK: 'Urbanist_900Black',
  URBANIST_BLACK_ITALIC: 'Urbanist_900Black_Italic',
};

/**
 * Common font style presets using Urbanist font family
 * Use these in StyleSheet.create() for consistent typography
 */
export const URBANIST_TYPOGRAPHY = {
  h1: {
    fontFamily: FONT_FAMILIES.URBANIST_BOLD,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700' as const,
  },
  h2: {
    fontFamily: FONT_FAMILIES.URBANIST_BOLD,
    fontSize: 28,
    lineHeight: 33,
    fontWeight: '700' as const,
  },
  h3: {
    fontFamily: FONT_FAMILIES.URBANIST_SEMI_BOLD,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  h4: {
    fontFamily: FONT_FAMILIES.URBANIST_SEMI_BOLD,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  h5: {
    fontFamily: FONT_FAMILIES.URBANIST_SEMI_BOLD,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  h6: {
    fontFamily: FONT_FAMILIES.URBANIST_SEMI_BOLD,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  body1: {
    fontFamily: FONT_FAMILIES.URBANIST_REGULAR,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  body2: {
    fontFamily: FONT_FAMILIES.URBANIST_REGULAR,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  body3: {
    fontFamily: FONT_FAMILIES.URBANIST_REGULAR,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  button: {
    fontFamily: FONT_FAMILIES.URBANIST_SEMI_BOLD,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600' as const,
  },
  caption: {
    fontFamily: FONT_FAMILIES.URBANIST_LIGHT,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '300' as const,
  },
  overline: {
    fontFamily: FONT_FAMILIES.URBANIST_SEMI_BOLD,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },
};

/**
 * Get font family name by weight (shorthand)
 * Usage: getFontByWeight(700) returns 'Urbanist_700Bold'
 */
export function getFontByWeight(
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
  italic: boolean = false
): string {
  const weights: Record<number, string> = {
    100: FONT_FAMILIES.URBANIST_THIN,
    200: FONT_FAMILIES.URBANIST_EXTRA_LIGHT,
    300: FONT_FAMILIES.URBANIST_LIGHT,
    400: FONT_FAMILIES.URBANIST_REGULAR,
    500: FONT_FAMILIES.URBANIST_MEDIUM,
    600: FONT_FAMILIES.URBANIST_SEMI_BOLD,
    700: FONT_FAMILIES.URBANIST_BOLD,
    800: FONT_FAMILIES.URBANIST_EXTRA_BOLD,
    900: FONT_FAMILIES.URBANIST_BLACK,
  };

  let family = weights[weight] || FONT_FAMILIES.URBANIST_REGULAR;

  if (italic && family.includes('_Italic')) {
    return family;
  } else if (italic) {
    return family + '_Italic';
  }

  return family;
}

export default EDUCATEPRO_FONTS;
