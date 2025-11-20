import 'intl-pluralrules';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';

import en from './locales/en';
import km from './locales/km';

const STORE_LANGUAGE_KEY = 'settings.lang';

const languageDetector: any = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: (lang: string) => void) => {
        try {
            const language = await SecureStore.getItemAsync(STORE_LANGUAGE_KEY);
            if (language) {
                return callback(language);
            }
        } catch (error) {
            console.log('Error reading language', error);
        }
        return callback('km'); // Default to Khmer
    },
    init: () => { },
    cacheUserLanguage: async (language: string) => {
        try {
            await SecureStore.setItemAsync(STORE_LANGUAGE_KEY, language);
        } catch (error) {
            console.log('Error saving language', error);
        }
    },
};

const resources = {
    en: {
        translation: en,
    },
    km: {
        translation: km,
    },
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        compatibilityJSON: 'v4',
        react: {
            useSuspense: false,
        },
    });

export default i18n;
