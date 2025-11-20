/**
 * ProfileScreen Component (Phase 5)
 * User profile display with settings menu
 * Adapted from EducatePro template
 *
 * Features:
 * - User profile header with avatar
 * - Profile info display
 * - Settings menu items
 * - Dark mode support
 * - Navigation integration
 * - Logout confirmation
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  ImageSourcePropType,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { EDUCATEPRO_ICONS } from '../../constants/educatepro-icons';
import { SettingsItem, Button } from '../../components/EducatePro';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { user, logout } = useAuth();
  const [isDark] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userAvatar, setUserAvatar] = useState(
    require('../../../assets/icon.png')
  );

  /**
   * Handle logout action
   */
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        },
        style: 'destructive',
      },
    ]);
  };

  /**
   * Handle dark mode toggle
   */
  const handleDarkModeToggle = (value: boolean) => {
    setIsDarkMode(value);
    // TODO: Implement theme switching in ThemeContext
  };

  /**
   * Render user profile section
   */
  const renderProfileSection = () => (
    <View
      style={[
        styles.profileSection,
        {
          borderBottomColor: isDark ? COLORS.dark2 : COLORS.greyscale200,
        },
      ]}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={userAvatar}
          resizeMode="cover"
          style={styles.avatar}
        />
        <TouchableOpacity
          onPress={() => {
            // TODO: Implement image picker
          }}
          style={styles.editAvatarButton}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={14}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.userName,
          {
            color: isDark ? COLORS.white : COLORS.greyscale900,
          },
        ]}
      >
        {user?.fullName || 'User Name'}
      </Text>

      <Text
        style={[
          styles.userEmail,
          {
            color: isDark ? COLORS.secondaryWhite : COLORS.greyscale600,
          },
        ]}
      >
        {user?.email || 'user@example.com'}
      </Text>
    </View>
  );

  /**
   * Render settings menu
   */
  const renderSettingsSection = () => (
    <View style={styles.settingsSection}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Account Settings
      </Text>

      <SettingsItem
        iconName="account-edit"
        label="Edit Profile"
        onPress={() => navigation.navigate('EditProfile')}
        isDark={isDark}
      />

      <SettingsItem
        iconName="bell-outline"
        label="Notifications"
        onPress={() => navigation.navigate('SettingsNotifications')}
        isDark={isDark}
      />

      <SettingsItem
        iconName="wallet-outline"
        label="Payment Methods"
        onPress={() => navigation.navigate('SettingsPayment')}
        isDark={isDark}
      />

      <SettingsItem
        iconName="shield-outline"
        label="Security"
        onPress={() => navigation.navigate('SettingsSecurity')}
        isDark={isDark}
      />

      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
          { marginTop: SIZES.padding },
        ]}
      >
        Preferences
      </Text>

      <SettingsItem
        iconName="earth"
        label="Language & Region"
        onPress={() => navigation.navigate('SettingsLanguage')}
        isDark={isDark}
        rightElement={
          <Text
            style={[
              styles.preferenceValue,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            English (US)
          </Text>
        }
      />

      <SettingsItem
        iconName="moon-outline"
        label="Dark Mode"
        onPress={() => {}}
        isDark={isDark}
        showArrow={false}
        rightElement={
          <Switch
            value={isDarkMode}
            onValueChange={handleDarkModeToggle}
            thumbColor={isDarkMode ? COLORS.white : COLORS.white}
            trackColor={{ false: COLORS.greyscale300, true: COLORS.primary }}
            style={styles.switch}
          />
        }
      />

      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
          { marginTop: SIZES.padding },
        ]}
      >
        Support
      </Text>

      <SettingsItem
        iconName="help-circle-outline"
        label="Help Center"
        onPress={() => navigation.navigate('HelpCenter')}
        isDark={isDark}
      />

      <SettingsItem
        iconName="shield-lock-outline"
        label="Privacy Policy"
        onPress={() => navigation.navigate('SettingsPrivacyPolicy')}
        isDark={isDark}
      />

      <SettingsItem
        iconName="account-multiple-plus"
        label="Invite Friends"
        onPress={() => navigation.navigate('InviteFriends')}
        isDark={isDark}
      />

      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
          { marginTop: SIZES.padding },
        ]}
      >
        Danger Zone
      </Text>

      <SettingsItem
        iconName="logout"
        label="Logout"
        onPress={handleLogout}
        isDark={isDark}
        rightElement={null}
        showArrow={false}
        style={{
          backgroundColor: isDark ? '#3a2a2a' : '#fef0f0',
          marginBottom: SIZES.padding * 2,
        }}
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
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
            borderBottomColor: isDark ? COLORS.dark2 : COLORS.greyscale200,
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Profile
        </Text>

        <TouchableOpacity
          onPress={() => {
            // TODO: Show profile menu
          }}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color={isDark ? COLORS.white : COLORS.greyscale900}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderProfileSection()}
        {renderSettingsSection()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
  },
  profileSection: {
    alignItems: 'center',
    paddingBottom: SIZES.padding,
    marginBottom: SIZES.padding,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SIZES.padding2,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 8,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingsSection: {
    marginBottom: SIZES.padding * 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: SIZES.padding2,
    marginBottom: SIZES.padding2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  preferenceValue: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});

export default ProfileScreen;
