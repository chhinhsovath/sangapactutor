'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Tag, Timeline, Space, App, Spin } from 'antd';
import { TrophyOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const { Title, Text } = Typography;

interface Partnership {
  id: number;
  tier: string;
  studentsLimit: number | null;
  creditsPerYearLimit: number | null;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  status: string;
}

interface InstitutionPartnershipData {
  currentPartnership: Partnership | null;
  history: Partnership[];
  stats: {
    totalStudentsEnrolled: number;
    creditsUsedThisYear: string;
    remainingCapacity: number | null;
  };
}

export default function PartnershipsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [data, setData] = useState<InstitutionPartnershipData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.institutionId) {
      fetchPartnerships();
    }
  }, [status, session]);

  const fetchPartnerships = async () => {
    if (!session?.user?.institutionId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/institutions/${session.user.institutionId}/partnerships`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      message.error(t('errors.fetchFailed') || 'Failed to fetch partnership data');
      console.error('Error fetching partnerships:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      free: 'default',
      basic: 'blue',
      premium: 'purple',
      enterprise: 'gold',
    };
    return colors[tier] || 'default';
  };

  if (status === 'loading' || loading) {
    return (
      <App>
        <DashboardLayout role={session?.user?.role as any || 'faculty_coordinator'} user={{
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          avatar: session?.user?.avatar,
        }}>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Spin size="large" />
          </div>
        </DashboardLayout>
      </App>
    );
  }

  const user = {
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    avatar: session?.user?.avatar,
  };

  return (
    <App>
      <DashboardLayout role={session?.user?.role as any || 'faculty_coordinator'} user={user}>
        <div style={{ padding: '24px' }}>
          <Title level={2}>{t('institution.partnerships') || 'Partnerships'} / Partnerships</Title>

          {/* Current Partnership */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24}>
              <Card title={`${t('institution.currentPartnership') || 'Current Partnership'} / Current Partnership`}>
                {data?.currentPartnership ? (
                  <Row gutter={16}>
                    <Col xs={24} md={6}>
                      <Statistic
                        title={`${t('institution.partnershipTier') || 'Partnership Tier'} / Partnership Tier`}
                        value={data.currentPartnership.tier.toUpperCase()}
                        prefix={<TrophyOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                      />
                      <Tag color={getTierColor(data.currentPartnership.tier)} style={{ marginTop: 8 }}>
                        {data.currentPartnership.isActive ? `${t('institution.active') || 'Active'} / Active` : `${t('institution.expired') || 'Expired'} / Expired`}
                      </Tag>
                    </Col>
                    <Col xs={24} md={6}>
                      <Statistic
                        title={`${t('institution.studentsLimit') || 'Students Limit'} / Students Limit`}
                        value={data.currentPartnership.studentsLimit || 'Unlimited'}
                        prefix={<UserOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                      {data.stats.totalStudentsEnrolled > 0 && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {data.stats.totalStudentsEnrolled} / {data.currentPartnership.studentsLimit || '∞'} {t('common.used') || 'used'}
                        </Text>
                      )}
                    </Col>
                    <Col xs={24} md={6}>
                      <Statistic
                        title={`${t('institution.creditsLimit') || 'Credits Limit'} / Credits/Year Limit`}
                        value={data.currentPartnership.creditsPerYearLimit || 'Unlimited'}
                        valueStyle={{ color: '#faad14' }}
                      />
                      {data.stats.creditsUsedThisYear && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {parseFloat(data.stats.creditsUsedThisYear).toFixed(1)} {t('common.used') || 'used'} {t('common.thisYear') || 'this year'}
                        </Text>
                      )}
                    </Col>
                    <Col xs={24} md={6}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>{t('institution.startDate') || 'Start Date'} / Start Date:</Text>
                        <div><Text>{dayjs(data.currentPartnership.startDate).format('MMM DD, YYYY')}</Text></div>
                      </div>
                      {data.currentPartnership.endDate && (
                        <div>
                          <Text strong>{t('institution.endDate') || 'End Date'} / End Date:</Text>
                          <div><Text>{dayjs(data.currentPartnership.endDate).format('MMM DD, YYYY')}</Text></div>
                        </div>
                      )}
                    </Col>
                  </Row>
                ) : (
                  <Text type="secondary">{t('institution.noActivePartnership') || 'No active partnership'} / No active partnership</Text>
                )}
              </Card>
            </Col>
          </Row>

          {/* Partnership History */}
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card title={`${t('institution.partnershipHistory') || 'Partnership History'} / Partnership History`}>
                {data?.history && data.history.length > 0 ? (
                  <Timeline
                    items={data.history.map((partnership) => ({
                      color: partnership.isActive ? 'green' : 'gray',
                      dot: partnership.isActive ? <ClockCircleOutlined /> : undefined,
                      children: (
                        <div>
                          <Space>
                            <Tag color={getTierColor(partnership.tier)}>
                              {partnership.tier.toUpperCase()}
                            </Tag>
                            <Tag color={partnership.isActive ? 'green' : 'default'}>
                              {partnership.isActive ? `${t('institution.active') || 'Active'} / Active` : `${t('institution.expired') || 'Expired'} / Expired`}
                            </Tag>
                          </Space>
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                              {dayjs(partnership.startDate).format('MMM DD, YYYY')}
                              {partnership.endDate && ` - ${dayjs(partnership.endDate).format('MMM DD, YYYY')}`}
                            </Text>
                          </div>
                          <div style={{ marginTop: 4 }}>
                            <Text type="secondary">
                              {t('institution.studentsLimit') || 'Students'}: {partnership.studentsLimit || 'Unlimited'} | 
                              {t('institution.creditsLimit') || 'Credits'}: {partnership.creditsPerYearLimit || 'Unlimited'}
                            </Text>
                          </div>
                        </div>
                      ),
                    }))}
                  />
                ) : (
                  <Text type="secondary">{t('institution.noPartnershipHistory') || 'No partnership history'} / No partnership history</Text>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </DashboardLayout>
    </App>
  );
}
