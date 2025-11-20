/**
 * EditProfileScreen Component (Phase 5)
 * User profile editing with form validation
 * Adapted from EducatePro template
 *
 * Features:
 * - Profile image upload
 * - Form fields with validation
 * - Gender selection
 * - Date picker
 * - Form state management
 * - Dark mode support
 * - Validation error messages
 */

import React, { useCallback, useReducer, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { Header, Input, Button, DatePickerModal } from '../../components/EducatePro';
import { formReducer, FormState } from '../../utils/formReducer';
import {
  validateInput,
  getErrorMessage,
} from '../../utils/validation';

interface EditProfileScreenProps {
  navigation: any;
}

const initialFormState: FormState = {
  inputValues: {
    fullName: 'John Doe',
    email: 'john@example.com',
    nickname: 'Johnny',
    phoneNumber: '+1 (555) 123-4567',
  },
  inputValidities: {
    fullName: true,
    email: true,
    nickname: true,
    phoneNumber: true,
  },
  formIsValid: true,
};

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const EditProfileScreen = ({ navigation }: EditProfileScreenProps) => {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [profileImage, setProfileImage] = useState(
    require('../../../assets/icon.png')
  );
  const [selectedGender, setSelectedGender] = useState('male');
  const [selectedDate, setSelectedDate] = useState('2000-01-01');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

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
   * Handle image upload
   */
  const handleImageUpload = () => {
    Alert.alert('Image Upload', 'Select image source', [
      {
        text: 'Camera',
        onPress: () => {
          // TODO: Implement camera capture
          console.log('Camera selected');
        },
      },
      {
        text: 'Gallery',
        onPress: () => {
          // TODO: Implement gallery picker
          console.log('Gallery selected');
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  /**
   * Handle form submission
   */
  const handleSaveProfile = async () => {
    if (!formState.formIsValid) {
      Alert.alert('Validation Error', 'Please fill all fields correctly');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Submit form data to API
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Render profile image section
   */
  const renderImageSection = () => (
    <View style={styles.imageSection}>
      <View style={styles.imageContainer}>
        <Image
          source={profileImage}
          resizeMode="cover"
          style={styles.profileImage}
        />
        <TouchableOpacity
          onPress={handleImageUpload}
          style={styles.editImageButton}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={16}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={[
          styles.imageHelper,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        Tap to change profile picture
      </Text>
    </View>
  );

  /**
   * Render form inputs section
   */
  const renderFormInputs = () => (
    <View style={styles.formSection}>
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
        <Input
          id="fullName"
          value={formState.inputValues.fullName}
          onInputChanged={(value) => handleInputChange('fullName', value, 'text')}
          placeholder="Enter your full name"
          errorText={
            !formState.inputValidities.fullName
              ? 'Please enter a valid name'
              : undefined
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text
          style={[
            styles.label,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Email
        </Text>
        <Input
          id="email"
          value={formState.inputValues.email}
          onInputChanged={(value) => handleInputChange('email', value, 'email')}
          placeholder="Enter your email"
          keyboardType="email-address"
          errorText={
            !formState.inputValidities.email
              ? 'Please enter a valid email'
              : undefined
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text
          style={[
            styles.label,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Nickname
        </Text>
        <Input
          id="nickname"
          value={formState.inputValues.nickname}
          onInputChanged={(value) => handleInputChange('nickname', value, 'text')}
          placeholder="Enter your nickname"
          errorText={
            !formState.inputValidities.nickname
              ? 'Please enter a nickname'
              : undefined
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text
          style={[
            styles.label,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Phone Number
        </Text>
        <Input
          id="phoneNumber"
          value={formState.inputValues.phoneNumber}
          onInputChanged={(value) => handleInputChange('phoneNumber', value, 'phone')}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          errorText={
            !formState.inputValidities.phoneNumber
              ? 'Please enter a valid phone number'
              : undefined
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text
          style={[
            styles.label,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Gender
        </Text>
        <TouchableOpacity
          onPress={() => setShowGenderDropdown(!showGenderDropdown)}
          style={[
            styles.genderSelector,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
              borderColor: isDark ? COLORS.dark2 : COLORS.greyscale200,
            },
          ]}
        >
          <Text
            style={[
              styles.genderText,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            {GENDER_OPTIONS.find((g) => g.value === selectedGender)?.label}
          </Text>
          <MaterialCommunityIcons
            name={showGenderDropdown ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={isDark ? COLORS.white : COLORS.black}
          />
        </TouchableOpacity>

        {showGenderDropdown && (
          <View
            style={[
              styles.genderDropdown,
              {
                backgroundColor: isDark ? COLORS.dark2 : COLORS.white,
                borderColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
              },
            ]}
          >
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setSelectedGender(option.value);
                  setShowGenderDropdown(false);
                }}
                style={[
                  styles.dropdownItem,
                  selectedGender === option.value && styles.selectedDropdownItem,
                ]}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    {
                      color:
                        selectedGender === option.value
                          ? COLORS.primary
                          : isDark
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text
          style={[
            styles.label,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Date of Birth
        </Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.dateSelector,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
              borderColor: isDark ? COLORS.dark2 : COLORS.greyscale200,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="calendar"
            size={20}
            color={COLORS.primary}
          />
          <Text
            style={[
              styles.dateText,
              {
                color: isDark ? COLORS.white : COLORS.black,
                marginLeft: SIZES.padding,
              },
            ]}
          >
            {selectedDate}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Render action buttons
   */
  const renderButtons = () => (
    <View style={styles.buttonSection}>
      <Button
        title="Cancel"
        onPress={() => navigation.goBack()}
        filled={false}
        color={COLORS.greyscale200}
        textColor={isDark ? COLORS.white : COLORS.black}
        style={{ marginBottom: SIZES.padding }}
      />

      <Button
        title={isLoading ? 'Saving...' : 'Save Changes'}
        onPress={handleSaveProfile}
        filled
        disabled={!formState.formIsValid || isLoading}
        isLoading={isLoading}
      />
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
      <Header
        title="Edit Profile"
        onBackPress={() => navigation.goBack()}
        isDark={isDark}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderImageSection()}
        {renderFormInputs()}
        {renderButtons()}
      </ScrollView>

      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateChange={setSelectedDate}
        selectedDate={selectedDate}
        isDark={isDark}
        mode="date"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding * 3,
  },
  imageSection: {
    alignItems: 'center',
    marginVertical: SIZES.padding * 2,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: SIZES.padding,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageHelper: {
    fontSize: 12,
    fontWeight: '500',
  },
  formSection: {
    marginTop: SIZES.padding,
  },
  formGroup: {
    marginBottom: SIZES.padding * 1.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SIZES.padding,
  },
  genderSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.padding,
    borderRadius: 12,
    borderWidth: 1,
  },
  genderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  genderDropdown: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.padding,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.greyscale200,
  },
  selectedDropdownItem: {
    backgroundColor: COLORS.transparentPrimary,
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.padding,
    borderRadius: 12,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonSection: {
    marginTop: SIZES.padding * 2,
    marginBottom: SIZES.padding,
  },
});

export default EditProfileScreen;
