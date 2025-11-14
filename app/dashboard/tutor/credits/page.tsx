'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Timeline, Tag, Typography, Progress, Space, Table, App, Spin } from 'antd';
import { TrophyOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

interface CreditTransaction {
  id: number;
  creditsEarned: string;
  academicYear: string;
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  creditedAt?: string;
  reviewNotes?: string;
  student?: {
    firstName: string;
    lastName: string;
  };
}

interface TutorData {
  creditBalance: string;
  institutionId: number;
  academicYear: string;
}

interface InstitutionData {
  creditRequirementMin: number;
  creditRequirementMax: number;
  creditValuePerSession: string;
}

export default function TutorCreditsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [tutorData, setTutorData] = useState<TutorData | null>(null);
  const [institutionData, setInstitutionData] = useState<InstitutionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchData();
    }
  }, [status, session]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch user data
      const userResponse = await fetch(`/api/users/${session?.user?.id}`);
      const user = await userResponse.json();
      setTutorData(user);

      // Fetch institution data if tutor has institution
      if (user.institutionId) {
        const instResponse = await fetch(`/api/institutions/${user.institutionId}`);
        const institution = await instResponse.json();
        setInstitutionData(institution);
      }

      // Fetch credit transactions for tutor
      const transResponse = await fetch(`/api/credits?userId=${session?.user?.id}`);
      const trans = await transResponse.json();
      setTransactions(trans);
    } catch (error) {
      message.error(t('student.creditsPage.failedToFetch') || 'Failed to fetch credit data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <App>
        <DashboardLayout role="tutor" user={{ name: '', email: '', avatar: '' }}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        </DashboardLayout>
      </App>
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

  const creditBalance = tutorData ? parseFloat(tutorData.creditBalance || '0') : 0;
  const minRequired = institutionData?.creditRequirementMin || 3;
  const maxRequired = institutionData?.creditRequirementMax || 6;
  const progressPercentage = (creditBalance / maxRequired) * 100;
  const isMinimumMet = creditBalance >= minRequired;

  const columns: ColumnsType<CreditTransaction> = [
    {
      title: `${t('student.creditsPage.dateSubmitted')} / Date Submitted`,
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.submittedAt).unix() - dayjs(b.submittedAt).unix(),
    },
    {
      title: `${t('tutor.creditsPage.student')} / Student`,
      key: 'student',
      render: (_, record) => record.student ? `${record.student.firstName} ${record.student.lastName}` : '-',
    },
    {
      title: `${t('student.creditsPage.credits')} / Credits`,
      dataIndex: 'creditsEarned',
      key: 'creditsEarned',
      render: (credits) => (
        <Space>
          <TrophyOutlined style={{ color: '#faad14' }} />
          <Text strong>+{parseFloat(credits).toFixed(1)}</Text>
        </Space>
      ),
    },
    {
      title: `${t('student.creditsPage.academicYear')} / Academic Year`,
      dataIndex: 'academicYear',
      key: 'academicYear',
    },
    {
      title: `${t('student.creditsPage.status')} / Status`,
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config: Record<string, { color: string; icon: any; text: string }> = {
          pending: { color: 'orange', icon: <ClockCircleOutlined />, text: `${t('student.creditsPage.pendingReview')} / Pending Review` },
          approved: { color: 'blue', icon: <CheckCircleOutlined />, text: `${t('student.creditsPage.approved')} / Approved` },
          credited: { color: 'green', icon: <CheckCircleOutlined />, text: `${t('student.creditsPage.credited')} / Credited` },
          rejected: { color: 'red', icon: <CloseCircleOutlined />, text: `${t('student.creditsPage.rejected')} / Rejected` },
        };
        const { color, icon, text } = config[status] || config.pending;
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: `${t('student.creditsPage.creditedDate')} / Credited Date`,
      dataIndex: 'creditedAt',
      key: 'creditedAt',
      render: (date) => (date ? dayjs(date).format('MMM DD, YYYY') : '-'),
    },
    {
      title: `${t('student.creditsPage.notes')} / Notes`,
      dataIndex: 'reviewNotes',
      key: 'reviewNotes',
      render: (notes) => notes || '-',
    },
  ];

  return (
    <App>
      <DashboardLayout role="tutor" user={user}>
        <Title level={2}>{t('tutor.creditsPage.title')} / Tutorial Credits</Title>

        {/* Credit Balance Overview */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12} lg={8}>
            <Card>
              <Statistic
                title={`${t('student.creditsPage.totalCreditsEarned')} / Total Credits Earned`}
                value={creditBalance.toFixed(1)}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#3f8600' }}
                suffix={institutionData ? `/ ${maxRequired}` : ''}
              />
              {institutionData && (
                <>
                  <Progress
                    percent={Math.min(progressPercentage, 100)}
                    status={isMinimumMet ? 'success' : 'active'}
                    strokeColor={isMinimumMet ? '#52c41a' : '#1890ff'}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">
                      {t('student.creditsPage.minimumRequired')}: {minRequired} {t('student.creditsPage.credits')}
                    </Text>
                  </div>
                </>
              )}
            </Card>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Card>
              <Statistic
                title={`${t('student.creditsPage.sessionsCompleted')} / Sessions Completed`}
                value={transactions.filter(t => t.status === 'credited').length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">
                  @ {institutionData?.creditValuePerSession || '0.5'} {t('student.creditsPage.creditsPerSession')}
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Card>
              <Statistic
                title={`${t('student.creditsPage.pendingApproval')} / Pending Approval`}
                value={transactions.filter(t => t.status === 'pending').length}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">
                  {t('student.creditsPage.awaitingReview')}
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Status Message */}
        {tutorData && institutionData && (
          <Card style={{ marginBottom: 24, background: isMinimumMet ? '#f6ffed' : '#e6f7ff', borderColor: isMinimumMet ? '#b7eb8f' : '#91d5ff' }}>
            <Space>
              {isMinimumMet ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} /> : <ClockCircleOutlined style={{ color: '#1890ff', fontSize: 20 }} />}
              <div>
                <Text strong style={{ fontSize: 16 }}>
                  {isMinimumMet
                    ? `✅ ${t('student.creditsPage.congratulations')}! ${t('student.creditsPage.metMinimum')} ${tutorData.academicYear}`
                    : `${t('student.creditsPage.needMore')} ${(minRequired - creditBalance).toFixed(1)} ${t('student.creditsPage.credits')} ${t('student.creditsPage.toMeetMinimum')}`
                  }
                </Text>
                <br />
                <Text type="secondary">
                  {isMinimumMet
                    ? creditBalance >= maxRequired
                      ? t('student.creditsPage.reachedMaximum')
                      : `${t('student.creditsPage.canEarnUpTo')} ${(maxRequired - creditBalance).toFixed(1)} ${t('student.creditsPage.moreCreditsThisYear')}`
                    : `${t('student.creditsPage.complete')} ${Math.ceil((minRequired - creditBalance) / parseFloat(institutionData.creditValuePerSession))} ${t('student.creditsPage.moreSessions')}`
                  }
                </Text>
              </div>
            </Space>
          </Card>
        )}

        {/* Transaction History */}
        <Card title={`${t('student.creditsPage.transactionHistory')} / Credit Transaction History`} style={{ marginBottom: 24 }}>
          <Table
            columns={columns}
            dataSource={transactions}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>

        {/* Timeline View */}
        <Card title={`${t('student.creditsPage.creditJourney')} / Credit Journey`}>
          <Timeline
            items={transactions.slice().reverse().map(transaction => ({
              color: transaction.status === 'credited' ? 'green' :
                     transaction.status === 'approved' ? 'blue' :
                     transaction.status === 'rejected' ? 'red' : 'orange',
              children: (
                <div>
                  <div>
                    <Text strong>
                      {transaction.status === 'credited' ? `${t('student.creditsPage.creditsApplied')} / Credits Applied` :
                       transaction.status === 'approved' ? `${t('student.creditsPage.approved')} / Approved` :
                       transaction.status === 'rejected' ? `${t('student.creditsPage.rejected')} / Rejected` : `${t('student.creditsPage.submittedForReview')} / Submitted for Review`}
                    </Text>
                    <Tag color={transaction.status === 'credited' ? 'green' : transaction.status === 'approved' ? 'blue' : transaction.status === 'rejected' ? 'red' : 'orange'} style={{ marginLeft: 8 }}>
                      +{parseFloat(transaction.creditsEarned).toFixed(1)} {t('student.creditsPage.credits')}
                    </Tag>
                  </div>
                  <Text type="secondary">
                    {dayjs(
                      transaction.creditedAt || transaction.reviewedAt || transaction.submittedAt
                    ).format('MMMM DD, YYYY')}
                  </Text>
                  {transaction.reviewNotes && (
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary" italic>
                        {t('student.creditsPage.note')}: {transaction.reviewNotes}
                      </Text>
                    </div>
                  )}
                </div>
              ),
            }))}
          />
        </Card>
      </DashboardLayout>
    </App>
  );
}
