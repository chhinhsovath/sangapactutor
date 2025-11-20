/**
 * ConfirmPaymentScreen Component (Phase 5 - Tier 2)
 * Payment confirmation and processing
 * Adapted from EducatePro template
 *
 * Features:
 * - Order summary display
 * - Price breakdown
 * - Payment method selection
 * - Promo code input
 * - Billing details confirmation
 * - Payment processing
 * - Dark mode support
 * - Loading state management
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { Button } from '../../components/EducatePro';

interface ConfirmPaymentScreenProps {
  navigation: any;
  route?: any;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    name: 'Credit Card',
    icon: 'credit-card',
    type: 'card',
  },
  {
    id: '2',
    name: 'Debit Card',
    icon: 'credit-card-outline',
    type: 'debit',
  },
  {
    id: '3',
    name: 'Digital Wallet',
    icon: 'wallet-outline',
    type: 'wallet',
  },
  {
    id: '4',
    name: 'Bank Transfer',
    icon: 'bank-outline',
    type: 'bank',
  },
];

const ConfirmPaymentScreen = ({
  navigation,
  route,
}: ConfirmPaymentScreenProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('1');
  const [isDark] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Mock order data
  const orderData = {
    courseTitle: 'Advanced React Patterns',
    coursePrice: 99.99,
    originalPrice: 149.99,
    description: 'Master advanced React patterns and best practices',
    instructor: 'John Smith',
  };

  const coursePrice = orderData.coursePrice;
  const discountAmount = (coursePrice * discount) / 100;
  const totalAmount = coursePrice - discountAmount;

  /**
   * Handle applying promo code
   */
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE50') {
      setDiscount(50);
      Alert.alert('Success', 'Promo code applied! 50% discount activated');
    } else if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(20);
      Alert.alert('Success', 'Promo code applied! 20% discount activated');
    } else if (promoCode) {
      Alert.alert('Invalid Code', 'The promo code you entered is not valid');
    }
  };

  /**
   * Handle payment confirmation
   */
  const handleConfirmPayment = async () => {
    if (!agreeToTerms) {
      Alert.alert(
        'Agreement Required',
        'Please agree to the terms and conditions'
      );
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Connect to payment API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      Alert.alert('Payment Successful', 'Your payment has been processed!', [
        {
          text: 'View Receipt',
          onPress: () => {
            // Show receipt or navigate to success screen
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Payment Failed', 'Unable to process payment');
    } finally {
      setIsProcessing(false);
    }
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
        Confirm Payment
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );

  /**
   * Render order summary
   */
  const renderOrderSummary = () => (
    <View
      style={[
        styles.section,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
        },
      ]}
    >
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Order Summary
      </Text>

      <View style={styles.courseSummary}>
        <View style={styles.courseIcon}>
          <MaterialCommunityIcons
            name="book-outline"
            size={32}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.courseInfo}>
          <Text
            style={[
              styles.courseTitle,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            {orderData.courseTitle}
          </Text>
          <Text
            style={[
              styles.instructorName,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            by {orderData.instructor}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.divider,
          {
            borderColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
          },
        ]}
      />

      <View style={styles.priceBreakdown}>
        <View style={styles.priceRow}>
          <Text
            style={[
              styles.priceLabel,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Course Price
          </Text>
          <Text
            style={[
              styles.priceValue,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            ${coursePrice.toFixed(2)}
          </Text>
        </View>

        {discount > 0 && (
          <View style={styles.priceRow}>
            <Text
              style={[
                styles.priceLabel,
                {
                  color: COLORS.primary,
                },
              ]}
            >
              Discount ({discount}%)
            </Text>
            <Text
              style={[
                styles.priceValue,
                {
                  color: COLORS.primary,
                },
              ]}
            >
              -${discountAmount.toFixed(2)}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.divider,
            {
              borderColor: isDark ? COLORS.dark3 : COLORS.greyscale200,
            },
          ]}
        />

        <View style={styles.priceRow}>
          <Text
            style={[
              styles.totalLabel,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Total Amount
          </Text>
          <Text style={styles.totalValue}>
            ${totalAmount.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  /**
   * Render promo code section
   */
  const renderPromoCodeSection = () => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Promo Code
      </Text>

      <View style={styles.promoCodeContainer}>
        <TextInput
          placeholder="Enter promo code"
          placeholderTextColor={COLORS.gray}
          value={promoCode}
          onChangeText={setPromoCode}
          style={[
            styles.promoInput,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
          editable={!isProcessing}
        />
        <TouchableOpacity
          onPress={handleApplyPromo}
          disabled={!promoCode || isProcessing}
          style={[
            styles.applyButton,
            !promoCode || isProcessing ? styles.disabledButton : {},
          ]}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.promoHint,
          {
            color: isDark ? COLORS.gray : COLORS.greyscale600,
          },
        ]}
      >
        Try codes: SAVE50 (50% off) or SAVE20 (20% off)
      </Text>
    </View>
  );

  /**
   * Render payment method section
   */
  const renderPaymentMethodSection = () => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        Payment Method
      </Text>

      {PAYMENT_METHODS.map((method) => (
        <TouchableOpacity
          key={method.id}
          onPress={() => setSelectedPaymentMethod(method.id)}
          style={[
            styles.paymentMethodItem,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
              borderColor:
                selectedPaymentMethod === method.id
                  ? COLORS.primary
                  : 'transparent',
            },
          ]}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.methodIcon,
              {
                backgroundColor:
                  selectedPaymentMethod === method.id
                    ? COLORS.primary + '20'
                    : 'transparent',
              },
            ]}
          >
            <MaterialCommunityIcons
              name={method.icon}
              size={24}
              color={
                selectedPaymentMethod === method.id
                  ? COLORS.primary
                  : isDark
                  ? COLORS.gray
                  : COLORS.greyscale600
              }
            />
          </View>

          <Text
            style={[
              styles.methodName,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            {method.name}
          </Text>

          <View
            style={[
              styles.radioButton,
              selectedPaymentMethod === method.id && styles.radioButtonSelected,
              {
                borderColor:
                  selectedPaymentMethod === method.id
                    ? COLORS.primary
                    : isDark
                    ? COLORS.dark3
                    : COLORS.greyscale200,
              },
            ]}
          >
            {selectedPaymentMethod === method.id && (
              <View
                style={[
                  styles.radioButtonInner,
                  { backgroundColor: COLORS.primary },
                ]}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  /**
   * Render terms checkbox
   */
  const renderTermsCheckbox = () => (
    <TouchableOpacity
      onPress={() => setAgreeToTerms(!agreeToTerms)}
      style={styles.termsContainer}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: agreeToTerms
              ? COLORS.primary
              : isDark
              ? COLORS.dark2
              : COLORS.greyscale100,
            borderColor: agreeToTerms ? COLORS.primary : COLORS.greyscale200,
          },
        ]}
      >
        {agreeToTerms && (
          <MaterialCommunityIcons
            name="check"
            size={14}
            color={COLORS.white}
          />
        )}
      </View>
      <Text
        style={[
          styles.termsText,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        I agree to the payment terms and conditions
      </Text>
    </TouchableOpacity>
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
        contentContainerStyle={styles.scrollContent}
      >
        {renderOrderSummary()}
        {renderPromoCodeSection()}
        {renderPaymentMethodSection()}
        {renderTermsCheckbox()}

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            filled={false}
            color={COLORS.greyscale200}
            textColor={isDark ? COLORS.white : COLORS.black}
            style={{ marginBottom: SIZES.padding }}
          />

          <Button
            title={isProcessing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
            onPress={handleConfirmPayment}
            filled
            disabled={!agreeToTerms || isProcessing}
            isLoading={isProcessing}
          />
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
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  section: {
    marginBottom: SIZES.padding * 1.5,
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.padding,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SIZES.padding2,
  },
  courseSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  courseIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    marginRight: SIZES.padding2,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    borderWidth: 0.5,
    marginVertical: SIZES.padding2,
  },
  priceBreakdown: {
    gap: SIZES.padding,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  promoCodeContainer: {
    flexDirection: 'row',
    gap: SIZES.padding2,
    marginBottom: SIZES.padding,
  },
  promoInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: SIZES.padding2,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.greyscale200,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
    opacity: 0.5,
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  promoHint: {
    fontSize: 11,
    fontWeight: '500',
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding2,
    borderWidth: 1.5,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding2,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderWidth: 2,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
    paddingHorizontal: SIZES.padding2,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding2,
    flexShrink: 0,
  },
  termsText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  buttonContainer: {
    marginTop: SIZES.padding * 2,
    marginBottom: SIZES.padding * 2,
  },
});

export default ConfirmPaymentScreen;
