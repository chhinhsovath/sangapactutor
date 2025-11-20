/**
 * SignupScreen Component (Phase 5 - Tier 2)
 * User registration with form validation
 * Adapted from EducatePro template
 *
 * Features:
 * - Full name, email, and password fields
 * - Password strength indicator
 * - Confirm password validation
 * - Terms and conditions checkbox
 * - Form validation
 * - Dark mode support
 * - Navigation to login
 * - Loading state management
 */

import React, { useCallback, useReducer, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { Button } from '../../components/EducatePro';
import { formReducer, FormState } from '../../utils/formReducer';
import {
  validateInput,
  getErrorMessage,
} from '../../utils/validation';

interface SignupScreenProps {
  navigation: any;
}

const initialFormState: FormState = {
  inputValues: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  inputValidities: {
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  },
  formIsValid: false,
};

const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [isDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Calculate password strength
   */
  const getPasswordStrength = () => {
    const password = formState.inputValues.password;
    if (!password) return { level: 0, color: COLORS.gray, label: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 1) {
      return { level: 1, color: COLORS.red, label: 'Weak' };
    } else if (strength <= 2) {
      return { level: 2, color: '#FF9800', label: 'Fair' };
    } else if (strength <= 3) {
      return { level: 3, color: '#FFC107', label: 'Good' };
    } else {
      return { level: 4, color: COLORS.primary, label: 'Strong' };
    }
  };

  /**
   * Handle input change with validation
   */
  const handleInputChange = useCallback(
    (inputId: string, inputValue: string, inputType: string = 'text') => {
      let isValid = validateInput(inputId, inputValue, inputType as any);

      // Special validation for confirm password
      if (inputId === 'confirmPassword') {
        isValid =
          inputValue === formState.inputValues.password &&
          inputValue !== '';
      }

      dispatch({
        type: 'UPDATE_INPUT',
        payload: {
          inputId,
          inputValue,
          isValid,
        },
      });
    },
    [formState.inputValues.password, dispatch]
  );

  /**
   * Handle signup submission
   */
  const handleSignup = async () => {
    if (!formState.formIsValid || !termsAccepted) {
      if (!termsAccepted) {
        Alert.alert('Agreement Required', 'Please accept the terms and conditions');
      } else {
        Alert.alert('Validation Error', 'Please fill all fields correctly');
      }
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Connect to registration API
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // TODO: Navigate to verification screen or login
            navigation.replace('Login');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Signup Failed', 'Unable to create account');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Render header section
   */
  const renderHeader = () => (
    <View style={styles.headerSection}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
        style={{ marginBottom: SIZES.padding }}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={isDark ? COLORS.white : COLORS.black}
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.headerTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Create Account
      </Text>
      <Text
        style={[
          styles.headerSubtitle,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        Join our community and start learning
      </Text>
    </View>
  );

  /**
   * Render name input
   */
  const renderNameInput = () => (
    <View style={styles.formGroup}>
      <Text
        style={[
          styles.label,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Full Name
      </Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
            borderColor: !formState.inputValidities.fullName &&
              formState.inputValues.fullName
              ? COLORS.red
              : 'transparent',
          },
        ]}
      >
        <MaterialCommunityIcons
          name="account-outline"
          size={20}
          color={COLORS.primary}
        />
        <TextInput
          placeholder="Enter your full name"
          placeholderTextColor={COLORS.gray}
          value={formState.inputValues.fullName}
          onChangeText={(value) =>
            handleInputChange('fullName', value, 'text')
          }
          style={[
            styles.input,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
          editable={!isLoading}
        />
      </View>
      {!formState.inputValidities.fullName &&
        formState.inputValues.fullName && (
          <Text style={styles.errorText}>
            {getErrorMessage('fullName')}
          </Text>
        )}
    </View>
  );

  /**
   * Render email input
   */
  const renderEmailInput = () => (
    <View style={styles.formGroup}>
      <Text
        style={[
          styles.label,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Email Address
      </Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
            borderColor: !formState.inputValidities.email &&
              formState.inputValues.email
              ? COLORS.red
              : 'transparent',
          },
        ]}
      >
        <MaterialCommunityIcons
          name="email-outline"
          size={20}
          color={COLORS.primary}
        />
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={COLORS.gray}
          keyboardType="email-address"
          value={formState.inputValues.email}
          onChangeText={(value) =>
            handleInputChange('email', value, 'email')
          }
          style={[
            styles.input,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
          editable={!isLoading}
        />
      </View>
      {!formState.inputValidities.email &&
        formState.inputValues.email && (
          <Text style={styles.errorText}>
            {getErrorMessage('email')}
          </Text>
        )}
    </View>
  );

  /**
   * Render password input with strength indicator
   */
  const renderPasswordInput = () => {
    const strength = getPasswordStrength();

    return (
      <View style={styles.formGroup}>
        <Text
          style={[
            styles.label,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Password
        </Text>
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
              borderColor: !formState.inputValidities.password &&
                formState.inputValues.password
                ? COLORS.red
                : 'transparent',
            },
          ]}
        >
          <MaterialCommunityIcons
            name="lock-outline"
            size={20}
            color={COLORS.primary}
          />
          <TextInput
            placeholder="Create a password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry={!showPassword}
            value={formState.inputValues.password}
            onChangeText={(value) =>
              handleInputChange('password', value, 'password')
            }
            style={[
              styles.input,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        </View>

        {formState.inputValues.password && (
          <View style={styles.strengthContainer}>
            <View style={styles.strengthBars}>
              {[1, 2, 3, 4].map((index) => (
                <View
                  key={index}
                  style={[
                    styles.strengthBar,
                    {
                      backgroundColor:
                        index <= strength.level
                          ? strength.color
                          : COLORS.greyscale300,
                    },
                  ]}
                />
              ))}
            </View>
            <Text
              style={[
                styles.strengthLabel,
                { color: strength.color },
              ]}
            >
              {strength.label}
            </Text>
          </View>
        )}

        {!formState.inputValidities.password &&
          formState.inputValues.password && (
            <Text style={styles.errorText}>
              {getErrorMessage('password')}
            </Text>
          )}
      </View>
    );
  };

  /**
   * Render confirm password input
   */
  const renderConfirmPasswordInput = () => (
    <View style={styles.formGroup}>
      <Text
        style={[
          styles.label,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Confirm Password
      </Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
            borderColor: !formState.inputValidities.confirmPassword &&
              formState.inputValues.confirmPassword
              ? COLORS.red
              : 'transparent',
          },
        ]}
      >
        <MaterialCommunityIcons
          name="lock-check-outline"
          size={20}
          color={COLORS.primary}
        />
        <TextInput
          placeholder="Re-enter your password"
          placeholderTextColor={COLORS.gray}
          secureTextEntry={!showConfirmPassword}
          value={formState.inputValues.confirmPassword}
          onChangeText={(value) =>
            handleInputChange('confirmPassword', value)
          }
          style={[
            styles.input,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
          editable={!isLoading}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={20}
            color={COLORS.gray}
          />
        </TouchableOpacity>
      </View>
      {!formState.inputValidities.confirmPassword &&
        formState.inputValues.confirmPassword && (
          <Text style={styles.errorText}>
            Passwords do not match
          </Text>
        )}
    </View>
  );

  /**
   * Render terms and conditions
   */
  const renderTermsCheckbox = () => (
    <TouchableOpacity
      onPress={() => setTermsAccepted(!termsAccepted)}
      style={styles.termsContainer}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: termsAccepted
              ? COLORS.primary
              : isDark
              ? COLORS.dark2
              : COLORS.greyscale100,
            borderColor: termsAccepted ? COLORS.primary : COLORS.greyscale200,
          },
        ]}
      >
        {termsAccepted && (
          <MaterialCommunityIcons
            name="check"
            size={14}
            color={COLORS.white}
          />
        )}
      </View>
      <Text
        style={[
          styles.termsText,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        I agree to the{' '}
        <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
        <Text style={styles.termsLink}>Privacy Policy</Text>
      </Text>
    </TouchableOpacity>
  );

  /**
   * Render login link
   */
  const renderLoginLink = () => (
    <View style={styles.loginContainer}>
      <Text
        style={[
          styles.loginText,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Already have an account?{' '}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.replace('Login')}
        activeOpacity={0.7}
      >
        <Text style={styles.loginLink}>Log In</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderHeader()}

          <View style={styles.formContainer}>
            {renderNameInput()}
            {renderEmailInput()}
            {renderPasswordInput()}
            {renderConfirmPasswordInput()}
            {renderTermsCheckbox()}

            <Button
              title={isLoading ? 'Creating Account...' : 'Sign Up'}
              onPress={handleSignup}
              filled
              disabled={!formState.formIsValid || !termsAccepted || isLoading}
              isLoading={isLoading}
              style={{ marginTop: SIZES.padding * 1.5 }}
            />
          </View>

          {renderLoginLink()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  headerSection: {
    marginVertical: SIZES.padding,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SIZES.base,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  formContainer: {
    marginVertical: SIZES.padding,
  },
  formGroup: {
    marginBottom: SIZES.padding * 1.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SIZES.padding,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding2,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: SIZES.padding2,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: SIZES.padding2,
  },
  strengthBars: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding2,
    marginTop: 2,
    flexShrink: 0,
  },
  termsText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.padding,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;
