'use client';

import { useState, useEffect } from 'react';
import { Layout, Typography, Card, Space, Tag, Button, Rate, Avatar, Spin, Divider, Row, Col } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, DollarOutlined, CheckCircleOutlined, StarOutlined, MessageOutlined, CalendarOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function TutorDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t } = useLanguage();
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await fetch(`/api/jobs?slug=${slug}`);
        const data = await response.json();
        if (data && data.length > 0) {
          setTutor(data[0]);
        }
      } catch (error) {
        console.error('Error fetching tutor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [slug]);

  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'TutorHub';

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  if (!tutor) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 48px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                {companyName}
              </Title>
            </Link>
            <LanguageSwitcher />
          </div>
        </Header>
        <Content style={{ padding: '48px', textAlign: 'center' }}>
          <Title level={2}>{t('tutorDetail.tutorNotFound')}</Title>
          <Paragraph>{t('tutorDetail.tutorNotFoundDesc')}</Paragraph>
          <Link href="/">
            <Button type="primary" size="large">{t('tutorDetail.backToHome')}</Button>
          </Link>
        </Content>
      </Layout>
    );
  }

  const languages = tutor.spokenLanguages ? JSON.parse(tutor.spokenLanguages) : [];

  return (
    <Layout style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Header style={{ background: '#fff', padding: '0 48px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              {companyName}
            </Title>
          </Link>
          <Space>
            <LanguageSwitcher />
            <Link href="/">
              <Button>{t('tutorDetail.backToTutors')}</Button>
            </Link>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '48px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Row gutter={24}>
          {/* Left Column - Tutor Info */}
          <Col xs={24} md={16}>
            <Card style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
                <Avatar size={120} src={tutor.avatar} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Title level={2} style={{ margin: 0 }}>
                      {tutor.firstName} {tutor.lastName}
                    </Title>
                    {tutor.isVerified && (
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />
                    )}
                  </div>
                  
                  <Space wrap style={{ marginBottom: 16 }}>
                    <Tag icon={<StarOutlined />} color="gold">
                      {tutor.rating} ({tutor.totalReviews} reviews)
                    </Tag>
                    <Tag icon={<EnvironmentOutlined />}>
                      {tutor.country?.name || 'Unknown'}
                    </Tag>
                    <Tag>{tutor.specialization}</Tag>
                    <Tag color="blue">{tutor.level}</Tag>
                  </Space>

                  <div style={{ marginBottom: 12 }}>
                    <Text strong style={{ fontSize: 16 }}>
                      {tutor.subject?.name || 'Unknown Subject'}
                    </Text>
                  </div>

                  <Space split="·" style={{ color: '#666' }}>
                    <Text>
                      <ClockCircleOutlined /> {tutor.yearsExperience} years experience
                    </Text>
                    <Text>
                      <CalendarOutlined /> {tutor.totalLessons} lessons completed
                    </Text>
                  </Space>
                </div>
              </div>
            </Card>

            {/* About */}
            <Card title={t('tutorDetail.aboutMe')} style={{ marginBottom: 24 }}>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                {tutor.bio}
              </Paragraph>
            </Card>

            {/* Teaching Style */}
            {tutor.teachingStyle && (
              <Card title={t('tutorDetail.teachingStyle')} style={{ marginBottom: 24 }}>
                <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                  {tutor.teachingStyle}
                </Paragraph>
              </Card>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <Card title={t('tutorDetail.languagesSpoken')} style={{ marginBottom: 24 }}>
                <Space wrap>
                  {languages.map((lang: string, index: number) => (
                    <Tag key={index} style={{ fontSize: 14, padding: '4px 12px' }}>
                      {lang}
                    </Tag>
                  ))}
                </Space>
              </Card>
            )}
          </Col>

          {/* Right Column - Booking Card */}
          <Col xs={24} md={8}>
            <Card style={{ position: 'sticky', top: 24 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 36, fontWeight: 'bold', color: '#1890ff', marginBottom: 8 }}>
                  ${tutor.hourlyRate}
                  <Text type="secondary" style={{ fontSize: 16, fontWeight: 'normal' }}>{t('tutorDetail.perHour')}</Text>
                </div>
                <Rate disabled value={parseFloat(tutor.rating)} allowHalf />
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary">{tutor.totalReviews} {t('tutorDetail.reviews')}</Text>
                </div>
              </div>

              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Button 
                  type="primary" 
                  size="large" 
                  block
                  icon={<CalendarOutlined />}
                >
                  {t('tutorDetail.bookTrialLesson')}
                </Button>
                <Button 
                  size="large" 
                  block
                  icon={<MessageOutlined />}
                >
                  {t('tutorDetail.sendMessage')}
                </Button>
              </Space>

              <Divider />

              <div>
                <Title level={5}>{t('tutorDetail.whyChooseMe')}</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {tutor.isVerified && (
                    <div>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                      <Text>{t('tutorDetail.verifiedTutor')}</Text>
                    </div>
                  )}
                  <div>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                    <Text>{tutor.totalLessons}+ {t('tutorDetail.lessonsCompleted')}</Text>
                  </div>
                  <div>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                    <Text>{t('tutorDetail.responseWithin24')}</Text>
                  </div>
                  {tutor.yearsExperience > 0 && (
                    <div>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                      <Text>{tutor.yearsExperience} {t('tutorDetail.yearsExperience')}</Text>
                    </div>
                  )}
                </Space>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#001529', color: 'rgba(255,255,255,0.65)' }}>
        <Space split="·">
          <Text style={{ color: 'rgba(255,255,255,0.65)' }}>© 2024 {companyName}</Text>
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.65)' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'rgba(255,255,255,0.65)' }}>Terms of Service</Link>
        </Space>
      </Footer>
    </Layout>
  );
}
