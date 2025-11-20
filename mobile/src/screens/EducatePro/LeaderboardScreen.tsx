/**
 * LeaderboardScreen Component (Phase 5 - Tier 4)
 * User rankings and competition
 * Adapted from EducatePro template
 *
 * Features:
 * - Global leaderboard
 * - User rankings
 * - Points tracking
 * - Category-based rankings
 * - User profile preview
 * - Dark mode support
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar: any;
  points: number;
  coursesCompleted: number;
  level: string;
  badge: string;
  isCurrentUser: boolean;
}

interface LeaderboardScreenProps {
  navigation: any;
}

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  {
    id: '1',
    rank: 1,
    name: 'Sarah Johnson',
    avatar: require('../../../assets/icon.png'),
    points: 4850,
    coursesCompleted: 12,
    level: 'Expert',
    badge: 'trophy',
    isCurrentUser: false,
  },
  {
    id: '2',
    rank: 2,
    name: 'Michael Chen',
    avatar: require('../../../assets/icon.png'),
    points: 4620,
    coursesCompleted: 11,
    level: 'Expert',
    badge: 'medal',
    isCurrentUser: false,
  },
  {
    id: '3',
    rank: 3,
    name: 'Emma Wilson',
    avatar: require('../../../assets/icon.png'),
    points: 4350,
    coursesCompleted: 10,
    level: 'Advanced',
    badge: 'award',
    isCurrentUser: false,
  },
  {
    id: '4',
    rank: 4,
    name: 'John Smith',
    avatar: require('../../../assets/icon.png'),
    points: 3920,
    coursesCompleted: 9,
    level: 'Advanced',
    badge: 'star',
    isCurrentUser: false,
  },
  {
    id: '5',
    rank: 5,
    name: 'Lisa Anderson',
    avatar: require('../../../assets/icon.png'),
    points: 3650,
    coursesCompleted: 8,
    level: 'Intermediate',
    badge: 'heart',
    isCurrentUser: false,
  },
  {
    id: '6',
    rank: 42,
    name: 'You',
    avatar: require('../../../assets/icon.png'),
    points: 1850,
    coursesCompleted: 4,
    level: 'Beginner',
    badge: 'flag',
    isCurrentUser: true,
  },
];

const LeaderboardScreen = ({ navigation }: LeaderboardScreenProps) => {
  const [isDark] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'overall' | 'weekly' | 'monthly'>('overall');

  /**
   * Get badge color based on badge type
   */
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'trophy':
        return '#FFD700';
      case 'medal':
        return '#C0C0C0';
      case 'award':
        return '#CD7F32';
      case 'star':
        return COLORS.primary;
      case 'heart':
        return COLORS.red;
      case 'flag':
        return COLORS.primary;
      default:
        return COLORS.greyscale400;
    }
  };

  /**
   * Get rank medal icon
   */
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return 'trophy';
      case 2:
        return 'medal';
      case 3:
        return 'award';
      default:
        return 'hash';
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
      <TouchableOpacity onPress={() => navigation.goBack()}>
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
        Leaderboard
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );

  /**
   * Render user stats
   */
  const renderUserStats = () => {
    const currentUser = MOCK_LEADERBOARD.find((u) => u.isCurrentUser);

    return (
      <View
        style={[
          styles.userStatsCard,
          {
            backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
          },
        ]}
      >
        <View style={styles.userStatsHeader}>
          <View style={styles.userStatsInfo}>
            <Text
              style={[
                styles.userStatsRank,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              Your Rank
            </Text>
            <Text style={styles.userStatsRankValue}>#{currentUser?.rank}</Text>
          </View>

          <View style={styles.userStatsDivider} />

          <View style={styles.userStatsInfo}>
            <Text
              style={[
                styles.userStatsLabel,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              Points
            </Text>
            <Text style={styles.userStatsValue}>{currentUser?.points}</Text>
          </View>

          <View style={styles.userStatsDivider} />

          <View style={styles.userStatsInfo}>
            <Text
              style={[
                styles.userStatsLabel,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              Courses
            </Text>
            <Text style={styles.userStatsValue}>{currentUser?.coursesCompleted}</Text>
          </View>
        </View>

        <Text
          style={[
            styles.userStatsLevel,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          {currentUser?.level} Level
        </Text>
      </View>
    );
  };

  /**
   * Render category tabs
   */
  const renderCategoryTabs = () => (
    <View style={styles.categoryContainer}>
      {(['overall', 'weekly', 'monthly'] as const).map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => setSelectedCategory(category)}
          style={[
            styles.categoryTab,
            selectedCategory === category && styles.categoryTabActive,
            {
              backgroundColor: selectedCategory === category ? COLORS.primary : 'transparent',
            },
          ]}
        >
          <Text
            style={[
              styles.categoryTabText,
              {
                color: selectedCategory === category ? COLORS.white : COLORS.greyscale600,
              },
            ]}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  /**
   * Render leaderboard item
   */
  const renderLeaderboardItem = ({ item, index }: { item: LeaderboardUser; index: number }) => {
    const isTopThree = item.rank <= 3;

    return (
      <View
        style={[
          styles.leaderboardItem,
          {
            backgroundColor: isDark ? COLORS.dark2 : COLORS.white,
            borderColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
            borderLeftWidth: item.isCurrentUser ? 4 : 0,
            borderLeftColor: item.isCurrentUser ? COLORS.primary : undefined,
          },
        ]}
      >
        <View style={styles.rankSection}>
          {isTopThree ? (
            <View
              style={[
                styles.rankBadge,
                {
                  backgroundColor: getBadgeColor(item.badge) + '20',
                },
              ]}
            >
              <MaterialCommunityIcons
                name={getRankIcon(item.rank)}
                size={20}
                color={getBadgeColor(item.badge)}
              />
            </View>
          ) : (
            <Text
              style={[
                styles.rankNumber,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              #{item.rank}
            </Text>
          )}
        </View>

        <View style={styles.userSection}>
          <Image source={item.avatar} style={styles.avatar} />

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.userName,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.userLevel,
                {
                  color: isDark ? COLORS.gray : COLORS.greyscale600,
                },
              ]}
            >
              {item.level}
            </Text>
          </View>
        </View>

        <View style={styles.pointsSection}>
          <View style={styles.pointsInfo}>
            <Text
              style={[
                styles.pointsLabel,
                {
                  color: isDark ? COLORS.gray : COLORS.greyscale600,
                },
              ]}
            >
              Points
            </Text>
            <Text
              style={[
                styles.pointsValue,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              {item.points}
            </Text>
          </View>

          <TouchableOpacity>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={COLORS.greyscale400}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /**
   * Render top three users
   */
  const renderTopThree = () => {
    const topThree = MOCK_LEADERBOARD.slice(0, 3);

    return (
      <View style={styles.topThreeContainer}>
        {topThree.map((user) => (
          <View
            key={user.id}
            style={[
              styles.topThreeCard,
              {
                backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
              },
            ]}
          >
            <View
              style={[
                styles.topThreeBadge,
                {
                  backgroundColor: getBadgeColor(user.badge) + '30',
                },
              ]}
            >
              <MaterialCommunityIcons
                name={getRankIcon(user.rank)}
                size={28}
                color={getBadgeColor(user.badge)}
              />
            </View>

            <Image source={user.avatar} style={styles.topThreeAvatar} />

            <Text
              style={[
                styles.topThreeRank,
                {
                  color: getBadgeColor(user.badge),
                },
              ]}
            >
              {user.rank}
            </Text>

            <Text
              style={[
                styles.topThreeName,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              {user.name.split(' ')[0]}
            </Text>

            <Text
              style={[
                styles.topThreePoints,
                {
                  color: isDark ? COLORS.gray : COLORS.greyscale600,
                },
              ]}
            >
              {user.points} pts
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const otherUsers = MOCK_LEADERBOARD.slice(3);

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

      <FlatList
        data={otherUsers}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {renderUserStats()}
            {renderCategoryTabs()}
            {renderTopThree()}
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  userStatsCard: {
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding * 2,
  },
  userStatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SIZES.padding2,
  },
  userStatsInfo: {
    alignItems: 'center',
  },
  userStatsRank: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  userStatsRankValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  userStatsLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  userStatsValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  userStatsDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.greyscale300,
  },
  userStatsLevel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: SIZES.padding2,
    marginBottom: SIZES.padding * 2,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: SIZES.padding,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.greyscale200,
  },
  categoryTabActive: {
    borderColor: COLORS.primary,
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: SIZES.padding * 2,
    height: 240,
  },
  topThreeCard: {
    width: '30%',
    paddingVertical: SIZES.padding2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.padding2,
  },
  topThreeBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding2,
  },
  topThreeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: SIZES.padding,
  },
  topThreeRank: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  topThreeName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  topThreePoints: {
    fontSize: 11,
    fontWeight: '600',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding,
    borderWidth: 1,
  },
  rankSection: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  userSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.padding2,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  userLevel: {
    fontSize: 11,
    fontWeight: '500',
  },
  pointsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.padding2,
  },
  pointsInfo: {
    alignItems: 'flex-end',
  },
  pointsLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  pointsValue: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default LeaderboardScreen;
