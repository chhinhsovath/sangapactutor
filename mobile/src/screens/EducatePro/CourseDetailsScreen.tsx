/**
 * CourseDetailsScreen Component (Phase 5)
 * Course/lesson details with tabbed lessons, reviews, and instructor info
 * Adapted from EducatePro template
 *
 * Features:
 * - Course header with back button
 * - Lesson list with progress tracking
 * - Tab navigation (Lessons, Reviews, Instructor)
 * - Enrollment CTA button
 * - Course completion modal
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
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { EDUCATEPRO_ICONS, EDUCATEPRO_ILLUSTRATIONS } from '../../constants';
import { Button, ReviewCard, MentorCard } from '../../components/EducatePro';

interface Lesson {
  id: string;
  number: string;
  title: string;
  duration: string;
  isCompleted: boolean;
}

interface CourseDetailsScreenProps {
  navigation: any;
  route?: any;
}

const MOCK_LESSONS: Lesson[] = [
  {
    id: '1',
    number: '01',
    title: 'Why using Figma',
    duration: '10 mins',
    isCompleted: true,
  },
  {
    id: '2',
    number: '02',
    title: 'Set up Your Figma Account',
    duration: '5 mins',
    isCompleted: true,
  },
  {
    id: '3',
    number: '03',
    title: 'Take a look Figma interface',
    duration: '5 mins',
    isCompleted: true,
  },
  {
    id: '4',
    number: '04',
    title: 'Working with Frame & Layer',
    duration: '10 mins',
    isCompleted: false,
  },
  {
    id: '5',
    number: '05',
    title: 'Working with Text & Grid',
    duration: '10 mins',
    isCompleted: false,
  },
  {
    id: '6',
    number: '06',
    title: 'Using Figma Plugins',
    duration: '7 mins',
    isCompleted: false,
  },
];

const MOCK_REVIEWS = [
  {
    id: '1',
    avatar: require('../../../assets/icon.png'),
    name: 'Sarah Johnson',
    rating: '5',
    description: 'Great course! Very well explained and easy to follow.',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    numLikes: '42',
  },
  {
    id: '2',
    avatar: require('../../../assets/icon.png'),
    name: 'Mike Chen',
    rating: '4',
    description: 'Good content but could use more practical examples.',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    numLikes: '28',
  },
];

const MOCK_INSTRUCTOR = {
  id: '1',
  firstName: 'Emily',
  avatar: require('../../../assets/icon.png'),
  position: 'Senior UX Designer',
};

const CourseDetailsScreen = ({
  navigation,
  route,
}: CourseDetailsScreenProps) => {
  const [activeTab, setActiveTab] = useState('lessons');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState('');
  const [isDark] = useState(false);

  /**
   * Handle enrollment
   */
  const handleEnroll = () => {
    Alert.alert('Success', 'You have been enrolled in this course!', [
      {
        text: 'OK',
        onPress: () => setIsEnrolled(true),
      },
    ]);
  };

  /**
   * Handle lesson completion review
   */
  const handleSubmitReview = () => {
    if (review.trim().length === 0) {
      Alert.alert('Error', 'Please write a review before submitting');
      return;
    }

    Alert.alert('Success', 'Review submitted successfully!', [
      {
        text: 'OK',
        onPress: () => {
          setReview('');
          setShowReviewModal(false);
          navigation.goBack();
        },
      },
    ]);
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
          numberOfLines={1}
        >
          Intro to UI/UX Design
        </Text>
      </View>

      <TouchableOpacity activeOpacity={0.7}>
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color={isDark ? COLORS.white : COLORS.greyscale900}
        />
      </TouchableOpacity>
    </View>
  );

  /**
   * Render lesson item
   */
  const renderLessonItem = ({ item }: { item: Lesson }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('CourseVideoPlay')}
      activeOpacity={0.7}
      style={[
        styles.lessonCard,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
        },
      ]}
    >
      <View style={styles.lessonLeftContainer}>
        <View
          style={[
            styles.lessonNumber,
            {
              backgroundColor: item.isCompleted
                ? COLORS.success
                : COLORS.primary,
            },
          ]}
        >
          {item.isCompleted ? (
            <MaterialCommunityIcons
              name="check"
              size={16}
              color={COLORS.white}
            />
          ) : (
            <Text style={styles.lessonNumberText}>{item.number}</Text>
          )}
        </View>

        <View style={styles.lessonInfo}>
          <Text
            style={[
              styles.lessonTitle,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.lessonDuration,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            {item.duration}
          </Text>
        </View>
      </View>

      <MaterialCommunityIcons
        name="play-circle-outline"
        size={24}
        color={COLORS.primary}
      />
    </TouchableOpacity>
  );

  /**
   * Render lessons tab
   */
  const renderLessonsTab = () => (
    <FlatList
      data={MOCK_LESSONS}
      renderItem={renderLessonItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      contentContainerStyle={styles.lessonsList}
    />
  );

  /**
   * Render reviews tab
   */
  const renderReviewsTab = () => (
    <View style={styles.reviewsTab}>
      {MOCK_REVIEWS.map((item) => (
        <ReviewCard
          key={item.id}
          avatar={item.avatar}
          name={item.name}
          description={item.description}
          avgRating={item.rating}
          date={item.date}
          numLikes={item.numLikes}
          onLikePress={() => {}}
          isDark={isDark}
        />
      ))}
    </View>
  );

  /**
   * Render instructor tab
   */
  const renderInstructorTab = () => (
    <View style={styles.instructorTab}>
      <MentorCard
        avatar={MOCK_INSTRUCTOR.avatar}
        fullName={MOCK_INSTRUCTOR.firstName}
        position={MOCK_INSTRUCTOR.position}
        onPress={() => navigation.navigate('MentorProfile')}
        onMessagePress={() => navigation.navigate('Chat')}
        isDark={isDark}
      />

      <View
        style={[
          styles.instructorBio,
          {
            backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
            borderColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
          },
        ]}
      >
        <Text
          style={[
            styles.bioTitle,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          About the Instructor
        </Text>
        <Text
          style={[
            styles.bioText,
            {
              color: isDark ? COLORS.secondaryWhite : COLORS.greyscale600,
            },
          ]}
        >
          Emily is a Senior UX Designer with 10+ years of experience. She has
          worked with leading companies to create intuitive and beautiful user
          interfaces.
        </Text>
      </View>
    </View>
  );

  /**
   * Render review completion modal
   */
  const renderReviewModal = () => (
    <Modal
      transparent
      animationType="slide"
      visible={showReviewModal}
      onRequestClose={() => setShowReviewModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowReviewModal(false)}>
        <View
          style={[
            styles.modalOverlay,
            {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
          ]}
        >
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: isDark ? COLORS.dark2 : COLORS.white,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color: isDark ? COLORS.white : COLORS.primary,
                    },
                  ]}
                >
                  Course Completed!
                </Text>
              </View>

              <Image
                source={EDUCATEPRO_ILLUSTRATIONS.success}
                style={styles.modalIllustration}
                resizeMode="contain"
              />

              <Text
                style={[
                  styles.modalSubtitle,
                  {
                    color: isDark ? COLORS.secondaryWhite : COLORS.black,
                  },
                ]}
              >
                Please leave a review for this course
              </Text>

              <TextInput
                placeholder="Share your experience..."
                placeholderTextColor={isDark ? COLORS.gray : COLORS.greyscale600}
                value={review}
                onChangeText={setReview}
                multiline
                numberOfLines={4}
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: isDark ? COLORS.dark1 : COLORS.greyscale100,
                    borderColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
                    color: isDark ? COLORS.white : COLORS.black,
                  },
                ]}
              />

              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setShowReviewModal(false)}
                  filled={false}
                  color={COLORS.greyscale200}
                  textColor={isDark ? COLORS.white : COLORS.black}
                />

                <Button
                  title="Submit Review"
                  onPress={handleSubmitReview}
                  filled
                  style={{ marginLeft: SIZES.padding }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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
        contentContainerStyle={{
          paddingHorizontal: SIZES.padding,
        }}
      >
        {/* Tab Navigation */}
        <View style={styles.tabBar}>
          {['lessons', 'reviews', 'instructor'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton,
                {
                  borderBottomColor:
                    activeTab === tab ? COLORS.primary : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color:
                      activeTab === tab ? COLORS.primary : COLORS.greyscale600,
                  },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'lessons' && renderLessonsTab()}
        {activeTab === 'reviews' && renderReviewsTab()}
        {activeTab === 'instructor' && renderInstructorTab()}
      </ScrollView>

      {/* Bottom Action Button */}
      <View
        style={[
          styles.bottomAction,
          {
            backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
            borderTopColor: isDark ? COLORS.dark2 : COLORS.greyscale200,
          },
        ]}
      >
        <Button
          title={isEnrolled ? 'Continue Course' : 'Enroll Now'}
          onPress={isEnrolled ? () => setShowReviewModal(true) : handleEnroll}
          filled
        />
      </View>

      {renderReviewModal()}
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
    fontSize: 18,
    fontWeight: '700',
    marginLeft: SIZES.padding2,
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    marginVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale200,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SIZES.padding2,
    borderBottomWidth: 3,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  lessonsList: {
    paddingBottom: SIZES.padding,
  },
  lessonCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.padding,
    marginVertical: SIZES.base,
    borderRadius: 12,
  },
  lessonLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding2,
  },
  lessonNumberText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 12,
    fontWeight: '500',
  },
  reviewsTab: {
    paddingVertical: SIZES.padding,
  },
  instructorTab: {
    paddingVertical: SIZES.padding,
  },
  instructorBio: {
    padding: SIZES.padding2,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SIZES.padding,
  },
  bioText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  bottomAction: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderTopWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SIZES.width * 0.9,
    borderRadius: 24,
    padding: SIZES.padding,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  modalIllustration: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginVertical: SIZES.padding,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  modalInput: {
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.padding2,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: SIZES.padding,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
  },
});

export default CourseDetailsScreen;
