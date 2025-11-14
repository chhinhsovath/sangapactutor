'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, Space, App, Spin } from 'antd';
import { TeamOutlined, TrophyOutlined, HeartOutlined, RiseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const { Title, Text } = Typography;

interface Match {
  id: number;
  tutorName: string;
  menteeName: string;
  subject: string;
  status: string;
  totalSessions: number;
  impactScore: string | null;
  createdAt: string;
}

interface ImpactData {
  stats: {
    totalMatches: number;
    activeMatches: number;
    completedSessions: number;
    averageImpactScore: string;
    studentsReached: number;
    tutorsActive: number;
  };
  recentMatches: Match[];
  monthlyTrends: Array<{
    month: string;
    matches: number;
    sessions: number;
  }>;
}

export default function ImpactPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.institutionId) {
      fetchImpactData();
    }
  }, [status, session]);

  const fetchImpactData = async () => {
    if (!session?.user?.institutionId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/institutions/${session.user.institutionId}/impact`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      message.error(t('errors.fetchFailed') || 'Failed to fetch impact data');
      console.error('Error fetching impact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Match> = [
    {
      title: `${t('institution.tutor') || 'Tutor'} / Tutor`,
      dataIndex: 'tutorName',
      key: 'tutorName',
    },
    {
      title: `${t('institution.mentee') || 'Mentee'} / Mentee`,
      dataIndex: 'menteeName',
      key: 'menteeName',
    },
    {
      title: `${t('common.subject') || 'Subject'} / Subject`,
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: `${t('common.status') || 'Status'} / Status`,
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap: Record<string, string> = {
          pending: 'orange',
          active: 'green',
          completed: 'blue',
          cancelled: 'red',
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: `${t('institution.sessions') || 'Sessions'} / Sessions`,
      dataIndex: 'totalSessions',
      key: 'totalSessions',
    },
    {
      title: `${t('institution.impactScore') || 'Impact Score'} / Impact Score`,
      dataIndex: 'impactScore',
      key: 'impactScore',
      render: (score) => score ? parseFloat(score).toFixed(1) : '-',
      sorter: (a, b) => parseFloat(a.impactScore || '0') - parseFloat(b.impactScore || '0'),
    },
    {
      title: `${t('common.date') || 'Date'} / Created`,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
  ];

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
          <Title level={2}>{t('institution.impactDashboard') || 'Impact Dashboard'} / Impact Dashboard</Title>

          {/* Impact Statistics */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title={`${t('institution.totalMatches') || 'Total Matches'} / Total Matches`}
                  value={data?.stats.totalMatches || 0}
                  prefix={<HeartOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {data?.stats.activeMatches || 0} {t('institution.active') || 'active'}
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title={`${t('institution.activeSessions') || 'Total Sessions'} / Total Sessions`}
                  value={data?.stats.completedSessions || 0}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title={`${t('institution.impactScore') || 'Avg Impact Score'} / Avg Impact Score`}
                  value={data?.stats.averageImpactScore ? parseFloat(data.stats.averageImpactScore).toFixed(1) : '0.0'}
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                  suffix="/ 5.0"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title={`${t('institution.studentsReached') || 'Students Reached'} / Students Reached`}
                  value={data?.stats.studentsReached || 0}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title={`${t('institution.activeTutors') || 'Active Tutors'} / Active Tutors`}
                  value={data?.stats.tutorsActive || 0}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title={`${t('institution.socialReach') || 'Social Impact'} / Social Impact`}
                  value={((data?.stats.studentsReached || 0) * (data?.stats.completedSessions || 0))}
                  prefix={<HeartOutlined />}
                  valueStyle={{ color: '#eb2f96' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Recent Matches Table */}
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card title={`${t('institution.recentMatches') || 'Recent Matches'} / Recent Matches`}>
                <Table
                  columns={columns}
                  dataSource={data?.recentMatches || []}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            </Col>
          </Row>

          {/* Monthly Trends */}
          {data?.monthlyTrends && data.monthlyTrends.length > 0 && (
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col xs={24}>
                <Card title={`${t('institution.monthlyTrends') || 'Monthly Trends'} / Monthly Trends`}>
                  <Row gutter={16}>
                    {data.monthlyTrends.map((trend, index) => (
                      <Col xs={24} sm={8} md={6} key={index} style={{ marginBottom: 16 }}>
                        <Card size="small">
                          <Text strong>{trend.month}</Text>
                          <div style={{ marginTop: 8 }}>
                            <Space direction="vertical" size="small">
                              <Text type="secondary">
                                {t('institution.matches') || 'Matches'}: {trend.matches}
                              </Text>
                              <Text type="secondary">
                                {t('institution.sessions') || 'Sessions'}: {trend.sessions}
                              </Text>
                            </Space>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </DashboardLayout>
    </App>
  );
}
