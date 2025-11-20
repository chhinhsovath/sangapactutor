/**
 * AssignmentScreen Component (Phase 5 - Tier 4)
 * View and submit assignments
 * Adapted from EducatePro template
 *
 * Features:
 * - Assignment details
 * - Due date tracking
 * - File upload
 * - Submission history
 * - Grading status
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

interface AssignmentScreenProps {
  navigation: any;
}

const AssignmentScreen = ({ navigation }: AssignmentScreenProps) => {
  const [isDark] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const assignmentData = {
    title: 'Build a React Component Library',
    description:
      'Create a reusable component library with at least 5 components. Each component should have proper TypeScript types and comprehensive documentation.',
    dueDate: '2025-02-15',
    points: 100,
    status: 'Not Submitted',
  };

  /**
   * Handle file selection
   */
  const handleSelectFile = () => {
    Alert.alert('Select File', 'Choose file from gallery or take a new one', [
      { text: 'Gallery', onPress: () => setSelectedFile('assignment.zip') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  /**
   * Handle submit
   */
  const handleSubmit = () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file to submit');
      return;
    }

    Alert.alert('Success', 'Assignment submitted successfully!', [
      {
        text: 'OK',
        onPress: () => {
          setIsSubmitted(true);
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
        Assignment
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );

  /**
   * Render info card
   */
  const renderInfoCard = () => (
    <View
      style={[
        styles.infoCard,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
        },
      ]}
    >
      <Text
        style={[
          styles.assignmentTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        {assignmentData.title}
      </Text>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="calendar"
          size={18}
          color={COLORS.primary}
        />
        <Text
          style={[
            styles.infoText,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          Due: {assignmentData.dueDate}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="star"
          size={18}
          color={COLORS.primary}
        />
        <Text
          style={[
            styles.infoText,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          Points: {assignmentData.points}
        </Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: isSubmitted ? COLORS.primary + '20' : COLORS.red + '20',
          },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            {
              color: isSubmitted ? COLORS.primary : COLORS.red,
            },
          ]}
        >
          {isSubmitted ? 'Submitted ✓' : 'Not Submitted'}
        </Text>
      </View>
    </View>
  );

  /**
   * Render description
   */
  const renderDescription = () => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Description
      </Text>

      <Text
        style={[
          styles.description,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        {assignmentData.description}
      </Text>
    </View>
  );

  /**
   * Render file upload
   */
  const renderFileUpload = () => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Submit Assignment
      </Text>

      {selectedFile ? (
        <View
          style={[
            styles.fileSelected,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="file-check"
            size={32}
            color={COLORS.primary}
          />
          <Text
            style={[
              styles.fileName,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            {selectedFile}
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedFile(null)}
            style={styles.removeFile}
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={24}
              color={COLORS.red}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleSelectFile}
          style={[
            styles.uploadBox,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="cloud-upload-outline"
            size={40}
            color={COLORS.primary}
          />
          <Text
            style={[
              styles.uploadText,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Select File to Upload
          </Text>
          <Text
            style={[
              styles.uploadHint,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            Maximum file size: 100MB
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  /**
   * Render action buttons
   */
  const renderActions = () => (
    <View style={styles.actionSection}>
      {!isSubmitted && (
        <Button
          title="Submit Assignment"
          onPress={handleSubmit}
          filled
          disabled={!selectedFile}
          style={{ marginBottom: SIZES.padding2 }}
        />
      )}

      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
        filled={false}
        color={COLORS.greyscale200}
        textColor={isDark ? COLORS.white : COLORS.black}
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
        {renderInfoCard()}
        {renderDescription()}
        {!isSubmitted && renderFileUpload()}
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
  infoCard: {
    margin: SIZES.padding,
    padding: SIZES.padding2,
    borderRadius: 12,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SIZES.padding,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding2,
    gap: SIZES.padding2,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.base,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: SIZES.padding,
  },
  statusText: {
    fontSize: 12,
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
  description: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  uploadBox: {
    padding: SIZES.padding * 2,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: SIZES.padding,
  },
  uploadHint: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  fileSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: SIZES.padding2,
    flex: 1,
  },
  removeFile: {
    padding: SIZES.base,
  },
  actionSection: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
});

export default AssignmentScreen;
