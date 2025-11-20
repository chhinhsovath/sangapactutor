/**
 * NotificationsScreen Component (Phase 5 - Tier 2)
 * Display and manage notifications
 * Adapted from EducatePro template
 *
 * Features:
 * - Tab navigation (All, Unread, Archive)
 * - Notification list with grouping by date
 * - Mark as read/unread
 * - Delete notifications
 * - Empty state UI
 * - Dark mode support
 * - Action buttons for notifications
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface Notification {
  id: string;
  title: string;
  message: string;
  icon: string;
  iconColor: string;
  timestamp: string;
  date: string;
  isRead: boolean;
  action?: string;
}

interface NotificationsScreenProps {
  navigation: any;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Course Completed',
    message: 'You have completed "Advanced React Patterns"',
    icon: 'check-circle',
    iconColor: COLORS.primary,
    timestamp: '2 minutes ago',
    date: 'Today',
    isRead: false,
    action: 'View Certificate',
  },
  {
    id: '2',
    title: 'New Message',
    message: 'Sarah Johnson sent you a message',
    icon: 'message-text-outline',
    iconColor: '#FF9800',
    timestamp: '1 hour ago',
    date: 'Today',
    isRead: false,
    action: 'Reply',
  },
  {
    id: '3',
    title: 'Lesson Reminder',
    message: 'Your next lesson starts in 30 minutes',
    icon: 'bell-outline',
    iconColor: '#FFC107',
    timestamp: '3 hours ago',
    date: 'Today',
    isRead: true,
  },
  {
    id: '4',
    title: 'Course Update',
    message: '2 new lessons added to "UI/UX Design Masterclass"',
    icon: 'book-outline',
    iconColor: '#2196F3',
    timestamp: '1 day ago',
    date: 'Yesterday',
    isRead: true,
  },
  {
    id: '5',
    title: 'Special Offer',
    message: 'Get 50% off on selected courses',
    icon: 'gift-outline',
    iconColor: '#E91E63',
    timestamp: '2 days ago',
    date: 'Yesterday',
    isRead: true,
  },
  {
    id: '6',
    title: 'Payment Received',
    message: 'Your payment of $49.99 has been received',
    icon: 'check-decagram',
    iconColor: COLORS.primary,
    timestamp: '3 days ago',
    date: '3 days ago',
    isRead: true,
  },
];

const NotificationsScreen = ({ navigation }: NotificationsScreenProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archive'>(
    'all'
  );
  const [isDark] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [archivedIds, setArchivedIds] = useState<string[]>([]);

  /**
   * Get filtered notifications
   */
  const getFilteredNotifications = () => {
    const active = notifications.filter((n) => !archivedIds.includes(n.id));

    if (activeTab === 'all') return active;
    if (activeTab === 'unread') return active.filter((n) => !n.isRead);
    return [];
  };

  /**
   * Handle marking as read
   */
  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };

  /**
   * Handle deleting notification
   */
  const handleDeleteNotification = (id: string) => {
    setArchivedIds([...archivedIds, id]);
  };

  /**
   * Handle clearing all
   */
  const handleClearAll = () => {
    Alert.alert(
      'Clear All',
      `Are you sure you want to clear all ${activeTab} notifications?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => {
            if (activeTab === 'all') {
              setArchivedIds(notifications.map((n) => n.id));
            } else if (activeTab === 'unread') {
              const unreadIds = notifications
                .filter((n) => !n.isRead)
                .map((n) => n.id);
              setArchivedIds([...archivedIds, ...unreadIds]);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  /**
   * Group notifications by date
   */
  const groupNotificationsByDate = () => {
    const filtered = getFilteredNotifications();
    const grouped: Record<string, Notification[]> = {};

    filtered.forEach((notification) => {
      if (!grouped[notification.date]) {
        grouped[notification.date] = [];
      }
      grouped[notification.date].push(notification);
    });

    return grouped;
  };

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
      <View style={styles.headerLeft}>
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
      </View>

      <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7}>
        <MaterialCommunityIcons
          name="delete-outline"
          size={24}
          color={isDark ? COLORS.white : COLORS.greyscale900}
        />
      </TouchableOpacity>
    </View>
  );

  /**
   * Render tab bar
   */
  const renderTabBar = () => (
    <View
      style={[
        styles.tabBar,
        {
          borderBottomColor: isDark ? COLORS.dark2 : COLORS.greyscale200,
        },
      ]}
    >
      {['all', 'unread', 'archive'].map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab as 'all' | 'unread' | 'archive')}
          style={[
            styles.tabButton,
            activeTab === tab && styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === tab ? COLORS.primary : COLORS.greyscale600,
                fontWeight: activeTab === tab ? '700' : '500',
              },
            ]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name="bell-off-outline"
        size={64}
        color={COLORS.greyscale300}
      />
      <Text
        style={[
          styles.emptyStateTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        No Notifications
      </Text>
      <Text
        style={[
          styles.emptyStateSubtitle,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        {activeTab === 'all'
          ? 'You\'re all caught up'
          : activeTab === 'unread'
          ? 'No unread notifications'
          : 'No archived notifications'}
      </Text>
    </View>
  );

  /**
   * Render notification item
   */
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <View
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification,
        {
          backgroundColor: !item.isRead
            ? isDark
              ? 'rgba(79, 184, 255, 0.1)'
              : 'rgba(79, 184, 255, 0.05)'
            : isDark
            ? COLORS.dark2
            : COLORS.greyscale50,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: item.iconColor + '20' },
        ]}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={24}
          color={item.iconColor}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.notificationTitle,
            !item.isRead && styles.unreadTitle,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.notificationMessage,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          {item.message}
        </Text>
        <Text
          style={[
            styles.notificationTimestamp,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          {item.timestamp}
        </Text>

        {item.action && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                borderColor: COLORS.primary,
              },
            ]}
          >
            <Text style={[styles.actionText]}>
              {item.action}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionContainer}>
        {!item.isRead && (
          <TouchableOpacity
            onPress={() => handleMarkAsRead(item.id)}
            activeOpacity={0.7}
            style={styles.actionIcon}
          >
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => handleDeleteNotification(item.id)}
          activeOpacity={0.7}
          style={styles.actionIcon}
        >
          <MaterialCommunityIcons
            name="close-circle-outline"
            size={20}
            color={COLORS.gray}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Render date header
   */
  const renderDateHeader = (date: string) => (
    <Text
      key={`header-${date}`}
      style={[
        styles.dateHeader,
        {
          color: isDark ? COLORS.white : COLORS.black,
        },
      ]}
    >
      {date}
    </Text>
  );

  /**
   * Render grouped notifications
   */
  const renderGroupedNotifications = () => {
    const grouped = groupNotificationsByDate();
    const dateOrder = ['Today', 'Yesterday'];
    const otherDates = Object.keys(grouped).filter(
      (date) => !dateOrder.includes(date)
    );

    return (
      <View style={styles.notificationsContainer}>
        {[...dateOrder, ...otherDates]
          .filter((date) => grouped[date])
          .map((date) => (
            <View key={date}>
              {renderDateHeader(date)}
              {grouped[date].map((notification) =>
                renderNotificationItem({ item: notification })
              )}
            </View>
          ))}
      </View>
    );
  };

  const filteredNotifications = getFilteredNotifications();

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
      {renderTabBar()}

      {filteredNotifications.length === 0 ? (
        renderEmptyState()
      ) : (
        renderGroupedNotifications()
      )}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: SIZES.padding2,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: SIZES.padding,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SIZES.padding2,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
  },
  notificationsContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  dateHeader: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.padding,
    borderRadius: 12,
    marginBottom: SIZES.padding2,
    alignItems: 'flex-start',
  },
  unreadNotification: {
    borderLeftWidth: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding2,
    flexShrink: 0,
  },
  contentContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  notificationMessage: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 18,
  },
  notificationTimestamp: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 8,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SIZES.padding2,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  actionText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: SIZES.base,
    marginLeft: SIZES.padding,
  },
  actionIcon: {
    padding: SIZES.base,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default NotificationsScreen;
