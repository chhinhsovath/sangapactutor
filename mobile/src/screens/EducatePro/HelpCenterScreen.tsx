/**
 * HelpCenterScreen Component (Phase 5 - Tier 3)
 * FAQ and support resources
 * Adapted from EducatePro template
 *
 * Features:
 * - FAQ accordion list
 * - Search functionality
 * - Contact support button
 * - Categorized help topics
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
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpCenterScreenProps {
  navigation: any;
}

const MOCK_FAQS: FAQ[] = [
  {
    id: '1',
    question: 'How do I enroll in a course?',
    answer: 'Simply browse the courses, click the course you\'re interested in, and tap "Enroll Now". You can start learning immediately after enrollment.',
    category: 'Enrollment',
  },
  {
    id: '2',
    question: 'Can I get a refund after enrollment?',
    answer: 'Yes, we offer 30-day money-back guarantee if you\'re not satisfied with the course. Contact our support team for assistance.',
    category: 'Payment',
  },
  {
    id: '3',
    question: 'How can I download course materials?',
    answer: 'You can download course materials by going to each lesson and tapping the download icon. Downloaded materials will be available offline.',
    category: 'Learning',
  },
  {
    id: '4',
    question: 'Can I get a certificate after completing a course?',
    answer: 'Yes! Once you complete all lessons and pass the final assessment, you\'ll receive a certificate of completion.',
    category: 'Certificates',
  },
  {
    id: '5',
    question: 'How do I contact a mentor?',
    answer: 'Visit any mentor\'s profile and tap "Message" to start a conversation. You can also book a one-on-one session.',
    category: 'Mentoring',
  },
  {
    id: '6',
    question: 'What payment methods do you accept?',
    answer: 'We accept credit cards, debit cards, digital wallets, and bank transfers. All payments are secure and encrypted.',
    category: 'Payment',
  },
];

const HelpCenterScreen = ({ navigation }: HelpCenterScreenProps) => {
  const [isDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [faqs, setFaqs] = useState(MOCK_FAQS);

  /**
   * Filter FAQs
   */
  const getFilteredFAQs = () => {
    if (!searchQuery) return faqs;
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  /**
   * Toggle FAQ expansion
   */
  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
        Help Center
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );

  /**
   * Render search bar
   */
  const renderSearchBar = () => (
    <View
      style={[
        styles.searchBar,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
        },
      ]}
    >
      <MaterialCommunityIcons
        name="magnify"
        size={20}
        color={COLORS.gray}
      />
      <TextInput
        placeholder="Search FAQs..."
        placeholderTextColor={COLORS.gray}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[
          styles.searchInput,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      />
    </View>
  );

  /**
   * Render quick actions
   */
  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Quick Actions
      </Text>

      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[
            styles.actionCard,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="chat-outline"
            size={28}
            color={COLORS.primary}
          />
          <Text
            style={[
              styles.actionTitle,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Live Chat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionCard,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="email-outline"
            size={28}
            color={COLORS.primary}
          />
          <Text
            style={[
              styles.actionTitle,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Email Us
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionCard,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="phone-outline"
            size={28}
            color={COLORS.primary}
          />
          <Text
            style={[
              styles.actionTitle,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Call Us
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionCard,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="file-document-outline"
            size={28}
            color={COLORS.primary}
          />
          <Text
            style={[
              styles.actionTitle,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Knowledge Base
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Render FAQ item
   */
  const renderFAQItem = ({ item }: { item: FAQ }) => (
    <TouchableOpacity
      onPress={() => toggleExpanded(item.id)}
      style={[
        styles.faqItem,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
        },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.faqCategory,
              {
                color: COLORS.primary,
              },
            ]}
          >
            {item.category}
          </Text>
          <Text
            style={[
              styles.faqQuestion,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            {item.question}
          </Text>
        </View>

        <MaterialCommunityIcons
          name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={COLORS.primary}
        />
      </View>

      {expandedId === item.id && (
        <Text
          style={[
            styles.faqAnswer,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          {item.answer}
        </Text>
      )}
    </TouchableOpacity>
  );

  const filteredFAQs = getFilteredFAQs();

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
        data={filteredFAQs}
        renderItem={renderFAQItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {renderSearchBar()}
            {renderQuickActions()}
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
                { marginBottom: SIZES.padding },
              ]}
            >
              Frequently Asked Questions
            </Text>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding2,
    height: 48,
    borderRadius: 12,
    marginHorizontal: SIZES.padding,
    marginVertical: SIZES.padding2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: SIZES.padding2,
  },
  quickActionsContainer: {
    paddingHorizontal: SIZES.padding,
    marginVertical: SIZES.padding,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SIZES.padding2,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.padding2,
  },
  actionCard: {
    width: '48%',
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: SIZES.base,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
  },
  faqItem: {
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding2,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqCategory: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  faqAnswer: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    marginTop: SIZES.padding2,
  },
});

export default HelpCenterScreen;
