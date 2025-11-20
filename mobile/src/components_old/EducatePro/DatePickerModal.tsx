/**
 * DatePickerModal Component
 * Modal for date selection with calendar picker
 *
 * Usage:
 * <DatePickerModal
 *   isOpen={showDatePicker}
 *   onClose={() => setShowDatePicker(false)}
 *   onDateChange={(date) => setSelectedDate(date)}
 *   selectedDate={selectedDate}
 *  isDark={isDark}
 * />
 */

import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  DatePickerIOS,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateChange: (date: string) => void;
  selectedDate?: string;
  minimumDate?: string;
  maximumDate?: string;
  isDark?: boolean;
  mode?: 'date' | 'datetime' | 'time';
}

const DatePickerModal = ({
  isOpen,
  onClose,
  onDateChange,
  selectedDate = new Date().toISOString().split('T')[0],
  minimumDate,
  maximumDate,
  isDark = false,
  mode = 'date',
}: DatePickerModalProps) => {
  const [date, setDate] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    onDateChange(newDate.toISOString().split('T')[0]);
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={isOpen}
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
          },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.closeText,
                {
                  color: COLORS.primary,
                },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.title,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Select Date
          </Text>

          <TouchableOpacity
            onPress={onClose}
            style={styles.confirmButton}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.confirmText,
                {
                  color: COLORS.primary,
                },
              ]}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.pickerContainer,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.white,
            },
          ]}
        >
          <DatePickerIOS
            date={date}
            onDateChange={handleDateChange}
            mode={mode === 'time' ? 'time' : mode === 'datetime' ? 'datetime' : 'date'}
            minuteInterval={30}
            textColor={isDark ? COLORS.white : COLORS.black}
          />
        </View>
      </SafeAreaView>
    </Modal>
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
    borderBottomColor: COLORS.greyscale200,
  },
  closeButton: {
    padding: SIZES.base,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  confirmButton: {
    padding: SIZES.base,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default DatePickerModal;
