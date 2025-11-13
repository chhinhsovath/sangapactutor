/**
 * Helper utilities for bilingual content display
 */

export type BilingualField = {
  nameKh?: string | null;
  nameEn?: string | null;
  name?: string; // Fallback field
};

export type BilingualTextfield = {
  bioKh?: string | null;
  bioEn?: string | null;
  bio?: string; // Fallback field
  teachingStyleKh?: string | null;
  teachingStyleEn?: string | null;
  teachingStyle?: string; // Fallback field
};

/**
 * Get the appropriate language field value based on current language
 * Falls back to alternative language or legacy field if primary not available
 */
export function getBilingualText(
  item: BilingualField | BilingualTextfield | null | undefined,
  language: 'km' | 'en',
  fieldPrefix: 'name' | 'bio' | 'teachingStyle' = 'name'
): string {
  if (!item) return '';

  const khField = `${fieldPrefix}Kh` as keyof typeof item;
  const enField = `${fieldPrefix}En` as keyof typeof item;
  const fallbackField = fieldPrefix as keyof typeof item;

  // Get primary language value
  const primary = language === 'km' ? item[khField] : item[enField];
  if (primary) return String(primary);

  // Fallback to other language
  const secondary = language === 'km' ? item[enField] : item[khField];
  if (secondary) return String(secondary);

  // Final fallback to legacy field
  const fallback = item[fallbackField];
  if (fallback) return String(fallback);

  return '';
}

/**
 * Get subject/country name in current language
 */
export function getLocalizedName(
  item: BilingualField | null | undefined,
  language: 'km' | 'en'
): string {
  return getBilingualText(item, language, 'name');
}

/**
 * Get tutor bio in current language
 */
export function getLocalizedBio(
  tutor: BilingualTextfield | null | undefined,
  language: 'km' | 'en'
): string {
  return getBilingualText(tutor, language, 'bio');
}

/**
 * Get teaching style in current language
 */
export function getLocalizedTeachingStyle(
  tutor: BilingualTextfield | null | undefined,
  language: 'km' | 'en'
): string {
  return getBilingualText(tutor, language, 'teachingStyle');
}
