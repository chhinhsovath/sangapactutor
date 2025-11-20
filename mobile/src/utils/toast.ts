/**
 * Toast/Notification Utility
 * Centralized toast notification system with queue management
 * Can be extended with Expo notifications for push notifications
 */

import { Alert } from 'react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

// Toast queue management
let toastQueue: ToastMessage[] = [];
let toastListeners: ((toasts: ToastMessage[]) => void)[] = [];

/**
 * Register a listener for toast changes
 */
export const onToastChange = (listener: (toasts: ToastMessage[]) => void) => {
  toastListeners.push(listener);

  return () => {
    toastListeners = toastListeners.filter((l) => l !== listener);
  };
};

/**
 * Notify all listeners of toast changes
 */
const notifyListeners = () => {
  toastListeners.forEach((listener) => listener(toastQueue));
};

/**
 * Generate unique ID for toast
 */
const generateId = () => `${Date.now()}-${Math.random()}`;

/**
 * Show toast notification
 */
export const showToast = (
  message: string,
  type: ToastType = 'info',
  duration: number = 3000
): string => {
  const id = generateId();

  const toast: ToastMessage = {
    id,
    message,
    type,
    duration,
  };

  toastQueue = [...toastQueue, toast];
  notifyListeners();

  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }

  return id;
};

/**
 * Show success toast
 */
export const showSuccessToast = (message: string, duration?: number): string => {
  return showToast(message, 'success', duration || 3000);
};

/**
 * Show error toast
 */
export const showErrorToast = (message: string, duration?: number): string => {
  return showToast(message, 'error', duration || 4000);
};

/**
 * Show warning toast
 */
export const showWarningToast = (message: string, duration?: number): string => {
  return showToast(message, 'warning', duration || 3500);
};

/**
 * Show info toast
 */
export const showInfoToast = (message: string, duration?: number): string => {
  return showToast(message, 'info', duration || 3000);
};

/**
 * Dismiss toast by ID
 */
export const dismissToast = (id: string) => {
  toastQueue = toastQueue.filter((t) => t.id !== id);
  notifyListeners();
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toastQueue = [];
  notifyListeners();
};

/**
 * Get current toasts
 */
export const getToasts = (): ToastMessage[] => {
  return [...toastQueue];
};

/**
 * Show alert dialog (for critical messages)
 */
export const showAlert = (
  title: string,
  message?: string,
  buttons: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }> = [{ text: 'OK' }]
) => {
  Alert.alert(title, message, buttons);
};

/**
 * Show confirmation dialog
 */
export const showConfirmation = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  Alert.alert(title, message, [
    {
      text: 'Cancel',
      onPress: onCancel,
      style: 'cancel',
    },
    {
      text: 'Confirm',
      onPress: onConfirm,
      style: 'default',
    },
  ]);
};

/**
 * Show delete confirmation
 */
export const showDeleteConfirmation = (
  itemName: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  Alert.alert(
    'Delete Confirmation',
    `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    [
      {
        text: 'Cancel',
        onPress: onCancel,
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: onConfirm,
        style: 'destructive',
      },
    ]
  );
};

/**
 * Show error alert with details
 */
export const showErrorAlert = (
  title: string = 'Error',
  error: Error | string,
  onDismiss?: () => void
) => {
  const message = typeof error === 'string' ? error : error.message;
  Alert.alert(title, message, [
    {
      text: 'OK',
      onPress: onDismiss,
    },
  ]);
};

/**
 * Show API error handling
 */
export const handleApiError = (error: any, defaultMessage?: string) => {
  let message = defaultMessage || 'An error occurred';

  if (error.response) {
    // Server responded with error status
    message = error.response.data?.error?.message || error.response.statusText || message;
  } else if (error.message) {
    message = error.message;
  }

  showErrorToast(message);
};

/**
 * Toast context provider data (for React component integration)
 */
export const ToastSystem = {
  show: showToast,
  success: showSuccessToast,
  error: showErrorToast,
  warning: showWarningToast,
  info: showInfoToast,
  dismiss: dismissToast,
  dismissAll: dismissAllToasts,
  getToasts,
  onToastChange,
};
