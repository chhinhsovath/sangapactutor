import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, DatePickerIOS, SafeAreaView } from 'react-native';
import { COLORS } from '../constants';

const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const DatePickerModal = ({
  open,
  startDate,
  selectedDate,
  onClose,
  onChangeStartDate,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState(selectedDate);

  const handleDateChange = (date) => {
    setSelectedStartDate(date);
    onChangeStartDate(date);
  };

  const handleOnPressStartDate = () => {
    onClose();
  };

  const modalVisible = open;

  const dateObj = selectedStartDate ? new Date(selectedStartDate) : new Date();

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Select Date</Text>
          </View>
          <DatePickerIOS
            date={dateObj}
            onDateChange={handleDateChange}
            mode="date"
            display="spinner"
          />
          <TouchableOpacity style={styles.closeButton} onPress={handleOnPressStartDate}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 20,
    padding: 0,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    width: "100%",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  headerText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    width: "100%",
    padding: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});


export default DatePickerModal;