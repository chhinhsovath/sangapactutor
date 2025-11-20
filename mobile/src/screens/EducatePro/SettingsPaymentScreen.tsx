/**
 * SettingsPaymentScreen Component (Phase 5 - Tier 3)
 * Payment methods and billing settings
 * Adapted from EducatePro template
 *
 * Features:
 * - Saved payment methods list
 * - Add new payment method
 * - Set default payment method
 * - Billing history
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
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { Button } from '../../components/EducatePro';

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
  icon: string;
}

interface SettingsPaymentScreenProps {
  navigation: any;
}

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    type: 'Visa',
    last4: '4242',
    expiry: '12/25',
    isDefault: true,
    icon: 'credit-card',
  },
  {
    id: '2',
    type: 'Mastercard',
    last4: '5555',
    expiry: '08/26',
    isDefault: false,
    icon: 'credit-card',
  },
];

const MOCK_BILLING_HISTORY = [
  {
    id: '1',
    description: 'Advanced React Patterns',
    amount: '$49.99',
    date: '2025-01-15',
    status: 'Completed',
  },
  {
    id: '2',
    description: 'UI/UX Design Masterclass',
    amount: '$39.99',
    date: '2025-01-10',
    status: 'Completed',
  },
  {
    id: '3',
    description: 'Mentor Session - Sarah Johnson',
    amount: '$50.00',
    date: '2025-01-08',
    status: 'Completed',
  },
];

const SettingsPaymentScreen = ({ navigation }: SettingsPaymentScreenProps) => {
  const [isDark] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS);

  /**
   * Handle setting default payment method
   */
  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
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
        Payment Methods
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );

  /**
   * Render payment method card
   */
  const renderPaymentMethodCard = ({ item }: { item: PaymentMethod }) => (
    <View
      style={[
        styles.paymentCard,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
          borderColor:
            item.isDefault ? COLORS.primary : COLORS.greyscale300,
          borderWidth: item.isDefault ? 2 : 1,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <MaterialCommunityIcons
            name={item.icon}
            size={28}
            color={COLORS.primary}
          />
          <View style={{ marginLeft: SIZES.padding2 }}>
            <Text
              style={[
                styles.cardType,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              {item.type}
            </Text>
            <Text
              style={[
                styles.cardNumber,
                {
                  color: isDark ? COLORS.gray : COLORS.greyscale600,
                },
              ]}
            >
              •••• {item.last4}
            </Text>
          </View>
        </View>

        {item.isDefault && (
          <View
            style={[
              styles.defaultBadge,
              { backgroundColor: COLORS.primary },
            ]}
          >
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>

      <View
        style={[
          styles.cardFooter,
          {
            borderTopColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
          },
        ]}
      >
        <Text
          style={[
            styles.expiryDate,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          Expires {item.expiry}
        </Text>

        <View style={styles.cardActions}>
          {!item.isDefault && (
            <TouchableOpacity
              onPress={() => handleSetDefault(item.id)}
              activeOpacity={0.7}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>Set as Default</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity activeOpacity={0.7} style={styles.deleteButton}>
            <MaterialCommunityIcons
              name="delete-outline"
              size={20}
              color={COLORS.red}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  /**
   * Render billing history item
   */
  const renderBillingItem = ({ item }: { item: any }) => (
    <View
      style={[
        styles.billingItem,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
        },
      ]}
    >
      <View style={styles.billingInfo}>
        <View
          style={[
            styles.billingIcon,
            { backgroundColor: COLORS.primary + '20' },
          ]}
        >
          <MaterialCommunityIcons
            name="receipt"
            size={20}
            color={COLORS.primary}
          />
        </View>
        <View style={{ flex: 1, marginLeft: SIZES.padding2 }}>
          <Text
            style={[
              styles.billingDescription,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            {item.description}
          </Text>
          <Text
            style={[
              styles.billingDate,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            {item.date}
          </Text>
        </View>
      </View>

      <View style={styles.billingAmount}>
        <Text
          style={[
            styles.amount,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          {item.amount}
        </Text>
        <MaterialCommunityIcons
          name="check-circle"
          size={20}
          color={COLORS.primary}
        />
      </View>
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
            styles.sectionTitle,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Payment Methods
        </Text>

        {paymentMethods.map((method) =>
          renderPaymentMethodCard({ item: method })
        )}

        <Button
          title="Add New Card"
          onPress={() => {
            // TODO: Navigate to add payment method screen
          }}
          filled={false}
          color={COLORS.greyscale200}
          textColor={isDark ? COLORS.white : COLORS.black}
          style={{ marginTop: SIZES.padding2 }}
        />

        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDark ? COLORS.white : COLORS.black,
              marginTop: SIZES.padding * 2,
            },
          ]}
        >
          Billing History
        </Text>

        {MOCK_BILLING_HISTORY.map((item) =>
          renderBillingItem({ item })
        )}
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SIZES.padding2,
  },
  paymentCard: {
    borderRadius: 12,
    marginBottom: SIZES.padding2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding2,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardType: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: 12,
    fontWeight: '500',
  },
  defaultBadge: {
    paddingHorizontal: SIZES.padding2,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.padding2,
    borderTopWidth: 1,
  },
  expiryDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.padding2,
  },
  actionButton: {
    paddingHorizontal: SIZES.padding2,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  deleteButton: {
    padding: 4,
  },
  billingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding2,
  },
  billingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  billingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  billingDescription: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  billingDate: {
    fontSize: 11,
    fontWeight: '500',
  },
  billingAmount: {
    alignItems: 'flex-end',
    gap: 8,
  },
  amount: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default SettingsPaymentScreen;
