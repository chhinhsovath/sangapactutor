/**
 * SettingsSecurityScreen Component (Phase 5 - Tier 3)
 * Account security and privacy settings
 * Adapted from EducatePro template
 *
 * Features:
 * - Password change
 * - Two-factor authentication
 * - Login activity
 * - Connected devices
 * - Session management
 * - Dark mode support
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { Button } from '../../components/EducatePro';

interface SettingsSecurityScreenProps {
  navigation: any;
}

const MOCK_SESSIONS = [
  {
    id: '1',
    device: 'iPhone 14 Pro',
    location: 'San Francisco, CA',
    lastActive: '2 minutes ago',
    isCurrent: true,
  },
  {
    id: '2',
    device: 'MacBook Pro',
    location: 'San Francisco, CA',
    lastActive: '1 hour ago',
    isCurrent: false,
  },
];

const SettingsSecurityScreen = ({ navigation }: SettingsSecurityScreenProps) => {
  const [isDark] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [sessions, setSessions] = useState(MOCK_SESSIONS);

  /**
   * Render header
   */
  const renderHeader = () => (
    <View
      style={[
        styles.header,
        {
          backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
          borderBottomColor: isDark ? COLORS.dark2 : COLORS.greyscale200,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
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
        Security
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );

  /**
   * Render password section
   */
  const renderPasswordSection = () => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Password
      </Text>

      <View
        style={[
          styles.settingItem,
          {
            backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.settingTitle,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Change Password
          </Text>
          <Text
            style={[
              styles.settingDescription,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            Update your password regularly for security
          </Text>
        </View>
      </View>

      <Button
        title="Change Password"
        onPress={() => {
          Alert.alert('Change Password', 'Navigating to change password form');
        }}
        filled={false}
        color={COLORS.greyscale200}
        textColor={isDark ? COLORS.white : COLORS.black}
        style={{ marginTop: SIZES.padding2 }}
      />
    </View>
  );

  /**
   * Render authentication section
   */
  const renderAuthenticationSection = () => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Authentication
      </Text>

      <View
        style={[
          styles.settingItem,
          {
            backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.settingTitle,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Two-Factor Authentication
          </Text>
          <Text
            style={[
              styles.settingDescription,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            Require a code when signing in
          </Text>
        </View>

        <Switch
          value={twoFactorEnabled}
          onValueChange={setTwoFactorEnabled}
          thumbColor={twoFactorEnabled ? COLORS.primary : COLORS.white}
          trackColor={{ false: COLORS.greyscale300, true: COLORS.primary + '40' }}
          style={styles.switch}
        />
      </View>

      <View
        style={[
          styles.settingItem,
          {
            backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            marginTop: SIZES.padding2,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.settingTitle,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Biometric Login
          </Text>
          <Text
            style={[
              styles.settingDescription,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            Use Face ID or Touch ID to sign in
          </Text>
        </View>

        <Switch
          value={biometricsEnabled}
          onValueChange={setBiometricsEnabled}
          thumbColor={biometricsEnabled ? COLORS.primary : COLORS.white}
          trackColor={{ false: COLORS.greyscale300, true: COLORS.primary + '40' }}
          style={styles.switch}
        />
      </View>
    </View>
  );

  /**
   * Render active sessions
   */
  const renderActiveSessions = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Active Sessions
        </Text>

        <TouchableOpacity
          onPress={() => {
            setSessions(sessions.filter((s) => s.isCurrent));
            Alert.alert('Success', 'All other sessions have been signed out');
          }}
        >
          <Text style={styles.signOutAllButton}>Sign Out All</Text>
        </TouchableOpacity>
      </View>

      {sessions.map((session) => (
        <View
          key={session.id}
          style={[
            styles.sessionItem,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={session.device.includes('iPhone') ? 'phone' : 'laptop'}
            size={28}
            color={COLORS.primary}
          />

          <View style={{ flex: 1, marginHorizontal: SIZES.padding2 }}>
            <View style={styles.sessionHeader}>
              <Text
                style={[
                  styles.sessionDevice,
                  {
                    color: isDark ? COLORS.white : COLORS.black,
                  },
                ]}
              >
                {session.device}
              </Text>
              {session.isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentText}>Current</Text>
                </View>
              )}
            </View>

            <Text
              style={[
                styles.sessionInfo,
                {
                  color: isDark ? COLORS.gray : COLORS.greyscale600,
                },
              ]}
            >
              {session.location}
            </Text>

            <Text
              style={[
                styles.sessionInfo,
                {
                  color: isDark ? COLORS.gray : COLORS.greyscale600,
                },
              ]}
            >
              Last active: {session.lastActive}
            </Text>
          </View>

          {!session.isCurrent && (
            <TouchableOpacity
              onPress={() => {
                setSessions(sessions.filter((s) => s.id !== session.id));
              }}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          )}
        </View>
      ))}
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
      {renderHeader()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {renderPasswordSection()}
        {renderAuthenticationSection()}
        {renderActiveSessions()}
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
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  section: {
    marginBottom: SIZES.padding * 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  signOutAllButton: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: '700',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding2,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    fontWeight: '500',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding2,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionDevice: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: SIZES.base,
  },
  currentBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  sessionInfo: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default SettingsSecurityScreen;
