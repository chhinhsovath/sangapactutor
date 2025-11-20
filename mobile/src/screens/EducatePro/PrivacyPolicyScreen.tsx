/**
 * PrivacyPolicyScreen Component (Phase 5 - Tier 3)
 * Privacy policy and legal information
 * Adapted from EducatePro template
 *
 * Features:
 * - Scrollable policy content
 * - Collapsible sections
 * - Last updated date
 * - Contact information
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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface PrivacyPolicyScreenProps {
  navigation: any;
}

const PolicySection = ({ title, content }: { title: string; content: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.sectionHeader}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={COLORS.primary}
        />
      </TouchableOpacity>

      {expanded && (
        <Text style={styles.sectionContent}>{content}</Text>
      )}
    </View>
  );
};

const PrivacyPolicyScreen = ({ navigation }: PrivacyPolicyScreenProps) => {
  const [isDark] = useState(false);

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
        Privacy Policy
      </Text>

      <View style={{ width: 24 }} />
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
        <Text
          style={[
            styles.lastUpdated,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          Last updated: January 15, 2025
        </Text>

        <PolicySection
          title="1. Introduction"
          content="We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application."
        />

        <PolicySection
          title="2. Information We Collect"
          content="We may collect information about you in a variety of ways. The information we may collect on the Site includes:\n\n• Personal Data: Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.\n\n• Financial Data: Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase or attempt to purchase products and services from the Site."
        />

        <PolicySection
          title="3. Use of Your Information"
          content="Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:\n\n• Create and manage your account.\n• Process your transactions and send related information.\n• Deliver targeted advertising, newsletters, and other information regarding offers, promotions, and events to you.\n• Respond to your inquiries, questions, and requests.\n• Improve our website and services.\n• Monitor and analyze usage and trends to improve your experience with the Site."
        />

        <PolicySection
          title="4. Disclosure of Your Information"
          content="We may share information we have collected about you in certain situations:\n\n• By Law or to Protect Rights: If we believe the release of information about you is necessary to comply with the law, enforce our Site policies, or protect ours or others' rights, property, and safety.\n\n• Third-Party Service Providers: We may share your information with parties that perform services for us, including payment processors, data analysts, email delivery services, hosting providers, customer service, and marketing assistants."
        />

        <PolicySection
          title="5. Security of Your Information"
          content="We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and any transmission of personal data is at your own risk."
        />

        <PolicySection
          title="6. Contact Us"
          content="If you have questions or comments about this Privacy Policy, please contact us at:\n\nEmail: privacy@educatepro.com\nPhone: 1-800-EDUCATE\nAddress: 123 Education Lane, Learning City, LC 12345"
        />

        <View style={styles.footer}>
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={32}
            color={COLORS.primary}
          />
          <Text
            style={[
              styles.footerText,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Your privacy is important to us
          </Text>
        </View>
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
  lastUpdated: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale200,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.black,
  },
  sectionContent: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.greyscale600,
    paddingVertical: SIZES.padding2,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginVertical: SIZES.padding * 2,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: SIZES.padding,
  },
});

export default PrivacyPolicyScreen;
