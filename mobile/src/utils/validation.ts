/**
 * Form Validation Utilities
 * Common validation rules for form inputs
 *
 * Usage:
 * const isEmailValid = validateEmail('user@example.com');
 * const result = validateInput('email', 'user@example.com', 'email');
 */

/**
 * Email validation regex
 */
const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Phone number regex (basic international format)
 */
const PHONE_REGEX = /^\+?[\d\s\-()]+$/;

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (!email || email.trim() === '') {
    return false;
  }
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validate password strength
 * Returns true if password meets all requirements
 */
export function validatePassword(password: string): boolean {
  if (!password || password.length < 8) {
    return false;
  }
  return PASSWORD_REGEX.test(password);
}

/**
 * Validate that two passwords match
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): boolean {
  return password === confirmPassword && validatePassword(password);
}

/**
 * Validate phone number
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone || phone.trim() === '') {
    return false;
  }
  return PHONE_REGEX.test(phone.trim());
}

/**
 * Validate that string is not empty
 */
export function validateRequired(value: string): boolean {
  return value && value.trim().length > 0;
}

/**
 * Validate minimum length
 */
export function validateMinLength(value: string, minLength: number): boolean {
  return value && value.trim().length >= minLength;
}

/**
 * Validate maximum length
 */
export function validateMaxLength(value: string, maxLength: number): boolean {
  return !value || value.trim().length <= maxLength;
}

/**
 * Validate number format
 */
export function validateNumber(value: string): boolean {
  if (!value || value.trim() === '') {
    return false;
  }
  return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
}

/**
 * Validate URL format
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function validateDate(dateString: string): boolean {
  if (!dateString || dateString.trim() === '') {
    return false;
  }
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Main validation function that routes to specific validators
 */
export function validateInput(
  inputId: string,
  inputValue: string,
  inputType: 'email' | 'password' | 'confirmPassword' | 'phone' | 'text' | 'number' | 'url' | 'date' = 'text',
  additionalConfig?: {
    minLength?: number;
    maxLength?: number;
    matchValue?: string; // For password confirmation
    required?: boolean;
  }
): boolean {
  const { minLength, maxLength, matchValue, required = true } = additionalConfig || {};

  // Check if required
  if (required && !validateRequired(inputValue)) {
    return false;
  }

  // Skip further validation if field is optional and empty
  if (!required && !inputValue) {
    return true;
  }

  // Type-specific validation
  switch (inputType) {
    case 'email':
      return validateEmail(inputValue);

    case 'password':
      return validatePassword(inputValue);

    case 'confirmPassword':
      return matchValue
        ? validatePasswordMatch(matchValue, inputValue)
        : validatePassword(inputValue);

    case 'phone':
      return validatePhoneNumber(inputValue);

    case 'number':
      return validateNumber(inputValue);

    case 'url':
      return validateURL(inputValue);

    case 'date':
      return validateDate(inputValue);

    case 'text':
    default:
      // Check min/max length for text fields
      if (minLength && !validateMinLength(inputValue, minLength)) {
        return false;
      }
      if (maxLength && !validateMaxLength(inputValue, maxLength)) {
        return false;
      }
      return true;
  }
}

/**
 * Validation error messages
 */
export const VALIDATION_MESSAGES: Record<string, string> = {
  email_invalid: 'Please enter a valid email address',
  email_required: 'Email is required',
  password_invalid: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  password_required: 'Password is required',
  password_mismatch: 'Passwords do not match',
  phone_invalid: 'Please enter a valid phone number',
  phone_required: 'Phone number is required',
  name_required: 'Name is required',
  text_required: 'This field is required',
  text_minlength: (min: number) => `Minimum ${min} characters required`,
  text_maxlength: (max: number) => `Maximum ${max} characters allowed`,
  number_invalid: 'Please enter a valid number',
  url_invalid: 'Please enter a valid URL',
  date_invalid: 'Please enter a valid date',
};

/**
 * Get appropriate error message
 */
export function getErrorMessage(
  inputId: string,
  inputValue: string,
  inputType: string,
  additionalConfig?: any
): string | null {
  const isValid = validateInput(inputId, inputValue, inputType, additionalConfig);

  if (isValid) {
    return null;
  }

  // Return appropriate error message
  switch (inputType) {
    case 'email':
      return VALIDATION_MESSAGES.email_invalid;
    case 'password':
      return VALIDATION_MESSAGES.password_invalid;
    case 'confirmPassword':
      return VALIDATION_MESSAGES.password_mismatch;
    case 'phone':
      return VALIDATION_MESSAGES.phone_invalid;
    case 'number':
      return VALIDATION_MESSAGES.number_invalid;
    case 'url':
      return VALIDATION_MESSAGES.url_invalid;
    case 'date':
      return VALIDATION_MESSAGES.date_invalid;
    case 'text':
    default:
      if (additionalConfig?.minLength && inputValue.length < additionalConfig.minLength) {
        return VALIDATION_MESSAGES.text_minlength(additionalConfig.minLength);
      }
      if (additionalConfig?.maxLength && inputValue.length > additionalConfig.maxLength) {
        return VALIDATION_MESSAGES.text_maxlength(additionalConfig.maxLength);
      }
      return VALIDATION_MESSAGES.text_required;
  }
}
