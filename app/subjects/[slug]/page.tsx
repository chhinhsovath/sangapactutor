'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Layout, Typography, Breadcrumb, Spin, Space, Input, Empty, Row, Col, Card, Avatar, Rate, Tag } from 'antd';
import { SearchOutlined, HeartOutlined, HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import TutorFilters from '@/components/filters/JobFilters';
import TutorList from '@/components/job-list/JobList';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TutorWithDetails } from '@/lib/types';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

interface Subject {
  id: number;
  name: string;
  nameKh: string | null;
  nameEn: string | null;
  slug: string;
  icon: string | null;
}

export default function SubjectPage() {
  const { t, locale } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [tutors, setTutors] = useState<TutorWithDetails[]>([]);
  const [countries, setCountries] = useState<Array<{ id: number; name: string; code: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [subjectNotFound, setSubjectNotFound] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    fetchSubjectAndTutors();
    fetchCountries();
  }, [slug]);

  useEffect(() => {
    if (subject) {
      fetchTutors();
    }
  }, [subject, selectedCountry, selectedSpecialization, priceRange]);

  const fetchSubjectAndTutors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/subjects/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setSubject(data);
        setSubjectNotFound(false);
      } else {
        setSubjectNotFound(true);
      }
    } catch (error) {
      console.error('Failed to fetch subject:', error);
      setSubjectNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/locations');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Failed to fetch countries');
    }
  };

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('subject', slug);
      if (selectedCountry !== 'all') params.append('country', selectedCountry);
      if (selectedSpecialization !== 'all') params.append('specialization', selectedSpecialization);
      if (priceRange[0] > 0) params.append('priceMin', priceRange[0].toString());
      if (priceRange[1] < 100) params.append('priceMax', priceRange[1].toString());

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = await response.json();
      setTutors(data);
    } catch (error) {
      console.error('Failed to fetch tutors');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedCountry('all');
    setSelectedSpecialization('all');
    setPriceRange([0, 100]);
  };

  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'TutorHub';
  const companyWebsite = process.env.NEXT_PUBLIC_COMPANY_WEBSITE || '#';

  // Get localized subject name
  const getSubjectName = () => {
    if (!subject) return '';
    if (locale === 'km' && subject.nameKh) return subject.nameKh;
    if (locale === 'en' && subject.nameEn) return subject.nameEn;
    return subject.name || subject.nameEn || subject.nameKh || slug;
  };

  if (loading && !subject) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  if (subjectNotFound) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#fff' }}>
        <Header style={{ background: '#fff', padding: '0 48px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <Link href={companyWebsite} target="_blank" style={{ textDecoration: 'none' }}>
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                {companyName}
              </Title>
            </Link>
            <Space>
              <LanguageSwitcher />
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Text>{t('navigation.login')}</Text>
              </Link>
            </Space>
          </div>
        </Header>
        <Content style={{ padding: '100px 24px', textAlign: 'center' }}>
          <Empty
            description={
              <span>
                <Title level={3}>{t('subjects.subjectNotFound')}</Title>
                <Text type="secondary">{t('subjects.subjectNotFoundDesc')}</Text>
              </span>
            }
          />
          <Link href="/">
            <Text style={{ color: '#1890ff', fontSize: 16 }}>{t('tutorDetail.backToHome')}</Text>
          </Link>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header style={{ background: '#fff', padding: '0 48px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <Link href={companyWebsite} target="_blank" style={{ textDecoration: 'none' }}>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              {companyName}
            </Title>
          </Link>
          <Space>
            <LanguageSwitcher />
            <Link href="/become-tutor" style={{ textDecoration: 'none' }}>
              <Text>{t('navigation.becomeTutor')}</Text>
            </Link>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Text>{t('navigation.login')}</Text>
            </Link>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '24px 48px', background: '#f9f9f9' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <Breadcrumb style={{ marginBottom: 24 }}>
            <Breadcrumb.Item>
              <Link href="/">
                <HomeOutlined /> {t('navigation.home')}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link href="/#subjects">{t('subjects.allSubjects')}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{getSubjectName()}</Breadcrumb.Item>
          </Breadcrumb>

          {/* Subject Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '48px',
            borderRadius: 16,
            marginBottom: 32,
            textAlign: 'center'
          }}>
            {subject?.icon && (
              <div style={{ fontSize: 64, marginBottom: 16 }}>{subject.icon}</div>
            )}
            <Title level={1} style={{ color: 'white', margin: 0, marginBottom: 8 }}>
              {getSubjectName()}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18 }}>
              {tutors.length}+ {t('subjects.tutorsAvailable')}
            </Text>
          </div>

          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Filters */}
            <div style={{ background: 'white', padding: '24px', borderRadius: 8 }}>
              <Title level={4} style={{ marginBottom: 16 }}>{t('home.filterTutors')}</Title>
              <TutorFilters
                subjects={[]} // Hide subject filter since we're already filtering by subject
                countries={countries}
                selectedSubject={slug}
                selectedCountry={selectedCountry}
                selectedSpecialization={selectedSpecialization}
                priceRange={priceRange}
                onSubjectChange={() => {}} // Disabled
                onCountryChange={setSelectedCountry}
                onSpecializationChange={setSelectedSpecialization}
                onPriceChange={setPriceRange}
                onReset={handleReset}
              />
            </div>

            {/* Tutors List */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: 8 }}>
                <Spin size="large" />
              </div>
            ) : tutors.length === 0 ? (
              <div style={{ background: 'white', padding: '60px', borderRadius: 8, textAlign: 'center' }}>
                <Empty description={t('subjects.noTutorsFound')} />
              </div>
            ) : (
              <>
                {/* Featured Tutors Grid */}
                <Row gutter={[16, 16]}>
                  {tutors.map((tutor) => (
                    <Col xs={24} sm={12} md={8} key={tutor.id}>
                      <Link href={`/tutors/${tutor.slug}`} style={{ textDecoration: 'none' }}>
                        <Card
                          hoverable
                          cover={
                            <div style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
                              <img
                                alt={`${tutor.firstName} ${tutor.lastName}`}
                                src={tutor.avatar || 'https://i.pravatar.cc/400'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                              <div style={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                background: 'white',
                                borderRadius: '50%',
                                width: 40,
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                              }}>
                                <HeartOutlined style={{ fontSize: 20, color: '#ff6b6b' }} />
                              </div>
                              <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                color: 'white',
                                padding: '24px 16px 16px'
                              }}>
                                <Title level={4} style={{ color: 'white', margin: 0 }}>
                                  {tutor.firstName}
                                </Title>
                                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>
                                  {tutor.country?.name} (online)
                                </Text>
                              </div>
                            </div>
                          }
                          styles={{ body: { padding: '16px' } }}
                        >
                          <div style={{ marginBottom: 8 }}>
                            <Rate disabled value={parseFloat(tutor.rating || '0')} style={{ fontSize: 14 }} />
                            <Text strong style={{ marginLeft: 8 }}>{tutor.rating}</Text>
                            <Text type="secondary" style={{ marginLeft: 4 }}>({tutor.totalReviews})</Text>
                          </div>
                          <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 15 }}>
                            {tutor.specialization}
                          </Text>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                              ${tutor.hourlyRate}/h
                            </Text>
                            {tutor.isVerified && (
                              <Tag color="purple">⭐ Ambassador</Tag>
                            )}
                          </div>
                        </Card>
                      </Link>
                    </Col>
                  ))}
                </Row>

                {/* Full List View */}
                <div style={{ marginTop: 32 }}>
                  <TutorList tutors={tutors} />
                </div>
              </>
            )}
          </Space>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#001529', color: 'rgba(255,255,255,0.65)' }}>
        <Space split="·">
          <Text style={{ color: 'rgba(255,255,255,0.65)' }}>© 2024 {companyName}</Text>
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.65)' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'rgba(255,255,255,0.65)' }}>Terms of Service</Link>
          <Link href="/help" style={{ color: 'rgba(255,255,255,0.65)' }}>Help Center</Link>
        </Space>
      </Footer>
    </Layout>
  );
}
