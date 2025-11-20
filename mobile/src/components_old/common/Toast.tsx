/**
 * Toast Display Component
 * Renders toast notifications at the top of the screen
 * Use with toast utility for centralized notification management
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ToastMessage, onToastChange, dismissToast } from '../../utils/toast';

const { height } = Dimensions.get('window');

const TOAST_COLORS = {
  success: {
    bg: '#4CAF50',
    icon: 'check-circle',
    color: '#fff',
  },
  error: {
    bg: '#E53935',
    icon: 'alert-circle',
    color: '#fff',
  },
  warning: {
    bg: '#FF9800',
    icon: 'alert',
    color: '#fff',
  },
  info: {
    bg: '#1976D2',
    icon: 'information',
    color: '#fff',
  },
};

interface ToastProps {
  toast: ToastMessage;
  index: number;
}

const Toast: React.FC<ToastProps> = ({ toast, index }) => {
  const [slideAnim] = React.useState(new Animated.Value(0));
  const colors = TOAST_COLORS[toast.type];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, index * 80],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          top: 16 + index * 80,
        },
      ]}
    >
      <View style={[styles.toast, { backgroundColor: colors.bg }]}>
        <MaterialCommunityIcons
          name={colors.icon}
          size={20}
          color={colors.color}
          style={styles.icon}
        />

        <View style={styles.content}>
          <Text
            style={[styles.message, { color: colors.color }]}
            numberOfLines={2}
          >
            {toast.message}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => dismissToast(toast.id)}
          style={styles.closeButton}
        >
          <MaterialCommunityIcons
            name="close"
            size={18}
            color={colors.color}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

/**
 * Toast Container Component
 * Wrap your app with this to display toasts
 * Place near the top of your navigation stack
 */
export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // Subscribe to toast changes
    const unsubscribe = onToastChange((newToasts) => {
      setToasts(newToasts);
    });

    return unsubscribe;
  }, []);

  return (
    <View pointerEvents="box-none" style={styles.toastContainer}>
      {toasts.slice(0, 3).map((toast, index) => (
        <Toast key={toast.id} toast={toast} index={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  closeButton: {
    padding: 8,
    marginLeft: 12,
  },
});

export default Toast;
