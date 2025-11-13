'use client';

import { useState, useEffect } from 'react';
import { Layout, Typography, Space, Spin, Input, Button, Card, Row, Col, Avatar, Rate, Tag } from 'antd';
import { SearchOutlined, CheckCircleOutlined, UserOutlined, CalendarOutlined, StarOutlined, BookOutlined, GlobalOutlined, CalculatorOutlined, ExperimentOutlined, CodeOutlined, BulbOutlined, ToolOutlined, HeartOutlined, RightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import TutorFilters from '@/components/filters/JobFilters';
import TutorList from '@/components/job-list/JobList';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TutorWithDetails } from '@/lib/types';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function Home() {
  const { t } = useLanguage();
  const [tutors, setTutors] = useState<TutorWithDetails[]>([]);
  const [subjects, setSubjects] = useState<Array<{ id: number; name: string; slug: string }>>([]);
  const [countries, setCountries] = useState<Array<{ id: number; name: string; code: string }>>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    // Fetch initial data
    Promise.all([
      fetch('/api/departments').then(r => r.json()),
      fetch('/api/locations').then(r => r.json()),
    ]).then(([subjs, ctries]) => {
      setSubjects(subjs);
      setCountries(ctries);
    });
  }, []);

  useEffect(() => {
    // Fetch tutors with filters
    const params = new URLSearchParams();
    if (selectedSubject !== 'all') params.append('subject', selectedSubject);
    if (selectedCountry !== 'all') params.append('country', selectedCountry);
    if (selectedSpecialization !== 'all') params.append('specialization', selectedSpecialization);
    if (priceRange[0] > 0) params.append('priceMin', priceRange[0].toString());
    if (priceRange[1] < 100) params.append('priceMax', priceRange[1].toString());

    let cancelled = false;

    const fetchTutors = async () => {
      setLoading(true);
      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = await response.json();
      if (!cancelled) {
        setTutors(data);
        setLoading(false);
      }
    };

    fetchTutors();

    return () => {
      cancelled = true;
    };
  }, [selectedSubject, selectedCountry, selectedSpecialization, priceRange]);

  const handleReset = () => {
    setSelectedSubject('all');
    setSelectedCountry('all');
    setSelectedSpecialization('all');
    setPriceRange([0, 100]);
  };

  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'TutorHub';
  const companyWebsite = process.env.NEXT_PUBLIC_COMPANY_WEBSITE || '#';

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

      {/* Hero Section - Simplified like Superprof */}
      <div style={{ 
        background: '#fff',
        padding: '80px 48px 40px',
        textAlign: 'center'
      }}>
        <Title level={1} style={{ marginBottom: 32, fontSize: 52, fontWeight: 700 }}>
          {t('home.title')}
        </Title>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Input
            size="large"
            placeholder={t('home.searchPlaceholder')}
            prefix={<SearchOutlined />}
            style={{ height: 56, fontSize: 16, borderRadius: 28, border: '2px solid #f0f0f0' }}
            suffix={
              <Button type="primary" size="large" style={{ borderRadius: 20, background: '#ff6b6b' }}>
                {t('common.search')}
              </Button>
            }
          />
        </div>
        
        {/* Horizontal Scrolling Subjects */}
        <div style={{ 
          marginTop: 40,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          padding: '10px 0',
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {[
            { icon: <CalculatorOutlined />, name: t('home.subjects.mathematics'), color: '#52c41a' },
            { icon: <BookOutlined />, name: t('home.subjects.english'), color: '#1890ff' },
            { icon: <CodeOutlined />, name: t('home.subjects.programming'), color: '#fa8c16' },
            { icon: <ExperimentOutlined />, name: t('home.subjects.science'), color: '#722ed1' },
            { icon: <StarOutlined />, name: t('home.subjects.music'), color: '#faad14' },
            { icon: <GlobalOutlined />, name: t('home.subjects.languages'), color: '#13c2c2' },
            { icon: <BulbOutlined />, name: t('home.subjects.business'), color: '#eb2f96' },
          ].map((subject, idx) => (
            <Button
              key={idx}
              size="large"
              style={{ 
                borderRadius: 24, 
                border: `2px solid ${subject.color}`,
                color: subject.color,
                whiteSpace: 'nowrap'
              }}
              icon={subject.icon}
            >
              {subject.name}
            </Button>
          ))}
        </div>
      </div>

      <Content style={{ padding: '0', background: '#f9f9f9' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            
            {/* Featured Tutors with Large Photos - Superprof Style */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>⭐ {tutors.length}+ {t('home.expertTutors')}</Title>
              </div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Row gutter={[16, 16]}>
                  {tutors.slice(0, 6).map((tutor) => (
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
                            {tutor.subject?.name} - {tutor.specialization}
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
              )}
            </div>

            {/* Become a Tutor CTA - Superprof Style */}
            <Card
              style={{
                background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
                border: 'none',
                borderRadius: 16,
                overflow: 'hidden',
                marginTop: 40
              }}
              styles={{ body: { padding: 0 } }}
            >
              <Row>
                <Col xs={24} md={12}>
                  <div style={{ padding: '48px' }}>
                    <Title level={2} style={{ marginBottom: 16 }}>You can become a great tutor too!</Title>
                    <Text style={{ fontSize: 16, display: 'block', marginBottom: 24 }}> Share your knowledge, live from your passion and be your own boss
                    </Text>
                    <Button
                      type="primary"
                      size="large"
                      style={{ background: '#000', borderColor: '#000', borderRadius: 24, height: 48, paddingLeft: 32, paddingRight: 32 }}
                    >
                      <Link href="/become-tutor" style={{ color: 'white', textDecoration: 'none' }}>
                        Find out more <RightOutlined />
                      </Link>
                    </Button>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                    alt="Become a tutor"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 300 }}
                  />
                </Col>
              </Row>
            </Card>

            {/* How It Works */}
            <div style={{ background: 'white', padding: '48px 24px', borderRadius: 12, marginTop: 40 }}>
              <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>{t('home.howItWorks')}</Title>
              <Row gutter={32}>
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      background: '#e6f7ff', 
                      borderRadius: '50%', 
                      width: 80, 
                      height: 80, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 16px'
                    }}>
                      <SearchOutlined style={{ fontSize: 36, color: '#1890ff' }} />
                    </div>
                    <Title level={4}>{t('home.steps.step1Title')}</Title>
                    <Text type="secondary">{t('home.steps.step1Desc')}</Text>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      background: '#f6ffed', 
                      borderRadius: '50%', 
                      width: 80, 
                      height: 80, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 16px'
                    }}>
                      <CalendarOutlined style={{ fontSize: 36, color: '#52c41a' }} />
                    </div>
                    <Title level={4}>{t('home.steps.step2Title')}</Title>
                    <Text type="secondary">{t('home.steps.step2Desc')}</Text>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      background: '#fff7e6', 
                      borderRadius: '50%', 
                      width: 80, 
                      height: 80, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 16px'
                    }}>
                      <StarOutlined style={{ fontSize: 36, color: '#faad14' }} />
                    </div>
                    <Title level={4}>{t('home.steps.step3Title')}</Title>
                    <Text type="secondary">{t('home.steps.step3Desc')}</Text>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Stats */}
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '40px 24px',
              borderRadius: 12,
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div>
                <Title level={2} style={{ margin: 0, color: 'white' }}>{tutors.length}+</Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>{t('home.expertTutors')}</Text>
              </div>
              <div>
                <Title level={2} style={{ margin: 0, color: 'white' }}>5,000+</Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>{t('home.lessonsCompleted')}</Text>
              </div>
              <div>
                <Title level={2} style={{ margin: 0, color: 'white' }}>4.9</Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>{t('home.averageRating')}</Text>
              </div>
              <div>
                <Title level={2} style={{ margin: 0, color: 'white' }}>98%</Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>{t('home.satisfactionRate')}</Text>
              </div>
            </div>

            {/* Filters */}
            <div style={{ background: 'white', padding: '24px', borderRadius: 8 }}>
              <Title level={4} style={{ marginBottom: 16 }}>{t('home.filterTutors')}</Title>
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
            </div>

            {/* Tutor List */}
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 8 }}>
                  <Spin size="large" />
                </div>
              ) : (
                <TutorList tutors={tutors} />
              )}
            </div>
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
