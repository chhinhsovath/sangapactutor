/**
 * SettingsNotificationsScreen Component (Phase 5 - Tier 3)
 * Notification preferences and settings
 * Adapted from EducatePro template
 *
 * Features:
 * - Push notification toggles
 * - Email notification preferences
 * - SMS notification settings
 * - Notification frequency settings
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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface SettingsNotificationsScreenProps {
  navigation: any;
}

const SettingsNotificationsScreen = ({
  navigation,
}: SettingsNotificationsScreenProps) => {
  const [isDark] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [messages, setMessages] = useState(true);

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
        Notifications
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );

  /**
   * Render notification setting item
   */
  const renderNotificationItem = ({
    icon,
    title,
    description,
    enabled,
    onToggle,
  }: any) => (
    <View
      style={[
        styles.settingItem,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
        },
      ]}
    >
      <View style={styles.settingContent}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.settingText}>
          <Text
            style={[
              styles.settingTitle,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.settingDescription,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            {description}
          </Text>
        </View>
      </View>

      <Switch
        value={enabled}
        onValueChange={onToggle}
        thumbColor={enabled ? COLORS.primary : COLORS.white}
        trackColor={{ false: COLORS.greyscale300, true: COLORS.primary + '40' }}
        style={styles.switch}
      />
    </View>
  );

  /**
   * Render section
   */
  const renderSection = ({ title, items }: any) => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        {title}
      </Text>
      {items.map((item: any, index: number) => (
        <View key={index}>
          {renderNotificationItem(item)}
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
        {renderSection({
          title: 'Notification Channels',
          items: [
            {
              icon: 'bell',
              title: 'Push Notifications',
              description: 'Receive push notifications on your device',
              enabled: pushEnabled,
              onToggle: setPushEnabled,
            },
            {
              icon: 'email',
              title: 'Email Notifications',
              description: 'Receive updates via email',
              enabled: emailEnabled,
              onToggle: setEmailEnabled,
            },
            {
              icon: 'message-text',
              title: 'SMS Notifications',
              description: 'Receive text messages for important updates',
              enabled: smsEnabled,
              onToggle: setSmsEnabled,
            },
          ],
        })}

        {renderSection({
          title: 'Notification Types',
          items: [
            {
              icon: 'book-open-variant',
              title: 'Course Updates',
              description: 'Get notified about new lessons and course content',
              enabled: courseUpdates,
              onToggle: setCourseUpdates,
            },
            {
              icon: 'gift',
              title: 'Promotions & Offers',
              description: 'Receive notifications about special deals and discounts',
              enabled: promotions,
              onToggle: setPromotions,
            },
            {
              icon: 'chat',
              title: 'Messages',
              description: 'Get notified when you receive messages',
              enabled: messages,
              onToggle: setMessages,
            },
          ],
        })}
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SIZES.padding2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding2,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding2,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    fontWeight: '500',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});

export default SettingsNotificationsScreen;
