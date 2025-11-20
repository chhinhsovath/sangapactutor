/**
 * LessonScreen Component (Phase 5 - Tier 4)
 * Watch lesson videos with progress tracking
 * Adapted from EducatePro template
 *
 * Features:
 * - Video player interface
 * - Lesson progress tracking
 * - Lesson transcript
 * - Resources section
 * - Mark as complete
 * - Next lesson navigation
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
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { Button } from '../../components/EducatePro';

interface LessonScreenProps {
  navigation: any;
  route?: any;
}

const LESSON_DATA = {
  courseTitle: 'Advanced React Patterns',
  lessonNumber: '05',
  lessonTitle: 'Custom Hooks & Composition',
  duration: '28:45',
  progress: 75,
  instructor: 'John Smith',
  description:
    'Learn how to create custom hooks and leverage composition patterns to build more reusable and maintainable React components.',
  resources: [
    { id: '1', name: 'React Hooks Documentation', type: 'link' },
    { id: '2', name: 'Custom Hooks Example.zip', type: 'file' },
    { id: '3', name: 'Best Practices.pdf', type: 'pdf' },
  ],
  transcript:
    'In this lesson, we\'ll explore custom hooks which are a powerful feature in React. Custom hooks allow you to extract component logic into reusable functions...',
};

const LessonScreen = ({ navigation, route }: LessonScreenProps) => {
  const [isDark] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState('12:34');
  const [showTranscript, setShowTranscript] = useState(false);

  /**
   * Render video player section
   */
  const renderVideoPlayer = () => (
    <View
      style={[
        styles.videoContainer,
        {
          backgroundColor: COLORS.black,
        },
      ]}
    >
      <View style={styles.videoPlaceholder}>
        <MaterialCommunityIcons
          name="play-circle-outline"
          size={64}
          color={COLORS.white}
        />
        <Text style={styles.videoText}>Video Player</Text>
        <Text style={styles.videoDuration}>{LESSON_DATA.duration}</Text>
      </View>

      <View style={styles.playerControls}>
        <TouchableOpacity
          onPress={() => setIsPlaying(!isPlaying)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={40}
            color={COLORS.white}
          />
        </TouchableOpacity>

        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
          <View style={styles.progressHandle} />
        </View>

        <Text style={styles.timeText}>{currentTime}</Text>

        <TouchableOpacity activeOpacity={0.7} style={styles.fullscreenBtn}>
          <MaterialCommunityIcons
            name="fullscreen"
            size={24}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.progressIndicator}>
        <View style={styles.progressBarSmall}>
          <View
            style={[
              styles.progressFillSmall,
              { width: `${LESSON_DATA.progress}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{LESSON_DATA.progress}%</Text>
      </View>
    </View>
  );

  /**
   * Render lesson header
   */
  const renderLessonHeader = () => (
    <View
      style={[
        styles.headerSection,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
        },
      ]}
    >
      <View style={styles.lessonBadge}>
        <Text style={styles.lessonNumber}>Lesson {LESSON_DATA.lessonNumber}</Text>
      </View>

      <Text
        style={[
          styles.lessonTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        {LESSON_DATA.lessonTitle}
      </Text>

      <Text
        style={[
          styles.instructorName,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        by {LESSON_DATA.instructor}
      </Text>

      <Text
        style={[
          styles.description,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        {LESSON_DATA.description}
      </Text>
    </View>
  );

  /**
   * Render resources section
   */
  const renderResources = () => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Resources
      </Text>

      {LESSON_DATA.resources.map((resource) => (
        <TouchableOpacity
          key={resource.id}
          style={[
            styles.resourceItem,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={
              resource.type === 'link'
                ? 'link'
                : resource.type === 'pdf'
                ? 'file-pdf-box'
                : 'file-zip-box'
            }
            size={24}
            color={COLORS.primary}
          />

          <View style={{ flex: 1, marginLeft: SIZES.padding2 }}>
            <Text
              style={[
                styles.resourceName,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              {resource.name}
            </Text>
            <Text
              style={[
                styles.resourceType,
                {
                  color: isDark ? COLORS.gray : COLORS.greyscale600,
                },
              ]}
            >
              {resource.type.toUpperCase()}
            </Text>
          </View>

          <MaterialCommunityIcons
            name="download"
            size={20}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  /**
   * Render tabs
   */
  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        onPress={() => setShowTranscript(false)}
        style={[styles.tab, !showTranscript && styles.tabActive]}
      >
        <Text
          style={[
            styles.tabText,
            {
              color: !showTranscript ? COLORS.primary : COLORS.greyscale600,
            },
          ]}
        >
          Overview
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowTranscript(true)}
        style={[styles.tab, showTranscript && styles.tabActive]}
      >
        <Text
          style={[
            styles.tabText,
            {
              color: showTranscript ? COLORS.primary : COLORS.greyscale600,
            },
          ]}
        >
          Transcript
        </Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render transcript
   */
  const renderTranscript = () => (
    <View style={styles.section}>
      <Text
        style={[
          styles.transcriptText,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        {LESSON_DATA.transcript}
      </Text>
    </View>
  );

  /**
   * Render action buttons
   */
  const renderActions = () => (
    <View style={styles.actionSection}>
      <Button
        title={isCompleted ? 'Completed ✓' : 'Mark as Complete'}
        onPress={() => {
          setIsCompleted(!isCompleted);
          Alert.alert('Success', 'Lesson marked as complete!');
        }}
        filled={isCompleted}
        color={isCompleted ? COLORS.primary : COLORS.greyscale200}
        textColor={isCompleted ? COLORS.white : COLORS.black}
        style={{ marginBottom: SIZES.padding2 }}
      />

      <Button
        title="Next Lesson"
        onPress={() => navigation.goBack()}
        filled
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderVideoPlayer()}
        {renderLessonHeader()}
        {renderTabs()}

        {showTranscript ? renderTranscript() : renderResources()}

        {renderActions()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SIZES.padding,
  },
  videoPlaceholder: {
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  videoText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginTop: SIZES.padding2,
  },
  videoDuration: {
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 4,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.gray,
    borderRadius: 2,
    marginHorizontal: SIZES.padding2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    width: '40%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressHandle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    top: -4,
    left: '40%',
  },
  timeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
    marginHorizontal: SIZES.base,
  },
  fullscreenBtn: {
    padding: SIZES.base,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    gap: SIZES.padding2,
  },
  progressBarSmall: {
    flex: 1,
    height: 3,
    backgroundColor: COLORS.gray,
    borderRadius: 2,
  },
  progressFillSmall: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
  headerSection: {
    padding: SIZES.padding,
    borderRadius: 12,
    margin: SIZES.padding,
  },
  lessonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding2,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: SIZES.padding2,
  },
  lessonNumber: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: SIZES.padding2,
  },
  description: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale200,
    paddingHorizontal: SIZES.padding,
  },
  tab: {
    paddingVertical: SIZES.padding2,
    marginRight: SIZES.padding * 2,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SIZES.padding2,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding2,
  },
  resourceName: {
    fontSize: 13,
    fontWeight: '600',
  },
  resourceType: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  transcriptText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 22,
  },
  actionSection: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
});

export default LessonScreen;
