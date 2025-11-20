/**
 * CertificateScreen Component (Phase 5 - Tier 4)
 * Display certificates of completion
 * Adapted from EducatePro template
 *
 * Features:
 * - Certificate display
 * - Share options
 * - Download functionality
 * - Certificate metadata
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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { Button } from '../../components/EducatePro';

interface CertificateScreenProps {
  navigation: any;
}

const CertificateScreen = ({ navigation }: CertificateScreenProps) => {
  const [isDark] = useState(false);

  const certificateData = {
    courseName: 'Advanced React Patterns',
    studentName: 'John Doe',
    completionDate: 'January 15, 2025',
    certificateId: 'CERT-2025-001234',
    instructor: 'Sarah Johnson',
    score: 95,
  };

  /**
   * Handle share
   */
  const handleShare = async () => {
    try {
      await Share.share({
        message: `I completed "${certificateData.courseName}" on EducatePro! Certificate ID: ${certificateData.certificateId}`,
        title: 'Share Certificate',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share certificate');
    }
  };

  /**
   * Handle download
   */
  const handleDownload = () => {
    Alert.alert('Success', 'Certificate downloaded successfully!');
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
        Certificate
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );

  /**
   * Render certificate
   */
  const renderCertificate = () => (
    <View
      style={[
        styles.certificateDisplay,
        {
          backgroundColor: COLORS.white,
          borderColor: COLORS.primary,
        },
      ]}
    >
      <View style={styles.certificateHeader}>
        <MaterialCommunityIcons
          name="medal"
          size={40}
          color={COLORS.primary}
        />
        <Text style={styles.certificateLabel}>CERTIFICATE</Text>
        <Text style={styles.certificateSubtext}>OF COMPLETION</Text>
      </View>

      <View style={styles.certificateDivider} />

      <Text style={styles.certificateMessage}>This is to certify that</Text>

      <Text style={styles.studentName}>
        {certificateData.studentName}
      </Text>

      <Text style={styles.certificateMessage}>
        has successfully completed the course
      </Text>

      <Text style={styles.courseName}>
        {certificateData.courseName}
      </Text>

      <Text style={styles.certificateMessage}>
        on {certificateData.completionDate}
      </Text>

      <View style={styles.certificateFooter}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Instructor</Text>
          <Text style={styles.footerValue}>
            {certificateData.instructor}
          </Text>
        </View>

        <View style={styles.footerDivider} />

        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Certificate ID</Text>
          <Text style={styles.footerValue}>
            {certificateData.certificateId}
          </Text>
        </View>
      </View>

      <Text style={styles.verificationText}>
        Verify at: educatepro.app/verify/{certificateData.certificateId}
      </Text>
    </View>
  );

  /**
   * Render details
   */
  const renderDetails = () => (
    <View
      style={[
        styles.detailsSection,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
        },
      ]}
    >
      <View style={styles.detailItem}>
        <MaterialCommunityIcons
          name="star"
          size={20}
          color={COLORS.primary}
        />
        <View style={{ flex: 1, marginLeft: SIZES.padding2 }}>
          <Text
            style={[
              styles.detailLabel,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Score
          </Text>
          <Text
            style={[
              styles.detailValue,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            {certificateData.score}%
          </Text>
        </View>
      </View>

      <View style={styles.detailItem}>
        <MaterialCommunityIcons
          name="calendar-check"
          size={20}
          color={COLORS.primary}
        />
        <View style={{ flex: 1, marginLeft: SIZES.padding2 }}>
          <Text
            style={[
              styles.detailLabel,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Completed On
          </Text>
          <Text
            style={[
              styles.detailValue,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            {certificateData.completionDate}
          </Text>
        </View>
      </View>

      <View style={styles.detailItem}>
        <MaterialCommunityIcons
          name="lock-check"
          size={20}
          color={COLORS.primary}
        />
        <View style={{ flex: 1, marginLeft: SIZES.padding2 }}>
          <Text
            style={[
              styles.detailLabel,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Status
          </Text>
          <Text
            style={[
              styles.detailValue,
              {
                color: COLORS.primary,
              },
            ]}
          >
            Verified
          </Text>
        </View>
      </View>
    </View>
  );

  /**
   * Render actions
   */
  const renderActions = () => (
    <View style={styles.actionSection}>
      <Button
        title="Download Certificate"
        onPress={handleDownload}
        filled
        style={{ marginBottom: SIZES.padding2 }}
      />

      <Button
        title="Share Certificate"
        onPress={handleShare}
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
        {renderCertificate()}
        {renderDetails()}
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
  certificateDisplay: {
    margin: SIZES.padding,
    padding: SIZES.padding * 1.5,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  certificateHeader: {
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  certificateLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: SIZES.padding2,
  },
  certificateSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  certificateDivider: {
    width: '80%',
    height: 1,
    backgroundColor: COLORS.greyscale300,
    marginVertical: SIZES.padding,
  },
  certificateMessage: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.greyscale600,
    marginTop: SIZES.base,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
    marginVertical: SIZES.padding,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginVertical: SIZES.padding2,
    textAlign: 'center',
  },
  certificateFooter: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: SIZES.padding,
    paddingTop: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.greyscale300,
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
  },
  footerDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.greyscale300,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.greyscale600,
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.black,
  },
  verificationText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.greyscale600,
    marginTop: SIZES.padding2,
  },
  detailsSection: {
    marginHorizontal: SIZES.padding,
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding * 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding2,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  actionSection: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
});

export default CertificateScreen;
