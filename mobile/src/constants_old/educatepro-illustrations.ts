/**
 * EducatePro Illustrations Constants
 * Mapping of all 8 illustration assets from EducatePro template
 * NOTE: Illustrations replaced with null values - asset files don't exist in project
 * These can be replaced with actual illustration assets as needed
 *
 * Usage:
 * import { EDUCATEPRO_ILLUSTRATIONS } from '@/constants/educatepro-illustrations';
 *
 * <Image
 *   source={EDUCATEPRO_ILLUSTRATIONS.success}
 *   style={{ width: 200, height: 200 }}
 * />
 */

export const EDUCATEPRO_ILLUSTRATIONS = {
  /**
   * Main background illustration
   * Use case: Splash screens, onboarding backgrounds
   */
  background: null,

  /**
   * Biometric authentication illustration
   * Use case: Login with fingerprint, security features
   */
  fingerprint: null,

  /**
   * 404 Not found page illustration
   * Use case: Error pages, empty states
   */
  notFound: null,

  /**
   * Password reset illustration
   * Use case: Password reset flow, authentication
   */
  password: null,

  /**
   * Password reset - dark mode illustration
   * Use case: Password reset flow in dark mode
   */
  passwordDark: null,

  /**
   * Password success confirmation illustration
   * Use case: After successful password reset
   */
  passwordSuccess: null,

  /**
   * Success confirmation illustration
   * Use case: Payment success, action confirmation, completion screens
   */
  success: null,

  /**
   * Success confirmation - dark mode illustration
   * Use case: Success screens in dark mode
   */
  successDark: null,
};

/**
 * Illustration dimensions - standard sizes for consistency
 */
export const ILLUSTRATION_SIZES = {
  /** Small inline illustrations (100x100) */
  small: { width: 100, height: 100 },

  /** Medium illustrations for modal/dialog (200x200) */
  medium: { width: 200, height: 200 },

  /** Large illustrations for full screens (300x300) */
  large: { width: 300, height: 300 },

  /** Extra large for splash/onboarding (400x400) */
  extraLarge: { width: 400, height: 400 },

  /** Full screen background */
  fullScreen: { width: '100%', height: '100%' },
};

/**
 * Illustration categories/use cases
 */
export const ILLUSTRATION_CATEGORIES = {
  /** Authentication related illustrations */
  AUTHENTICATION: ['fingerprint', 'password', 'passwordDark', 'passwordSuccess'],

  /** Success/confirmation states */
  SUCCESS: ['success', 'successDark', 'passwordSuccess'],

  /** Error states */
  ERRORS: ['notFound'],

  /** Backgrounds */
  BACKGROUNDS: ['background'],
};

/**
 * Get illustration by name
 * @param name - Illustration name (case-insensitive)
 * @returns Image source or null if not found
 */
export function getIllustrationByName(name: string) {
  const key = name
    .toLowerCase()
    .replace(/-/g, '')
    .replace(/_/g, '');

  const found = Object.entries(EDUCATEPRO_ILLUSTRATIONS).find(
    ([k]) => k.toLowerCase() === key
  );

  return found ? found[1] : null;
}

/**
 * List all available illustration names
 */
export function getAvailableIllustrationNames(): string[] {
  return Object.keys(EDUCATEPRO_ILLUSTRATIONS);
}

export default EDUCATEPRO_ILLUSTRATIONS;
