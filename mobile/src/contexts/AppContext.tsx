/**
 * AppContext
 * Global application state for theme, language, notifications, and settings
 * Manages user preferences and app-wide configuration
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { NotificationSettings } from '../types/educatepro.types';

export interface AppContextType {
  // Theme
  isDark: boolean;
  toggleTheme: () => Promise<void>;

  // Language
  language: string;
  setLanguage: (lang: string) => Promise<void>;

  // Region & Timezone
  region: string;
  setRegion: (region: string) => Promise<void>;
  timezone: string;
  setTimezone: (tz: string) => Promise<void>;

  // Notifications
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;

  // App State
  isLoading: boolean;
  error: string | null;
  clearError: () => void;

  // Features
  isOfflineMode: boolean;
  setOfflineMode: (offline: boolean) => void;

  // Preferences
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => Promise<void>;
  enableBiometric: boolean;
  setEnableBiometric: (enable: boolean) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme
  const [isDark, setIsDark] = useState(false);

  // Language
  const [language, setLanguageState] = useState('en');

  // Region & Timezone
  const [region, setRegionState] = useState('US');
  const [timezone, setTimezoneState] = useState('America/New_York');

  // Notifications
  const [notificationSettings, setNotificationSettingsState] = useState<NotificationSettings>({
    pushNotifications: true,
    courseUpdates: true,
    messages: true,
    promotions: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  // App State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Features
  const [isOfflineMode, setOfflineMode] = useState(false);

  // Preferences
  const [showOnboarding, setShowOnboardingState] = useState(true);
  const [enableBiometric, setEnableBiometricState] = useState(false);

  /**
   * Initialize app settings from storage
   */
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);

        // Load settings from storage
        const savedTheme = await storage.getItem('app_theme');
        if (savedTheme === 'dark') {
          setIsDark(true);
        }

        const savedLanguage = await storage.getItem('app_language');
        if (savedLanguage) {
          setLanguageState(savedLanguage);
        }

        const savedRegion = await storage.getItem('app_region');
        if (savedRegion) {
          setRegionState(savedRegion);
        }

        const savedTimezone = await storage.getItem('app_timezone');
        if (savedTimezone) {
          setTimezoneState(savedTimezone);
        }

        const savedNotifications = await storage.getItem('notification_settings');
        if (savedNotifications) {
          try {
            setNotificationSettingsState(JSON.parse(savedNotifications));
          } catch (err) {
            console.error('Failed to parse notification settings:', err);
          }
        }

        const savedShowOnboarding = await storage.getItem('show_onboarding');
        if (savedShowOnboarding === 'false') {
          setShowOnboardingState(false);
        }

        const savedBiometric = await storage.getItem('enable_biometric');
        if (savedBiometric === 'true') {
          setEnableBiometricState(true);
        }
      } catch (err) {
        console.error('Failed to initialize app settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  /**
   * Toggle theme
   */
  const toggleTheme = useCallback(async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await storage.setItem('app_theme', newTheme ? 'dark' : 'light');
    } catch (err) {
      setError('Failed to update theme');
      console.error(err);
    }
  }, [isDark]);

  /**
   * Set language
   */
  const setLanguage = useCallback(async (lang: string) => {
    try {
      setLanguageState(lang);
      await storage.setItem('app_language', lang);
    } catch (err) {
      setError('Failed to update language');
      console.error(err);
    }
  }, []);

  /**
   * Set region
   */
  const setRegion = useCallback(async (reg: string) => {
    try {
      setRegionState(reg);
      await storage.setItem('app_region', reg);
    } catch (err) {
      setError('Failed to update region');
      console.error(err);
    }
  }, []);

  /**
   * Set timezone
   */
  const setTimezone = useCallback(async (tz: string) => {
    try {
      setTimezoneState(tz);
      await storage.setItem('app_timezone', tz);
    } catch (err) {
      setError('Failed to update timezone');
      console.error(err);
    }
  }, []);

  /**
   * Update notification settings
   */
  const updateNotificationSettings = useCallback(
    async (newSettings: Partial<NotificationSettings>) => {
      try {
        const updatedSettings = { ...notificationSettings, ...newSettings };
        setNotificationSettingsState(updatedSettings);
        await storage.setItem('notification_settings', JSON.stringify(updatedSettings));
      } catch (err) {
        setError('Failed to update notification settings');
        console.error(err);
      }
    },
    [notificationSettings]
  );

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Set show onboarding
   */
  const setShowOnboarding = useCallback(async (show: boolean) => {
    try {
      setShowOnboardingState(show);
      await storage.setItem('show_onboarding', show.toString());
    } catch (err) {
      setError('Failed to update onboarding setting');
      console.error(err);
    }
  }, []);

  /**
   * Set biometric enabled
   */
  const setEnableBiometric = useCallback(async (enable: boolean) => {
    try {
      setEnableBiometricState(enable);
      await storage.setItem('enable_biometric', enable.toString());
    } catch (err) {
      setError('Failed to update biometric setting');
      console.error(err);
    }
  }, []);

  const value: AppContextType = {
    isDark,
    toggleTheme,
    language,
    setLanguage,
    region,
    setRegion,
    timezone,
    setTimezone,
    notificationSettings,
    updateNotificationSettings,
    isLoading,
    error,
    clearError,
    isOfflineMode,
    setOfflineMode,
    showOnboarding,
    setShowOnboarding,
    enableBiometric,
    setEnableBiometric,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Hook to use AppContext
 */
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
