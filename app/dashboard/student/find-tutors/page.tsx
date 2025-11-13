'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Typography, Input, Space, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TutorFilters from '@/components/filters/JobFilters';
import TutorList from '@/components/job-list/JobList';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

export default function StudentFindTutorsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tutorsRes, subjectsRes, countriesRes] = await Promise.all([
        fetch('/api/tutors'),
        fetch('/api/subjects'),
        fetch('/api/countries'),
      ]);

      const tutorsData = await tutorsRes.json();
      const subjectsData = await subjectsRes.json();
      const countriesData = await countriesRes.json();

      setTutors(tutorsData.filter((t: any) => t.isActive && t.isVerified));
      setSubjects(subjectsData);
      setCountries(countriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSubject('all');
    setSelectedCountry('all');
    setSelectedSpecialization('all');
    setPriceRange([0, 100]);
    setSearchQuery('');
  };

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout role="student" user={{ name: '', email: '', avatar: '' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = {
    name: session.user.name || '',
    email: session.user.email || '',
    avatar: session.user.image || '',
  };

  // Filter tutors
  const filteredTutors = tutors.filter((tutor: any) => {
    const matchesSearch = searchQuery === '' || 
      `${tutor.firstName} ${tutor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subject?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || tutor.subjectId === parseInt(selectedSubject);
    const matchesCountry = selectedCountry === 'all' || tutor.countryId === parseInt(selectedCountry);
    const matchesSpecialization = selectedSpecialization === 'all' || tutor.specialization === selectedSpecialization;
    const matchesPrice = parseFloat(tutor.hourlyRate) >= priceRange[0] && parseFloat(tutor.hourlyRate) <= priceRange[1];

    return matchesSearch && matchesSubject && matchesCountry && matchesSpecialization && matchesPrice;
  });

  return (
    <DashboardLayout role="student" user={user}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2}>{t('student.findTutorsPage.title')}</Title>
        <Paragraph type="secondary">
          {t('student.findTutorsPage.subtitle')}
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Search Bar */}
        <Input
          size="large"
          placeholder={t('student.findTutorsPage.searchPlaceholder')}
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: 600 }}
        />

        {/* Filters */}
        <TutorFilters
          subjects={subjects}
          countries={countries}
          selectedSubject={selectedSubject}
          selectedCountry={selectedCountry}
          selectedSpecialization={selectedSpecialization}
          priceRange={priceRange}
          onSubjectChange={setSelectedSubject}
          onCountryChange={setSelectedCountry}
          onSpecializationChange={setSelectedSpecialization}
          onPriceChange={setPriceRange}
          onReset={handleReset}
        />

        {/* Tutor List */}
        <TutorList tutors={filteredTutors} />
      </Space>
    </DashboardLayout>
  );
}
