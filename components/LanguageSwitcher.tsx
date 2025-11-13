'use client';

import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <Select
      value={locale}
      onChange={setLocale}
      style={{ width: 120, marginRight: 16 }}
      suffixIcon={<GlobalOutlined />}
      options={[
        { value: 'km', label: '🇰🇭 ខ្មែរ' },
        { value: 'en', label: '🇺🇸 English' },
      ]}
    />
  );
}
