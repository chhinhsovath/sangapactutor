/**
 * Central export point for all constants
 * Makes imports cleaner throughout the application
 */

// EducatePro Theme System
export {
  COLORS,
  SIZES,
  FONTS,
  educateProTheme,
} from './educatepro-theme';

// EducatePro Assets (Phase 4)
export {
  EDUCATEPRO_ICONS,
  ICON_SIZES,
  ICON_CATEGORIES,
  getIconByName,
  getAvailableIconNames,
} from './educatepro-icons';

export {
  EDUCATEPRO_ILLUSTRATIONS,
  ILLUSTRATION_SIZES,
  ILLUSTRATION_CATEGORIES,
  getIllustrationByName,
  getAvailableIllustrationNames,
} from './educatepro-illustrations';

// FONTS IMPORT DISABLED - Asset files not available
// export {
//   EDUCATEPRO_FONTS,
//   FONT_FAMILIES,
//   URBANIST_TYPOGRAPHY,
//   getFontByWeight,
// } from './educatepro-fonts';

// Type exports if needed
export type { ColorKey, SizeKey } from './educatepro-theme';
