/**
 * MentorScheduleScreen Component (Phase 5 - Tier 4)
 * Book mentor sessions/appointments
 * Adapted from EducatePro template
 *
 * Features:
 * - Calendar view
 * - Available time slots
 * - Book session
 * - Session details
 * - Pricing
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

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface MentorScheduleScreenProps {
  navigation: any;
}

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TIME_SLOTS: TimeSlot[] = [
  { id: '1', time: '09:00 AM', available: true },
  { id: '2', time: '10:00 AM', available: false },
  { id: '3', time: '11:00 AM', available: true },
  { id: '4', time: '12:00 PM', available: true },
  { id: '5', time: '02:00 PM', available: true },
  { id: '6', time: '03:00 PM', available: false },
  { id: '7', time: '04:00 PM', available: true },
  { id: '8', time: '05:00 PM', available: true },
];

const MentorScheduleScreen = ({ navigation }: MentorScheduleScreenProps) => {
  const [isDark] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState('30');

  /**
   * Handle book session
   */
  const handleBookSession = () => {
    if (!selectedSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    Alert.alert('Success', 'Session booked successfully!', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  /**
   * Calculate price
   */
  const calculatePrice = () => {
    const hourlyRate = 50;
    const durationHours = parseInt(sessionDuration) / 60;
    return (hourlyRate * durationHours).toFixed(2);
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
        Book Session
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );

  /**
   * Render mentor info
   */
  const renderMentorInfo = () => (
    <View
      style={[
        styles.mentorCard,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
        },
      ]}
    >
      <View style={styles.mentorHeader}>
        <View
          style={[styles.avatar, { backgroundColor: COLORS.primary + '20' }]}
        >
          <Text style={styles.avatarText}>SJ</Text>
        </View>

        <View style={{ flex: 1, marginLeft: SIZES.padding2 }}>
          <Text
            style={[
              styles.mentorName,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Sarah Johnson
          </Text>
          <Text
            style={[
              styles.mentorRole,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            Senior UI Designer
          </Text>
        </View>

        <View style={styles.rating}>
          <MaterialCommunityIcons
            name="star"
            size={16}
            color={COLORS.primary}
          />
          <Text
            style={[
              styles.ratingText,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            4.8
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.priceRow,
          {
            borderTopColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
          },
        ]}
      >
        <Text
          style={[
            styles.priceLabel,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          $50/hour
        </Text>
      </View>
    </View>
  );

  /**
   * Render week days
   */
  const renderWeekDays = () => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Select Date
      </Text>

      <View style={styles.daysContainer}>
        {WEEK_DAYS.map((day, index) => (
          <TouchableOpacity
            key={day}
            onPress={() => setSelectedDay(index)}
            style={[
              styles.dayButton,
              selectedDay === index && styles.dayButtonActive,
              {
                backgroundColor:
                  selectedDay === index ? COLORS.primary : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                styles.dayText,
                {
                  color:
                    selectedDay === index ? COLORS.white : COLORS.greyscale600,
                },
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  /**
   * Render time slots
   */
  const renderTimeSlots = () => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Available Times
      </Text>

      <View style={styles.slotsGrid}>
        {TIME_SLOTS.map((slot) => (
          <TouchableOpacity
            key={slot.id}
            onPress={() => slot.available && setSelectedSlot(slot.id)}
            disabled={!slot.available}
            style={[
              styles.slotButton,
              {
                backgroundColor: selectedSlot === slot.id
                  ? COLORS.primary
                  : slot.available
                  ? isDark
                    ? COLORS.dark2
                    : COLORS.greyscale50
                  : COLORS.greyscale200,
              },
            ]}
          >
            <Text
              style={[
                styles.slotText,
                {
                  color:
                    selectedSlot === slot.id
                      ? COLORS.white
                      : slot.available
                      ? isDark
                        ? COLORS.white
                        : COLORS.black
                      : COLORS.gray,
                },
              ]}
            >
              {slot.time}
            </Text>
            {!slot.available && (
              <Text
                style={[
                  styles.unavailableText,
                  { color: COLORS.gray },
                ]}
              >
                Booked
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  /**
   * Render duration and price
   */
  const renderDurationAndPrice = () => (
    <View style={styles.section}>
      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
          },
        ]}
      >
        <View style={styles.summaryRow}>
          <Text
            style={[
              styles.summaryLabel,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Duration
          </Text>
          <Text
            style={[
              styles.summaryValue,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            {sessionDuration} minutes
          </Text>
        </View>

        <View
          style={[
            styles.summaryDivider,
            {
              backgroundColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
            },
          ]}
        />

        <View style={styles.summaryRow}>
          <Text
            style={[
              styles.summaryLabel,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Total Price
          </Text>
          <Text style={[styles.summaryPrice]}>
            ${calculatePrice()}
          </Text>
        </View>
      </View>
    </View>
  );

  /**
   * Render action button
   */
  const renderActions = () => (
    <View style={styles.actionSection}>
      <Button
        title="Confirm Booking"
        onPress={handleBookSession}
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
      {renderHeader()}

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderMentorInfo()}
        {renderWeekDays()}
        {renderTimeSlots()}
        {renderDurationAndPrice()}
        {renderActions()}
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
  mentorCard: {
    margin: SIZES.padding,
    padding: SIZES.padding2,
    borderRadius: 12,
  },
  mentorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  mentorName: {
    fontSize: 14,
    fontWeight: '700',
  },
  mentorRole: {
    fontSize: 12,
    fontWeight: '500',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  priceRow: {
    paddingTop: SIZES.padding2,
    borderTopWidth: 1,
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: '700',
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
  daysContainer: {
    flexDirection: 'row',
    gap: SIZES.base,
  },
  dayButton: {
    flex: 1,
    paddingVertical: SIZES.padding,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.greyscale200,
  },
  dayButtonActive: {
    borderColor: COLORS.primary,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '700',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.padding2,
  },
  slotButton: {
    width: '23.5%',
    paddingVertical: SIZES.padding,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.greyscale200,
  },
  slotText: {
    fontSize: 11,
    fontWeight: '700',
  },
  unavailableText: {
    fontSize: 8,
    fontWeight: '600',
    marginTop: 2,
  },
  summaryCard: {
    padding: SIZES.padding2,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.padding2,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionSection: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
});

export default MentorScheduleScreen;
