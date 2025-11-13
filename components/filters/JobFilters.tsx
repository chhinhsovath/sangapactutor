'use client';

import { Select, Button, Space, Slider, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const { Text } = Typography;

interface TutorFiltersProps {
  subjects: Array<{ id: number; name: string; slug: string }>;
  countries: Array<{ id: number; name: string; code: string }>;
  selectedSubject: string;
  selectedCountry: string;
  selectedSpecialization: string;
  priceRange: [number, number];
  onSubjectChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onSpecializationChange: (value: string) => void;
  onPriceChange: (value: [number, number]) => void;
  onReset: () => void;
}

const specializations = [
  { label: '', value: 'all', key: 'allSpecializations' },
  { label: '', value: 'Conversational', key: 'conversational' },
  { label: '', value: 'Business', key: 'business' },
  { label: '', value: 'Test Preparation', key: 'testPreparation' },
  { label: '', value: 'Academic', key: 'academic' },
  { label: '', value: 'Kids & Teens', key: 'kidsTeens' },
  { label: '', value: 'Job Interview', key: 'jobInterview' },
];

export default function TutorFilters({
  subjects,
  countries,
  selectedSubject,
  selectedCountry,
  selectedSpecialization,
  priceRange,
  onSubjectChange,
  onCountryChange,
  onSpecializationChange,
  onPriceChange,
  onReset,
}: TutorFiltersProps) {
  const { t } = useLanguage();
  
  const subjectOptions = [
    { label: t('home.allSubjects'), value: 'all' },
    ...subjects.map((subj) => ({ label: subj.name, value: subj.slug })),
  ];

  const countryOptions = [
    { label: t('home.allCountries'), value: 'all' },
    ...countries.map((ctry) => ({ label: ctry.name, value: ctry.code })),
  ];

  const specializationOptions = specializations.map((spec) => ({
    label: spec.key ? t(`home.${spec.key}`) : spec.label,
    value: spec.value,
  }));

  const hasActiveFilters = 
    selectedSubject !== 'all' || 
    selectedCountry !== 'all' || 
    selectedSpecialization !== 'all' ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 100;

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Space size="middle" wrap>
        <Select
          style={{ minWidth: 200 }}
          value={selectedSubject}
          onChange={onSubjectChange}
          options={subjectOptions}
          placeholder={t('home.selectSubject')}
        />
        
        <Select
          style={{ minWidth: 200 }}
          value={selectedCountry}
          onChange={onCountryChange}
          options={countryOptions}
          placeholder={t('home.selectCountry')}
        />
        
        <Select
          style={{ minWidth: 200 }}
          value={selectedSpecialization}
          onChange={onSpecializationChange}
          options={specializationOptions}
          placeholder={t('home.selectSpecialization')}
        />

        {hasActiveFilters && (
          <Button icon={<ReloadOutlined />} onClick={onReset}>
            {t('home.resetFilters')}
          </Button>
        )}
      </Space>

      <div style={{ maxWidth: 400 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>{t('home.priceRange')}</Text>
        <Slider
          range
          min={0}
          max={100}
          value={priceRange}
          onChange={(value) => onPriceChange(value as [number, number])}
          marks={{
            0: '$0',
            25: '$25',
            50: '$50',
            75: '$75',
            100: '$100+',
          }}
        />
      </div>
    </Space>
  );
}
