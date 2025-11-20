# EducatePro Global State Management Guide

Complete guide for using Contexts, Hooks, and Utilities for global state management across the EducatePro app.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [App Context](#app-context)
- [Cart Context](#cart-context)
- [Error Handling](#error-handling)
- [Toast Notifications](#toast-notifications)
- [Utility Functions](#utility-functions)
- [Integration Examples](#integration-examples)
- [Best Practices](#best-practices)

---

## Architecture Overview

```
AppNavigator (root)
    ↓
AppProvider (theme, language, settings)
    ↓
CartProvider (shopping cart)
    ↓
ErrorBoundary (error handling)
    ↓
ToastContainer (notifications)
    ↓
Screens & Components
```

### Provider Structure

Wrap your app with providers in the correct order:

```typescript
// App.tsx or RootNavigator.tsx
import AppNavigator from './navigation/AppNavigator';
import { AppProvider } from './contexts/AppContext';
import { CartProvider } from './contexts/CartContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastContainer } from './components/common/Toast';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <CartProvider>
          <ToastContainer />
          <AppNavigator />
        </CartProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
```

---

## App Context

Global application settings: theme, language, notifications, preferences.

### Usage

```typescript
import { useApp } from '../contexts/AppContext';

const MyComponent = () => {
  const app = useApp();

  return (
    <View style={{ backgroundColor: app.isDark ? '#000' : '#fff' }}>
      <Text>Language: {app.language}</Text>
      <Button
        title="Toggle Dark Mode"
        onPress={() => app.toggleTheme()}
      />
    </View>
  );
};
```

### API Reference

```typescript
interface AppContextType {
  // Theme Management
  isDark: boolean;
  toggleTheme: () => Promise<void>;

  // Language Settings
  language: string;                    // 'en', 'es', 'fr', etc.
  setLanguage: (lang: string) => Promise<void>;

  // Regional Settings
  region: string;                      // 'US', 'CA', 'UK', etc.
  setRegion: (region: string) => Promise<void>;

  timezone: string;                    // 'America/New_York', etc.
  setTimezone: (tz: string) => Promise<void>;

  // Notification Preferences
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (
    settings: Partial<NotificationSettings>
  ) => Promise<void>;

  // App State
  isLoading: boolean;
  error: string | null;
  clearError: () => void;

  // Features
  isOfflineMode: boolean;
  setOfflineMode: (offline: boolean) => void;

  // User Preferences
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => Promise<void>;

  enableBiometric: boolean;
  setEnableBiometric: (enable: boolean) => Promise<void>;
}
```

### Common Patterns

#### Check Dark Mode
```typescript
const { isDark } = useApp();

const backgroundColor = isDark ? COLORS.dark1 : COLORS.white;
const textColor = isDark ? COLORS.white : COLORS.black;
```

#### Update Language
```typescript
const { setLanguage } = useApp();

const handleLanguageChange = async (lang: string) => {
  await setLanguage(lang);
  // i18n configuration should re-render automatically
};
```

#### Manage Notification Settings
```typescript
const { notificationSettings, updateNotificationSettings } = useApp();

const togglePushNotifications = async () => {
  await updateNotificationSettings({
    pushNotifications: !notificationSettings.pushNotifications,
  });
};
```

---

## Cart Context

Shopping cart management for course enrollments and purchases.

### Usage

```typescript
import { useCart } from '../contexts/CartContext';

const ShoppingCartScreen = () => {
  const {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    total,
    applyPromoCode,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
  } = useCart();

  return (
    <View>
      <Text>Items: {items.length}</Text>
      <Text>Total: ${total.toFixed(2)}</Text>

      {items.map((item) => (
        <TouchableOpacity
          key={item.courseId}
          onPress={() => removeFromCart(item.courseId)}
        >
          <Text>{item.course.title}</Text>
          <Text>{formatPrice(item.price)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

### API Reference

```typescript
interface CartContextType {
  // Cart Items
  items: CartItem[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;

  // Pricing (Automatic Calculation)
  subtotal: number;                    // Sum of item prices
  tax: number;                         // 10% of subtotal
  discount: number;                    // Promo code discount
  total: number;                       // subtotal + tax - discount
  itemCount: number;                   // Number of items

  // Promo Code
  promoCode: PromoCode | null;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => void;

  // Payment
  selectedPaymentMethodId: string | null;
  setSelectedPaymentMethodId: (methodId: string | null) => void;

  // Billing Address
  billingAddress: BillingAddress | null;
  setBillingAddress: (address: BillingAddress) => void;

  // Processing State
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}
```

### Common Patterns

#### Add Course to Cart
```typescript
const { addToCart, isInCart } = useCart();

const handleEnrollCourse = (course: Course) => {
  if (!isInCart(course.id)) {
    addToCart(course);
    showSuccessToast('Course added to cart');
  }
};
```

#### Handle Checkout
```typescript
const {
  items,
  total,
  selectedPaymentMethodId,
  billingAddress,
  setIsProcessing,
} = useCart();

const handleCheckout = async () => {
  if (!selectedPaymentMethodId) {
    showErrorToast('Please select a payment method');
    return;
  }

  if (!billingAddress) {
    showErrorToast('Please enter billing address');
    return;
  }

  setIsProcessing(true);

  try {
    const result = await processPayment({
      courseIds: items.map((i) => i.courseId),
      paymentMethodId: selectedPaymentMethodId,
      amount: total,
    });

    showSuccessToast('Payment successful!');
    clearCart();
  } catch (error) {
    showErrorToast(error.message);
  } finally {
    setIsProcessing(false);
  }
};
```

#### Apply Promo Code
```typescript
const { applyPromoCode, promoCode } = useCart();

const handleApplyPromo = async () => {
  const success = await applyPromoCode('SAVE50');
  if (success) {
    showSuccessToast('Promo code applied!');
  } else {
    showErrorToast('Invalid promo code');
  }
};
```

### Valid Promo Codes (Mock)
```
SAVE50      → 50% discount
SAVE20      → 20% discount
WELCOME10   → 10% discount
SUMMER30    → 30% discount
NEWUSER25   → 25% discount
```

---

## Error Handling

### Error Boundary Component

Wrap screens or route segments with ErrorBoundary:

```typescript
import ErrorBoundary from '../components/common/ErrorBoundary';

export default function MyScreen() {
  return (
    <ErrorBoundary>
      <ScreenContent />
    </ErrorBoundary>
  );
}
```

### Features
- Catches JavaScript errors in child components
- Displays error UI with "Try Again" button
- Shows detailed error in development mode
- Prevents app crash (white screen of death)
- Can customize fallback UI

### Example with Fallback
```typescript
<ErrorBoundary
  fallback={<CustomErrorScreen />}
  onError={(error, errorInfo) => {
    // Log to error tracking service
    logErrorToSentry(error, errorInfo);
  }}
>
  <ExpensiveComponent />
</ErrorBoundary>
```

---

## Toast Notifications

System for displaying feedback messages to users.

### Usage

```typescript
import {
  showToast,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
} from '../utils/toast';

// Simple notifications
showSuccessToast('Course added to cart');
showErrorToast('Failed to save course');
showWarningToast('You have unsaved changes');
showInfoToast('New courses available');

// Custom toast
const toastId = showToast('Loading...', 'info', 0); // No auto-dismiss
// Later: dismissToast(toastId);
```

### Toast Types

```typescript
type ToastType = 'success' | 'error' | 'warning' | 'info';
```

**Colors:**
- `success` - Green (#4CAF50)
- `error` - Red (#E53935)
- `warning` - Orange (#FF9800)
- `info` - Blue (#1976D2)

### Advanced Toast Patterns

#### Long-Running Operation
```typescript
const startCourseDownload = async () => {
  const toastId = showToast('Downloading course...', 'info', 0);

  try {
    await downloadCourse(courseId);
    dismissToast(toastId);
    showSuccessToast('Course downloaded!');
  } catch (error) {
    dismissToast(toastId);
    showErrorToast('Download failed');
  }
};
```

#### Alert Dialog
```typescript
import { showAlert, showConfirmation, showDeleteConfirmation } from '../utils/toast';

// Simple alert
showAlert('Success', 'Course enrolled successfully');

// Confirmation
showConfirmation(
  'Confirm Enrollment',
  'Are you sure you want to enroll in this course?',
  () => handleEnroll(),
  () => console.log('Cancelled')
);

// Delete confirmation
showDeleteConfirmation(
  'Course',
  () => deleteCourse(courseId),
  () => console.log('Cancelled')
);
```

#### API Error Handling
```typescript
import { handleApiError } from '../utils/toast';

try {
  const result = await educateProService.getCourses();
} catch (error) {
  handleApiError(error, 'Failed to load courses');
}
```

### Required Setup

Make sure `ToastContainer` is rendered in your app root:

```typescript
import { ToastContainer } from './components/common/Toast';

export default function App() {
  return (
    <AppProvider>
      <CartProvider>
        <ToastContainer />  {/* Add this */}
        <AppNavigator />
      </CartProvider>
    </AppProvider>
  );
}
```

---

## Utility Functions

Helper functions for common operations.

### Location: `src/utils/helpers.ts`

### Formatting Functions

```typescript
import {
  formatCurrency,
  formatPrice,
  formatDate,
  formatTime,
  formatDuration,
  formatNumber,
} from '../utils/helpers';

formatCurrency(99.99);                // '$99.99'
formatPrice(49.99);                   // '$49.99'
formatDate(new Date(), 'short');      // 'Jan 15, 2025'
formatDate(new Date(), 'long');       // 'January 15, 2025'
formatTime(new Date());               // '2:30 PM'
formatDuration(7200);                 // '2h'
formatDuration(330);                  // '5m 30s'
formatNumber(1500);                   // '1.5K'
formatNumber(2500000);                // '2.5M'
```

### Validation Functions

```typescript
import {
  isValidEmail,
  isValidPhoneNumber,
  isStrongPassword,
  getPasswordStrength,
} from '../utils/helpers';

isValidEmail('user@example.com');     // true
isValidPhoneNumber('+1-555-123-4567');// true
isStrongPassword('MyPassword123!');   // true
getPasswordStrength('abc');           // 'weak'
getPasswordStrength('abc123');        // 'medium'
getPasswordStrength('MyPass123!');    // 'strong'
```

### Text Functions

```typescript
import {
  truncateText,
  capitalize,
  toTitleCase,
  getInitials,
  getFullName,
} from '../utils/helpers';

truncateText('Long course title...', 20);  // 'Long course titl...'
capitalize('hello');                       // 'Hello'
toTitleCase('hello world');                // 'Hello World'
getInitials('John', 'Doe');               // 'JD'
getFullName('John', 'Doe');               // 'John Doe'
```

### Date Functions

```typescript
import {
  isToday,
  isWithinDays,
  getRelativeTime,
  calculateDiscountPercent,
} from '../utils/helpers';

isToday(new Date());                       // true
isWithinDays(new Date(), 7);              // true
getRelativeTime(new Date());              // 'just now'
getRelativeTime('2025-01-14');            // '1d ago'
calculateDiscountPercent(100, 75);        // 25
```

### Functional Utilities

```typescript
import {
  debounce,
  throttle,
  deepClone,
  sleep,
  retry,
  safeJsonParse,
} from '../utils/helpers';

// Debounce search input
const debouncedSearch = debounce((query: string) => {
  searchCourses(query);
}, 500);

// Throttle scroll events
const throttledScroll = throttle(() => {
  loadMoreCourses();
}, 1000);

// Deep clone object
const coursesCopy = deepClone(courses);

// Delay execution
await sleep(2000); // Wait 2 seconds

// Retry with backoff
const data = await retry(
  () => fetchData(),
  { maxAttempts: 3, initialDelay: 1000 }
);

// Safe JSON parsing
const parsed = safeJsonParse(jsonString, {});
```

### Object Utilities

```typescript
import {
  isEmpty,
  getNestedValue,
  mergeObjects,
  filterObjectByKeys,
} from '../utils/helpers';

isEmpty({});                    // true
getNestedValue(user, 'profile.avatar');  // Safe nested access
mergeObjects(obj1, obj2);      // Merge two objects
filterObjectByKeys(obj, ['id', 'name']); // Pick specific keys
```

---

## Integration Examples

### Example 1: Settings Screen with Dark Mode

```typescript
import { useApp } from '../contexts/AppContext';
import { COLORS } from '../constants/educatepro-theme';

const SettingsScreen = () => {
  const { isDark, toggleTheme, language, setLanguage } = useApp();

  return (
    <ScrollView
      style={{
        backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
      }}
    >
      <SettingsItem
        title="Dark Mode"
        value={isDark}
        onToggle={toggleTheme}
      />

      <SettingsItem
        title="Language"
        value={language}
        options={['en', 'es', 'fr']}
        onChange={setLanguage}
      />
    </ScrollView>
  );
};
```

### Example 2: Course Payment Flow

```typescript
import { useCart } from '../contexts/CartContext';
import { useMutateMentorSession } from '../hooks/useEducatePro';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { formatPrice } from '../utils/helpers';

const CheckoutScreen = () => {
  const {
    items,
    subtotal,
    tax,
    discount,
    total,
    promoCode,
    applyPromoCode,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    isProcessing,
    setIsProcessing,
    clearCart,
  } = useCart();

  const handleApplyPromo = async () => {
    const success = await applyPromoCode('SAVE50');
    if (!success) {
      showErrorToast('Invalid promo code');
    }
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethodId) {
      showErrorToast('Please select payment method');
      return;
    }

    setIsProcessing(true);

    try {
      await processPayment({
        courseIds: items.map((i) => i.courseId),
        paymentMethodId: selectedPaymentMethodId,
        amount: total,
      });

      showSuccessToast('Payment successful!');
      clearCart();
    } catch (error) {
      showErrorToast('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View>
      <Text>Subtotal: {formatPrice(subtotal)}</Text>
      <Text>Tax: {formatPrice(tax)}</Text>
      {promoCode && <Text>Discount: -{formatPrice(discount)}</Text>}
      <Text style={{ fontWeight: 'bold' }}>Total: {formatPrice(total)}</Text>

      <Button
        title="Apply Promo Code"
        onPress={handleApplyPromo}
      />

      <Button
        title="Proceed to Payment"
        onPress={handleCheckout}
        disabled={isProcessing}
      />
    </View>
  );
};
```

### Example 3: Error Handling in Data Fetch

```typescript
import { useCourses } from '../hooks/useEducatePro';
import { showErrorToast } from '../utils/toast';
import { retry } from '../utils/helpers';

const CoursesListScreen = () => {
  const { data, loading, error, refetch } = useCourses(1, 10);

  useEffect(() => {
    if (error) {
      showErrorToast('Failed to load courses');
    }
  }, [error]);

  const handleRetryWithBackoff = async () => {
    try {
      await retry(() => refetch(), {
        maxAttempts: 3,
        initialDelay: 1000,
      });
    } catch (err) {
      showErrorToast('Failed to load courses');
    }
  };

  if (loading) return <ActivityIndicator />;
  if (error) return <Button title="Retry" onPress={handleRetryWithBackoff} />;

  return <FlatList data={data?.data} renderItem={...} />;
};
```

---

## Best Practices

### 1. Provider Hierarchy

Always maintain correct provider order:
```typescript
ErrorBoundary → AppProvider → CartProvider → ToastContainer → Navigation
```

### 2. Use Contexts for Global State Only

✅ Good:
```typescript
const { isDark } = useApp(); // Global theme
```

❌ Wrong:
```typescript
const { selectedCourse } = useApp(); // Component-level state
```

### 3. Centralize Error Handling

✅ Good:
```typescript
const handleError = (error: Error) => {
  showErrorToast(error.message);
  logToErrorTracking(error);
};
```

❌ Wrong:
```typescript
// Error handling scattered in every component
Alert.alert('Error', error.message);
```

### 4. Use Toast for User Feedback

✅ Good:
```typescript
try {
  await action();
  showSuccessToast('Action completed');
} catch (error) {
  showErrorToast('Action failed');
}
```

❌ Wrong:
```typescript
// Using alerts for every action
Alert.alert('Success', 'Action completed');
```

### 5. Leverage Utility Functions

✅ Good:
```typescript
import { formatPrice, formatDate } from '../utils/helpers';

<Text>{formatPrice(course.price)}</Text>
<Text>{formatDate(enrollment.enrolledAt)}</Text>
```

❌ Wrong:
```typescript
<Text>${course.price.toFixed(2)}</Text>
<Text>{new Date(enrollment.enrolledAt).toLocaleDateString()}</Text>
```

### 6. Persist User Settings

The AppContext automatically persists to local storage:
```typescript
// Automatically saved to storage
await toggleTheme();
await setLanguage('es');
await updateNotificationSettings({ pushNotifications: false });
```

### 7. Clean Up on Logout

When user logs out, clear cart and reset settings:
```typescript
const { clearCart } = useCart();

const handleLogout = async () => {
  clearCart();
  // Clear other session data
};
```

---

## Troubleshooting

### "useApp must be used within AppProvider"
- Check that `AppProvider` wraps the component in the component tree
- Verify it's not used in a component that renders before the provider

### Toasts not appearing
- Verify `ToastContainer` is rendered in app root
- Check that component imports are correct
- Ensure `ToastContainer` is not wrapped in a component that might hide it

### Dark mode not updating
- Check that component accesses `isDark` from `useApp()` hook
- Verify `backgroundColor` is conditional based on `isDark`
- Clear app cache and rebuild if using Expo

### Cart not persisting
- Current implementation stores in memory only
- To persist to storage, see integration guide for localStorage implementation
- Alternatively, sync with backend after each cart change

---

## Migration Checklist

For each screen:
- [ ] Import required contexts/utilities
- [ ] Replace hardcoded colors with theme colors
- [ ] Replace mock data with API hooks
- [ ] Add error boundaries where appropriate
- [ ] Use toast for user feedback
- [ ] Use utility functions for formatting
- [ ] Test in both light and dark modes
- [ ] Verify all integrations work
