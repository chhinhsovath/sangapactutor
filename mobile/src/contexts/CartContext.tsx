/**
 * CartContext
 * Manages shopping cart for course enrollments and purchases
 * Handles course selection, promo codes, payments
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Course } from '../types/educatepro.types';

export interface CartItem {
  courseId: string;
  course: Course;
  price: number;
  originalPrice: number;
  addedAt: Date;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  discountAmount: number;
  isValid: boolean;
  expiresAt?: Date;
}

export interface CartContextType {
  // Cart Items
  items: CartItem[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;

  // Pricing
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;

  // Promo Code
  promoCode: PromoCode | null;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => void;

  // Payment
  selectedPaymentMethodId: string | null;
  setSelectedPaymentMethodId: (methodId: string | null) => void;

  // Billing
  billingAddress: BillingAddress | null;
  setBillingAddress: (address: BillingAddress) => void;

  // Checkout
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export interface BillingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Promo codes database (mock - replace with API call)
const VALID_PROMO_CODES: Record<string, number> = {
  SAVE50: 50,
  SAVE20: 20,
  WELCOME10: 10,
  SUMMER30: 30,
  NEWUSER25: 25,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCodeState] = useState<PromoCode | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [billingAddress, setBillingAddress] = useState<BillingAddress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Calculate subtotal
   */
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  /**
   * Calculate tax (10% for now)
   */
  const tax = Math.round(subtotal * 0.1 * 100) / 100;

  /**
   * Calculate discount
   */
  const discount = promoCode ? Math.round(subtotal * (promoCode.discountPercent / 100) * 100) / 100 : 0;

  /**
   * Calculate total
   */
  const total = subtotal + tax - discount;

  /**
   * Get item count
   */
  const itemCount = items.length;

  /**
   * Add course to cart
   */
  const addToCart = useCallback((course: Course) => {
    setItems((prevItems) => {
      // Check if already in cart
      if (prevItems.find((item) => item.courseId === course.id)) {
        return prevItems;
      }

      return [
        ...prevItems,
        {
          courseId: course.id,
          course,
          price: course.price,
          originalPrice: course.originalPrice || course.price,
          addedAt: new Date(),
        },
      ];
    });
  }, []);

  /**
   * Remove course from cart
   */
  const removeFromCart = useCallback((courseId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.courseId !== courseId));
  }, []);

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCodeState(null);
    setSelectedPaymentMethodId(null);
    setBillingAddress(null);
  }, []);

  /**
   * Check if course is in cart
   */
  const isInCart = useCallback((courseId: string) => {
    return items.some((item) => item.courseId === courseId);
  }, [items]);

  /**
   * Apply promo code
   */
  const applyPromoCode = useCallback(async (code: string): Promise<boolean> => {
    try {
      const upperCode = code.toUpperCase().trim();
      const discountPercent = VALID_PROMO_CODES[upperCode];

      if (!discountPercent) {
        return false;
      }

      const newPromoCode: PromoCode = {
        code: upperCode,
        discountPercent,
        discountAmount: Math.round(subtotal * (discountPercent / 100) * 100) / 100,
        isValid: true,
      };

      setPromoCodeState(newPromoCode);
      return true;
    } catch (err) {
      console.error('Failed to apply promo code:', err);
      return false;
    }
  }, [subtotal]);

  /**
   * Remove promo code
   */
  const removePromoCode = useCallback(() => {
    setPromoCodeState(null);
  }, []);

  /**
   * Set selected payment method
   */
  const handleSetSelectedPaymentMethodId = useCallback((methodId: string | null) => {
    setSelectedPaymentMethodId(methodId);
  }, []);

  /**
   * Set billing address
   */
  const handleSetBillingAddress = useCallback((address: BillingAddress) => {
    setBillingAddress(address);
  }, []);

  /**
   * Set processing state
   */
  const handleSetIsProcessing = useCallback((processing: boolean) => {
    setIsProcessing(processing);
  }, []);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    subtotal,
    tax,
    discount,
    total,
    itemCount,
    promoCode,
    applyPromoCode,
    removePromoCode,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId: handleSetSelectedPaymentMethodId,
    billingAddress,
    setBillingAddress: handleSetBillingAddress,
    isProcessing,
    setIsProcessing: handleSetIsProcessing,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Hook to use CartContext
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
