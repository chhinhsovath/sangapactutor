/**
 * InviteFriendsScreen Component (Phase 5 - Tier 3)
 * Referral and invite friends system
 * Adapted from EducatePro template
 *
 * Features:
 * - Share referral code
 * - Copy invite link
 * - Invite via different channels
 * - Referral rewards display
 * - Invited friends list
 * - Share statistics
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
  Share,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface InviteFriendsScreenProps {
  navigation: any;
}

const MOCK_INVITED_FRIENDS = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    status: 'Completed',
    reward: '$10',
    date: '2025-01-15',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    status: 'Pending',
    reward: 'Pending',
    date: '2025-01-10',
  },
  {
    id: '3',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    status: 'Completed',
    reward: '$10',
    date: '2025-01-05',
  },
];

const InviteFriendsScreen = ({ navigation }: InviteFriendsScreenProps) => {
  const [isDark] = useState(false);
  const referralCode = 'REFER2025';
  const referralLink = 'https://educatepro.app/invite/REFER2025';

  /**
   * Handle copy to clipboard
   */
  const handleCopyCode = () => {
    Alert.alert('Copied', 'Referral code copied to clipboard!');
  };

  /**
   * Handle share
   */
  const handleShare = async (platform?: string) => {
    const message = `Join me on EducatePro and get $10 discount with my referral code: ${referralCode}. Use link: ${referralLink}`;

    try {
      if (platform) {
        Alert.alert('Share', `Opening ${platform} to share...`);
      } else {
        await Share.share({
          message,
          title: 'Join EducatePro',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to share');
    }
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
        Invite Friends
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );

  /**
   * Render referral code section
   */
  const renderReferralCode = () => (
    <View
      style={[
        styles.referralCard,
        {
          backgroundColor: COLORS.primary,
        },
      ]}
    >
      <View style={styles.referralContent}>
        <Text style={styles.referralLabel}>Your Referral Code</Text>
        <Text style={styles.referralCode}>{referralCode}</Text>
        <Text style={styles.referralDescription}>
          Share this code and earn rewards when friends sign up
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleCopyCode}
        style={styles.copyButton}
      >
        <MaterialCommunityIcons
          name="content-copy"
          size={24}
          color={COLORS.white}
        />
      </TouchableOpacity>
    </View>
  );

  /**
   * Render rewards stats
   */
  const renderRewardsStats = () => (
    <View
      style={[
        styles.statsContainer,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
        },
      ]}
    >
      <View style={styles.statItem}>
        <Text
          style={[
            styles.statValue,
            {
              color: COLORS.primary,
            },
          ]}
        >
          3
        </Text>
        <Text
          style={[
            styles.statLabel,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          Friends Invited
        </Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.statItem}>
        <Text
          style={[
            styles.statValue,
            {
              color: COLORS.primary,
            },
          ]}
        >
          2
        </Text>
        <Text
          style={[
            styles.statLabel,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          Completed
        </Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.statItem}>
        <Text
          style={[
            styles.statValue,
            {
              color: COLORS.primary,
            },
          ]}
        >
          $20
        </Text>
        <Text
          style={[
            styles.statLabel,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          Earned
        </Text>
      </View>
    </View>
  );

  /**
   * Render share channels
   */
  const renderShareChannels = () => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Share Via
      </Text>

      <View style={styles.channelGrid}>
        <TouchableOpacity
          onPress={() => handleShare('WhatsApp')}
          style={[
            styles.channelButton,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="whatsapp"
            size={28}
            color="#25D366"
          />
          <Text
            style={[
              styles.channelName,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            WhatsApp
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleShare('Facebook')}
          style={[
            styles.channelButton,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="facebook"
            size={28}
            color="#1877F2"
          />
          <Text
            style={[
              styles.channelName,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Facebook
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleShare('Twitter')}
          style={[
            styles.channelButton,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="twitter"
            size={28}
            color="#1DA1F2"
          />
          <Text
            style={[
              styles.channelName,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Twitter
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleShare()}
          style={[
            styles.channelButton,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="share-variant"
            size={28}
            color={COLORS.primary}
          />
          <Text
            style={[
              styles.channelName,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Render invited friends
   */
  const renderInvitedFriends = () => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Invited Friends
      </Text>

      {MOCK_INVITED_FRIENDS.map((friend) => (
        <View
          key={friend.id}
          style={[
            styles.friendItem,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
        >
          <View style={styles.friendInfo}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: COLORS.primary + '20' },
              ]}
            >
              <Text style={styles.avatarText}>
                {friend.name.charAt(0)}
              </Text>
            </View>

            <View style={{ flex: 1, marginLeft: SIZES.padding2 }}>
              <Text
                style={[
                  styles.friendName,
                  {
                    color: isDark ? COLORS.white : COLORS.black,
                  },
                ]}
              >
                {friend.name}
              </Text>
              <Text
                style={[
                  styles.friendEmail,
                  {
                    color: isDark ? COLORS.gray : COLORS.greyscale600,
                  },
                ]}
              >
                {friend.email}
              </Text>
              <Text
                style={[
                  styles.friendDate,
                  {
                    color: isDark ? COLORS.gray : COLORS.greyscale600,
                  },
                ]}
              >
                Invited on {friend.date}
              </Text>
            </View>
          </View>

          <View style={styles.friendStatus}>
            <Text
              style={[
                styles.statusBadge,
                {
                  color: friend.status === 'Completed' ? COLORS.primary : COLORS.gray,
                  backgroundColor:
                    friend.status === 'Completed'
                      ? COLORS.primary + '20'
                      : COLORS.gray + '20',
                },
              ]}
            >
              {friend.status}
            </Text>
            <Text
              style={[
                styles.reward,
                {
                  color: friend.reward === 'Pending' ? COLORS.gray : COLORS.primary,
                  fontWeight: '700',
                },
              ]}
            >
              {friend.reward}
            </Text>
          </View>
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
        {renderReferralCode()}
        {renderRewardsStats()}
        {renderShareChannels()}
        {renderInvitedFriends()}
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
  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding * 1.5,
    borderRadius: 12,
    marginBottom: SIZES.padding * 2,
    justifyContent: 'space-between',
  },
  referralContent: {
    flex: 1,
  },
  referralLabel: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
    marginBottom: 4,
  },
  referralCode: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1,
  },
  referralDescription: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
    lineHeight: 16,
  },
  copyButton: {
    padding: SIZES.padding,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SIZES.padding,
    borderRadius: 12,
    marginBottom: SIZES.padding * 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.greyscale200,
  },
  section: {
    marginBottom: SIZES.padding * 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SIZES.padding2,
  },
  channelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.padding2,
  },
  channelButton: {
    width: '48%',
    paddingVertical: SIZES.padding,
    alignItems: 'center',
    borderRadius: 12,
  },
  channelName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: SIZES.base,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding2,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  friendName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  friendEmail: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  friendDate: {
    fontSize: 10,
    fontWeight: '500',
  },
  friendStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  reward: {
    fontSize: 12,
  },
});

export default InviteFriendsScreen;
