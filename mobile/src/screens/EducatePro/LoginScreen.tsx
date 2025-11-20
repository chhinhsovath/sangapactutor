/**
 * LoginScreen Component (Phase 5 - Tier 2)
 * User authentication with form validation
 * Adapted from EducatePro template
 *
 * Features:
 * - Email and password input
 * - Form validation
 * - Remember me toggle
 * - Forgot password link
 * - Social login options (UI only)
 * - Navigation to signup
 * - Dark mode support
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

interface LoginScreenProps {
  navigation: any;
}

const initialFormState: FormState = {
  inputValues: {
    email: '',
    password: '',
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [isDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle input change with validation
   */
  const handleInputChange = useCallback(
    (inputId: string, inputValue: string, inputType: string = 'text') => {
      const isValid = validateInput(inputId, inputValue, inputType as any);

      dispatch({
        type: 'UPDATE_INPUT',
        payload: {
          inputId,
          inputValue,
          isValid,
        },
      });
    },
    [dispatch]
  );

  /**
   * Handle login submission
   */
  const handleLogin = async () => {
    if (!formState.formIsValid) {
      Alert.alert('Validation Error', 'Please fill all fields correctly');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Connect to authentication API
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      Alert.alert('Success', 'Login successful!', [
        {
          text: 'OK',
          onPress: () => {
            // TODO: Navigate to home screen after login
            navigation.replace('Main');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Render header section
   */
  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text
        style={[
          styles.headerTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Welcome Back
      </Text>
      <Text
        style={[
          styles.headerSubtitle,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        Log in to continue learning
      </Text>
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
   * Render password input
   */
  const renderPasswordInput = () => (
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
          placeholder="Enter your password"
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
      {!formState.inputValidities.password &&
        formState.inputValues.password && (
          <Text style={styles.errorText}>
            {getErrorMessage('password')}
          </Text>
        )}
    </View>
  );

  /**
   * Render remember me and forgot password
   */
  const renderFooterOptions = () => (
    <View style={styles.footerOptionsContainer}>
      <TouchableOpacity
        onPress={() => setRememberMe(!rememberMe)}
        style={styles.rememberMeContainer}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: rememberMe
                ? COLORS.primary
                : isDark
                ? COLORS.dark2
                : COLORS.greyscale100,
              borderColor: rememberMe ? COLORS.primary : COLORS.greyscale200,
            },
          ]}
        >
          {rememberMe && (
            <MaterialCommunityIcons
              name="check"
              size={14}
              color={COLORS.white}
            />
          )}
        </View>
        <Text
          style={[
            styles.rememberMeText,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Remember me
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPassword')}
        activeOpacity={0.7}
      >
        <Text style={[styles.forgotPasswordText]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render social login options
   */
  const renderSocialLogin = () => (
    <View style={styles.socialLoginContainer}>
      <Text
        style={[
          styles.dividerText,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        Or continue with
      </Text>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.socialButton,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="google"
            size={24}
            color="#4285F4"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.socialButton,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="facebook"
            size={24}
            color="#1877F2"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.socialButton,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="apple"
            size={24}
            color={isDark ? COLORS.white : COLORS.black}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Render signup link
   */
  const renderSignupLink = () => (
    <View style={styles.signupContainer}>
      <Text
        style={[
          styles.signupText,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Don't have an account?{' '}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Signup')}
        activeOpacity={0.7}
      >
        <Text style={styles.signupLink}>Sign Up</Text>
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
            {renderEmailInput()}
            {renderPasswordInput()}
            {renderFooterOptions()}

            <Button
              title={isLoading ? 'Logging In...' : 'Log In'}
              onPress={handleLogin}
              filled
              disabled={!formState.formIsValid || isLoading}
              isLoading={isLoading}
              style={{ marginTop: SIZES.padding * 1.5 }}
            />
          </View>

          {renderSocialLogin()}
          {renderSignupLink()}
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
    marginVertical: SIZES.padding * 1.5,
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
  footerOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rememberMeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  socialLoginContainer: {
    marginVertical: SIZES.padding * 2,
  },
  dividerText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: SIZES.padding,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.padding,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.padding,
  },
  signupText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signupLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
