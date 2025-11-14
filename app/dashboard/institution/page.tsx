'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin, Tag, Button, Space, App } from 'antd';
import { UserOutlined, TeamOutlined, TrophyOutlined, ClockCircleOutlined, SettingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const { Title, Text } = Typography;

interface InstitutionStats {
  id: number;
  name: string;
  nameKh?: string;
  nameEn?: string;
  type: string;
  logo?: string;
  creditRequirementMin: number;
  creditRequirementMax: number;
  creditValuePerSession: string;
  allowCrossInstitution: boolean;
  stats: {
    enrolledStudents: number;
    totalCreditsEarned: string;
    creditsApproved: number;
    creditsPending: number;
  };
  currentPartnership?: {
    tier: string;
    studentsLimit: number;
  };
}

export default function InstitutionDashboard() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [institution, setInstitution] = useState<InstitutionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.institutionId) {
      fetchInstitution();
    }
  }, [status, session]);

  const fetchInstitution = async () => {
    if (!session?.user?.institutionId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/institutions/${session.user.institutionId}`);
      const data = await response.json();
      setInstitution(data);
    } catch (error) {
      message.error(t('errors.fetchFailed') || 'Failed to fetch institution data');
      console.error('Error fetching institution:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <App>
        <DashboardLayout role={session?.user?.role as any || 'faculty_coordinator'} user={{
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          avatar: session?.user?.avatar,
        }}>
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <Spin size="large" />
          </div>
        </DashboardLayout>
      </App>
    );
  }

  if (!institution) {
    return (
      <App>
        <DashboardLayout role={session?.user?.role as any || 'faculty_coordinator'} user={{
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          avatar: session?.user?.avatar,
        }}>
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <Text type="danger">{t('institution.institutionNotFound') || 'Institution not found'}</Text>
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
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            {t('institution.dashboard') || 'Institution Dashboard'} / {institution.name}
          </Title>
          <Space>
            <Tag color="blue">{institution.type}</Tag>
            {institution.currentPartnership && (
              <Tag color="purple">{institution.currentPartnership.tier.toUpperCase()} Tier</Tag>
            )}
          </Space>
        </div>
        <Link href="/dashboard/institution/settings">
          <Button icon={<SettingOutlined />}>{t('navigation.settings')} / Settings</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={`${t('institution.enrolledStudents') || 'Enrolled Students'} / Enrolled Students`}
              value={institution.stats.enrolledStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            {institution.currentPartnership && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Limit: {institution.currentPartnership.studentsLimit}
              </Text>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={`${t('institution.totalCreditsEarned') || 'Total Credits Earned'} / Total Credits Earned`}
              value={parseFloat(institution.stats.totalCreditsEarned).toFixed(1)}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={`${t('institution.creditsApproved') || 'Credits Approved'} / Credits Approved`}
              value={institution.stats.creditsApproved}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={`${t('institution.pendingApproval') || 'Pending Approval'} / Pending Approval`}
              value={institution.stats.creditsPending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            {institution.stats.creditsPending > 0 && (
              <Link href="/dashboard/institution/credits">
                <Button type="link" size="small" style={{ padding: 0 }}>
                  {t('institution.reviewNow') || 'Review Now'} / Review Now →
                </Button>
              </Link>
            )}
          </Card>
        </Col>
      </Row>

      {/* Credit System Settings */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={`${t('institution.creditSystemConfig') || 'Credit System Configuration'} / Credit System Configuration`} bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>{t('institution.creditsPerSession') || 'Credits per Session'} / Credits per Session:</Text>
                <Text>{institution.creditValuePerSession}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>{t('institution.minSessions') || 'Min Sessions/Year'} / Min Sessions/Year:</Text>
                <Text>{institution.creditRequirementMin}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>{t('institution.maxSessions') || 'Max Sessions/Year'} / Max Sessions/Year:</Text>
                <Text>{institution.creditRequirementMax}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>{t('institution.crossInstitution') || 'Cross-Institution'} / Cross-Institution:</Text>
                <Tag color={institution.allowCrossInstitution ? 'green' : 'red'}>
                  {institution.allowCrossInstitution ? `${t('common.enabled') || 'Enabled'} / Enabled` : `${t('common.disabled') || 'Disabled'} / Disabled`}
                </Tag>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={`${t('institution.quickActions') || 'Quick Actions'} / Quick Actions`} bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Link href="/dashboard/institution/students" style={{ width: '100%' }}>
                <Button type="primary" block icon={<UserOutlined />}>
                  {t('institution.manageStudents') || 'Manage Students'} / Manage Students
                </Button>
              </Link>
              <Link href="/dashboard/institution/credits" style={{ width: '100%' }}>
                <Button block icon={<TrophyOutlined />}>
                  {t('institution.reviewCredits') || 'Review Credit Requests'} / Review Credit Requests
                </Button>
              </Link>
              <Link href="/dashboard/institution/partnerships" style={{ width: '100%' }}>
                <Button block icon={<TeamOutlined />}>
                  {t('institution.partnerships') || 'Partnerships'} / Partnerships
                </Button>
              </Link>
              <Link href="/dashboard/institution/impact" style={{ width: '100%' }}>
                <Button block icon={<TrophyOutlined />}>
                  {t('institution.impact') || 'Impact Dashboard'} / Impact Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/institution/settings" style={{ width: '100%' }}>
                <Button block icon={<SettingOutlined />}>
                  {t('navigation.settings') || 'Settings'} / Institution Settings
                </Button>
              </Link>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
      </DashboardLayout>
    </App>
  );
}
