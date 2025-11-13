'use client';

import { Select, Button, Space, Slider, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useState } from 'react';

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
  { label: 'All Specializations', value: 'all' },
  { label: 'Conversational', value: 'Conversational' },
  { label: 'Business', value: 'Business' },
  { label: 'Test Preparation', value: 'Test Preparation' },
  { label: 'Academic', value: 'Academic' },
  { label: 'Kids & Teens', value: 'Kids & Teens' },
  { label: 'Job Interview', value: 'Job Interview' },
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
  const subjectOptions = [
    { label: 'All Subjects', value: 'all' },
    ...subjects.map((subj) => ({ label: subj.name, value: subj.slug })),
  ];

  const countryOptions = [
    { label: 'All Countries', value: 'all' },
    ...countries.map((ctry) => ({ label: ctry.name, value: ctry.code })),
  ];

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
          placeholder="Select subject"
        />
        
        <Select
          style={{ minWidth: 200 }}
          value={selectedCountry}
          onChange={onCountryChange}
          options={countryOptions}
          placeholder="Select country"
        />
        
        <Select
          style={{ minWidth: 200 }}
          value={selectedSpecialization}
          onChange={onSpecializationChange}
          options={specializations}
          placeholder="Select specialization"
        />

        {hasActiveFilters && (
          <Button icon={<ReloadOutlined />} onClick={onReset}>
            Reset Filters
          </Button>
        )}
      </Space>

      <div style={{ maxWidth: 400 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Price Range (per hour)</Text>
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
