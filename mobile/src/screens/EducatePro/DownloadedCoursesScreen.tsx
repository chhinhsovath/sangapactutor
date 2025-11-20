/**
 * DownloadedCoursesScreen Component (Phase 5 - Tier 4)
 * Offline content and downloaded courses
 * Adapted from EducatePro template
 *
 * Features:
 * - Downloaded courses list
 * - Storage usage tracking
 * - Delete downloaded content
 * - Offline playback
 * - Download progress
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
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { Button } from '../../components/EducatePro';

interface DownloadedCourse {
  id: string;
  name: string;
  category: string;
  totalSize: string;
  downloadedSize: string;
  progress: number;
  lastAccessed: string;
  lessons: number;
}

interface DownloadedCoursesScreenProps {
  navigation: any;
}

const MOCK_DOWNLOADED_COURSES: DownloadedCourse[] = [
  {
    id: '1',
    name: 'Advanced React Patterns',
    category: 'Web Development',
    totalSize: '2.5 GB',
    downloadedSize: '2.5 GB',
    progress: 100,
    lastAccessed: '2025-01-15',
    lessons: 45,
  },
  {
    id: '2',
    name: 'Mobile App Development',
    category: 'Mobile',
    totalSize: '1.8 GB',
    downloadedSize: '1.2 GB',
    progress: 67,
    lastAccessed: '2025-01-10',
    lessons: 38,
  },
  {
    id: '3',
    name: 'UI/UX Design Masterclass',
    category: 'Design',
    totalSize: '3.2 GB',
    downloadedSize: '3.2 GB',
    progress: 100,
    lastAccessed: '2025-01-20',
    lessons: 52,
  },
];

const DownloadedCoursesScreen = ({ navigation }: DownloadedCoursesScreenProps) => {
  const [isDark] = useState(false);
  const [downloadedCourses, setDownloadedCourses] = useState(MOCK_DOWNLOADED_COURSES);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'downloading' | 'completed'>('all');

  /**
   * Calculate total storage usage
   */
  const calculateTotalStorage = () => {
    return downloadedCourses.reduce((total, course) => {
      const size = parseFloat(course.downloadedSize);
      return total + size;
    }, 0);
  };

  /**
   * Handle delete course
   */
  const handleDeleteCourse = (id: string) => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to delete this downloaded course?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDownloadedCourses(downloadedCourses.filter((c) => c.id !== id));
          },
        },
      ]
    );
  };

  /**
   * Filter courses based on selected filter
   */
  const getFilteredCourses = () => {
    if (selectedFilter === 'downloading') {
      return downloadedCourses.filter((c) => c.progress < 100);
    } else if (selectedFilter === 'completed') {
      return downloadedCourses.filter((c) => c.progress === 100);
    }
    return downloadedCourses;
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
        Downloaded Courses
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );

  /**
   * Render storage info
   */
  const renderStorageInfo = () => (
    <View
      style={[
        styles.storageCard,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
        },
      ]}
    >
      <View style={styles.storageHeader}>
        <View>
          <Text
            style={[
              styles.storageLabel,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Storage Used
          </Text>
          <Text style={styles.storageTotalSize}>
            {calculateTotalStorage().toFixed(1)} GB
          </Text>
        </View>

        <MaterialCommunityIcons
          name="database"
          size={40}
          color={COLORS.primary}
        />
      </View>

      <View
        style={[
          styles.storageBar,
          {
            backgroundColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
          },
        ]}
      >
        <View
          style={[
            styles.storageUsed,
            {
              width: '70%',
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.storageCapacity,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        7.0 GB of 10.0 GB used
      </Text>
    </View>
  );

  /**
   * Render filter tabs
   */
  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      {(['all', 'downloading', 'completed'] as const).map((filter) => (
        <TouchableOpacity
          key={filter}
          onPress={() => setSelectedFilter(filter)}
          style={[
            styles.filterTab,
            selectedFilter === filter && styles.filterTabActive,
            {
              backgroundColor: selectedFilter === filter ? COLORS.primary : 'transparent',
            },
          ]}
        >
          <Text
            style={[
              styles.filterTabText,
              {
                color: selectedFilter === filter ? COLORS.white : COLORS.greyscale600,
              },
            ]}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
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
        name="cloud-download-outline"
        size={64}
        color={COLORS.greyscale300}
      />
      <Text
        style={[
          styles.emptyTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        No Downloaded Courses
      </Text>
      <Text
        style={[
          styles.emptySubtitle,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        Download courses to access them offline
      </Text>
    </View>
  );

  /**
   * Render course item
   */
  const renderCourseItem = ({ item }: { item: DownloadedCourse }) => (
    <View
      style={[
        styles.courseCard,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.white,
          borderColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
        },
      ]}
    >
      <View style={styles.courseHeader}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.courseName,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            {item.name}
          </Text>
          <Text
            style={[
              styles.courseCategory,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            {item.category} • {item.lessons} lessons
          </Text>
        </View>

        <TouchableOpacity onPress={() => handleDeleteCourse(item.id)}>
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={20}
            color={COLORS.red}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.progressSection}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${item.progress}%`,
              },
            ]}
          />
        </View>
        <Text
          style={[
            styles.progressText,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          {item.progress}%
        </Text>
      </View>

      <View style={styles.sizeInfo}>
        <Text
          style={[
            styles.sizeLabel,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          {item.downloadedSize} / {item.totalSize}
        </Text>
        <Text
          style={[
            styles.sizeLabel,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          Last accessed: {item.lastAccessed}
        </Text>
      </View>

      <Button
        title="Watch Offline"
        onPress={() => navigation.navigate('LessonScreen', { courseId: item.id })}
        filled
        style={{ marginTop: SIZES.padding2 }}
      />
    </View>
  );

  const filteredCourses = getFilteredCourses();

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
        data={filteredCourses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {renderStorageInfo()}
            {renderFilterTabs()}
          </>
        }
        ListEmptyComponent={renderEmptyState()}
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
  storageCard: {
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding * 2,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding2,
  },
  storageLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  storageTotalSize: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  storageBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SIZES.padding2,
  },
  storageUsed: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  storageCapacity: {
    fontSize: 11,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: SIZES.padding2,
    marginBottom: SIZES.padding * 2,
  },
  filterTab: {
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.base,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.greyscale200,
  },
  filterTabActive: {
    borderColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  courseCard: {
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding,
    borderWidth: 1,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding2,
  },
  courseName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  courseCategory: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.padding2,
    marginBottom: SIZES.padding2,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    minWidth: 30,
  },
  sizeInfo: {
    marginBottom: SIZES.padding2,
  },
  sizeLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: SIZES.padding,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: SIZES.padding,
    textAlign: 'center',
  },
});

export default DownloadedCoursesScreen;
