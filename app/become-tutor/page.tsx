'use client';

import { Layout, Typography, Button, Card, Row, Col, Space, Input, Form, Steps } from 'antd';
import { CheckCircleOutlined, RocketOutlined, DollarOutlined, ClockCircleOutlined, StarOutlined, TeamOutlined, SafetyOutlined, GlobalOutlined } from '@ant-design/icons';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function BecomeTutorPage() {
  const { t } = useLanguage();
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'TutorHub';

  const benefits = [
    {
      icon: <DollarOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
      title: t('becomeTutor.benefits.extraIncome.title'),
      description: t('becomeTutor.benefits.extraIncome.desc')
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      title: t('becomeTutor.benefits.flexible.title'),
      description: t('becomeTutor.benefits.flexible.desc')
    },
    {
      icon: <TeamOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
      title: t('becomeTutor.benefits.globalReach.title'),
      description: t('becomeTutor.benefits.globalReach.desc')
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 48, color: '#fa8c16' }} />,
      title: t('becomeTutor.benefits.secure.title'),
      description: t('becomeTutor.benefits.secure.desc')
    },
  ];

  const steps = [
    {
      title: t('becomeTutor.steps.step1Title'),
      description: t('becomeTutor.steps.step1Desc')
    },
    {
      title: t('becomeTutor.steps.step2Title'),
      description: t('becomeTutor.steps.step2Desc')
    },
    {
      title: t('becomeTutor.steps.step3Title'),
      description: t('becomeTutor.steps.step3Desc')
    },
    {
      title: t('becomeTutor.steps.step4Title'),
      description: t('becomeTutor.steps.step4Desc')
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Header */}
      <Header style={{ background: '#fff', padding: '0 48px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              {companyName}
            </Title>
          </Link>
          <Space>
            <LanguageSwitcher />
            <Link href="/login">
              <Button>Log In</Button>
            </Link>
          </Space>
        </div>
      </Header>

      <Content>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 48px',
          color: 'white',
          textAlign: 'center'
        }}>
          <Title level={1} style={{ color: 'white', fontSize: 52, marginBottom: 16 }}>
            {t('becomeTutor.heroTitle')}
          </Title>
          <Paragraph style={{ fontSize: 20, color: 'rgba(255,255,255,0.95)', marginBottom: 32, maxWidth: 700, margin: '0 auto 32px' }}>
            {t('becomeTutor.heroSubtitle')}
          </Paragraph>
          <Space size="large">
            <Button type="primary" size="large" style={{ height: 50, paddingLeft: 40, paddingRight: 40, borderRadius: 25, background: '#fff', color: '#667eea', border: 'none', fontSize: 16, fontWeight: 600 }}>
              {t('becomeTutor.getStarted')}
            </Button>
            <Button size="large" style={{ height: 50, paddingLeft: 40, paddingRight: 40, borderRadius: 25, background: 'transparent', color: '#fff', borderColor: '#fff', fontSize: 16 }}>
              {t('becomeTutor.learnMore')}
            </Button>
          </Space>
        </div>

        {/* Stats Section */}
        <div style={{ background: '#f9f9f9', padding: '48px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Row gutter={32} style={{ textAlign: 'center' }}>
              <Col xs={24} sm={8}>
                <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>10,000+</Title>
                <Text style={{ fontSize: 16 }}>{t('becomeTutor.stats.activeTutors')}</Text>
              </Col>
              <Col xs={24} sm={8}>
                <Title level={2} style={{ color: '#52c41a', marginBottom: 8 }}>$45/hr</Title>
                <Text style={{ fontSize: 16 }}>{t('becomeTutor.stats.avgEarnings')}</Text>
              </Col>
              <Col xs={24} sm={8}>
                <Title level={2} style={{ color: '#faad14', marginBottom: 8 }}>4.9/5</Title>
                <Text style={{ fontSize: 16 }}>{t('becomeTutor.stats.tutorRating')}</Text>
              </Col>
            </Row>
          </div>
        </div>

        {/* Benefits Section */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48, fontSize: 38 }}>
            {t('becomeTutor.whyBecome')}
          </Title>
          <Row gutter={[32, 32]}>
            {benefits.map((benefit, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 100,
                    height: 100,
                    margin: '0 auto 24px',
                    background: '#f0f0f0',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {benefit.icon}
                  </div>
                  <Title level={4}>{benefit.title}</Title>
                  <Text type="secondary">{benefit.description}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* How It Works */}
        <div style={{ background: '#f9f9f9', padding: '80px 24px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 48, fontSize: 38 }}>
              {t('becomeTutor.howItWorks')}
            </Title>
            <Steps
              direction="vertical"
              current={-1}
              items={steps.map((step, index) => ({
                title: <Title level={4}>{step.title}</Title>,
                description: <Text style={{ fontSize: 16 }}>{step.description}</Text>,
                icon: <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#1890ff',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 'bold'
                }}>{index + 1}</div>
              }))}
            />
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48, fontSize: 38 }}>
            {t('becomeTutor.testimonials.title')}
          </Title>
          <Row gutter={[24, 24]}>
            {[
              {
                name: t('becomeTutor.testimonials.sarah.name'),
                role: t('becomeTutor.testimonials.sarah.role'),
                avatar: 'https://i.pravatar.cc/150?img=1',
                quote: t('becomeTutor.testimonials.sarah.quote')
              },
              {
                name: t('becomeTutor.testimonials.david.name'),
                role: t('becomeTutor.testimonials.david.role'),
                avatar: 'https://i.pravatar.cc/150?img=14',
                quote: t('becomeTutor.testimonials.david.quote')
              },
              {
                name: t('becomeTutor.testimonials.maria.name'),
                role: t('becomeTutor.testimonials.maria.role'),
                avatar: 'https://i.pravatar.cc/150?img=5',
                quote: t('becomeTutor.testimonials.maria.quote')
              },
            ].map((testimonial, index) => (
              <Col xs={24} md={8} key={index}>
                <Card style={{ height: '100%', borderRadius: 12 }}>
                  <Space direction="vertical" size="middle">
                    <Space>
                      <img src={testimonial.avatar} alt={testimonial.name} style={{ width: 60, height: 60, borderRadius: '50%' }} />
                      <div>
                        <Text strong style={{ display: 'block', fontSize: 16 }}>{testimonial.name}</Text>
                        <Text type="secondary">{testimonial.role}</Text>
                      </div>
                    </Space>
                    <div style={{ display: 'flex', color: '#faad14' }}>
                      {[...Array(5)].map((_, i) => <StarOutlined key={i} />)}
                    </div>
                    <Text style={{ fontSize: 15, fontStyle: 'italic' }}>"{testimonial.quote}"</Text>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Final CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 48px',
          textAlign: 'center'
        }}>
          <Title level={2} style={{ color: 'white', fontSize: 42, marginBottom: 16 }}>
            {t('becomeTutor.finalCTA.title')}
          </Title>
          <Paragraph style={{ fontSize: 18, color: 'rgba(255,255,255,0.95)', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
            {t('becomeTutor.finalCTA.subtitle')}
          </Paragraph>
          <Link href="/signup">
            <Button type="primary" size="large" style={{
              height: 56,
              paddingLeft: 48,
              paddingRight: 48,
              borderRadius: 28,
              background: '#fff',
              color: '#667eea',
              border: 'none',
              fontSize: 18,
              fontWeight: 600
            }}>
              {t('becomeTutor.finalCTA.createProfile')} <RocketOutlined />
            </Button>
          </Link>
          <div style={{ marginTop: 24 }}>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
              {t('becomeTutor.finalCTA.alreadyHaveAccount')} <Link href="/login" style={{ color: 'white', textDecoration: 'underline' }}>{t('navigation.login')}</Link>
            </Text>
          </div>
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', background: '#001529', color: 'rgba(255,255,255,0.65)', padding: '40px 48px' }}>
        <Space split="·" size="large">
          <Text style={{ color: 'rgba(255,255,255,0.65)' }}>{t('becomeTutor.footer.copyright')} {companyName}</Text>
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.65)' }}>{t('becomeTutor.footer.privacy')}</Link>
          <Link href="/terms" style={{ color: 'rgba(255,255,255,0.65)' }}>{t('becomeTutor.footer.terms')}</Link>
          <Link href="/help" style={{ color: 'rgba(255,255,255,0.65)' }}>{t('becomeTutor.footer.help')}</Link>
        </Space>
      </Footer>
    </Layout>
  );
}
