/**
 * SettingsLanguageScreen Component (Phase 5 - Tier 3)
 * Language and localization settings
 * Adapted from EducatePro template
 *
 * Features:
 * - Language selection with radio buttons
 * - Region selection
 * - Timezone configuration
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

interface SettingsLanguageScreenProps {
  navigation: any;
}

const LANGUAGES = [
  { id: '1', name: 'English', code: 'en' },
  { id: '2', name: 'Spanish', code: 'es' },
  { id: '3', name: 'French', code: 'fr' },
  { id: '4', name: 'German', code: 'de' },
  { id: '5', name: 'Chinese', code: 'zh' },
  { id: '6', name: 'Japanese', code: 'ja' },
];

const REGIONS = [
  { id: '1', name: 'United States', flag: '🇺🇸' },
  { id: '2', name: 'United Kingdom', flag: '🇬🇧' },
  { id: '3', name: 'Canada', flag: '🇨🇦' },
  { id: '4', name: 'Australia', flag: '🇦🇺' },
  { id: '5', name: 'Germany', flag: '🇩🇪' },
  { id: '6', name: 'France', flag: '🇫🇷' },
];

const TIMEZONES = [
  { id: '1', name: 'UTC-8 (PST)', offset: '-8' },
  { id: '2', name: 'UTC-5 (EST)', offset: '-5' },
  { id: '3', name: 'UTC+0 (GMT)', offset: '0' },
  { id: '4', name: 'UTC+1 (CET)', offset: '+1' },
  { id: '5', name: 'UTC+8 (CST)', offset: '+8' },
  { id: '6', name: 'UTC+9 (JST)', offset: '+9' },
];

const SettingsLanguageScreen = ({ navigation }: SettingsLanguageScreenProps) => {
  const [isDark] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('1');
  const [selectedRegion, setSelectedRegion] = useState('1');
  const [selectedTimezone, setSelectedTimezone] = useState('1');

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
        Language & Region
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );

  /**
   * Render selection list
   */
  const renderSelectionList = ({ title, items, selectedId, onSelect, showFlag }: any) => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        {title}
      </Text>

      {items.map((item: any) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onSelect(item.id)}
          style={[
            styles.optionItem,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
          activeOpacity={0.7}
        >
          <View style={styles.optionContent}>
            {showFlag && (
              <Text style={styles.flag}>{item.flag}</Text>
            )}
            <View style={styles.optionText}>
              <Text
                style={[
                  styles.optionName,
                  {
                    color: isDark ? COLORS.white : COLORS.black,
                  },
                ]}
              >
                {item.name}
              </Text>
              {item.offset && (
                <Text
                  style={[
                    styles.optionSubtext,
                    {
                      color: isDark ? COLORS.gray : COLORS.greyscale600,
                    },
                  ]}
                >
                  {item.offset}
                </Text>
              )}
              {item.code && (
                <Text
                  style={[
                    styles.optionSubtext,
                    {
                      color: isDark ? COLORS.gray : COLORS.greyscale600,
                    },
                  ]}
                >
                  {item.code.toUpperCase()}
                </Text>
              )}
            </View>
          </View>

          <View
            style={[
              styles.radio,
              selectedId === item.id && styles.radioSelected,
              {
                borderColor:
                  selectedId === item.id ? COLORS.primary : COLORS.greyscale300,
              },
            ]}
          >
            {selectedId === item.id && (
              <View
                style={[
                  styles.radioDot,
                  { backgroundColor: COLORS.primary },
                ]}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
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
        {renderSelectionList({
          title: 'Language',
          items: LANGUAGES,
          selectedId: selectedLanguage,
          onSelect: setSelectedLanguage,
        })}

        {renderSelectionList({
          title: 'Region',
          items: REGIONS,
          selectedId: selectedRegion,
          onSelect: setSelectedRegion,
          showFlag: true,
        })}

        {renderSelectionList({
          title: 'Timezone',
          items: TIMEZONES,
          selectedId: selectedTimezone,
          onSelect: setSelectedTimezone,
        })}
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
  section: {
    marginBottom: SIZES.padding * 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SIZES.padding2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: SIZES.padding2,
  },
  optionText: {
    flex: 1,
  },
  optionName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtext: {
    fontSize: 11,
    fontWeight: '500',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderWidth: 2,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default SettingsLanguageScreen;
