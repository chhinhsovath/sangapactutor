'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Timeline, Tag, Typography, Progress, Space, Button, Table, message } from 'antd';
import { TrophyOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

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
}

interface UserData {
  creditBalance: string;
  institutionId: number;
  academicYear: string;
}

interface InstitutionData {
  creditRequirementMin: number;
  creditRequirementMax: number;
  creditValuePerSession: string;
}

export default function StudentCreditsPage() {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [institutionData, setInstitutionData] = useState<InstitutionData | null>(null);
  const [loading, setLoading] = useState(true);

  // TODO: Get from authenticated user's session
  const userId = 123;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch user data
      const userResponse = await fetch(`/api/users/${userId}`);
      const user = await userResponse.json();
      setUserData(user);

      // Fetch institution data
      if (user.institutionId) {
        const instResponse = await fetch(`/api/institutions/${user.institutionId}`);
        const institution = await instResponse.json();
        setInstitutionData(institution);
      }

      // Fetch credit transactions
      const transResponse = await fetch(`/api/credits?userId=${userId}`);
      const trans = await transResponse.json();
      setTransactions(trans);
    } catch (error) {
      message.error('Failed to fetch credit data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const creditBalance = userData ? parseFloat(userData.creditBalance) : 0;
  const minRequired = institutionData?.creditRequirementMin || 3;
  const maxRequired = institutionData?.creditRequirementMax || 6;
  const progressPercentage = (creditBalance / maxRequired) * 100;
  const isMinimumMet = creditBalance >= minRequired;

  const columns: ColumnsType<CreditTransaction> = [
    {
      title: 'Date Submitted',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.submittedAt).unix() - dayjs(b.submittedAt).unix(),
    },
    {
      title: 'Credits',
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
      title: 'Academic Year',
      dataIndex: 'academicYear',
      key: 'academicYear',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config: Record<string, { color: string; icon: any; text: string }> = {
          pending: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Pending Review' },
          approved: { color: 'blue', icon: <CheckCircleOutlined />, text: 'Approved' },
          credited: { color: 'green', icon: <CheckCircleOutlined />, text: 'Credited' },
          rejected: { color: 'red', icon: <CloseCircleOutlined />, text: 'Rejected' },
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
      title: 'Credited Date',
      dataIndex: 'creditedAt',
      key: 'creditedAt',
      render: (date) => (date ? dayjs(date).format('MMM DD, YYYY') : '-'),
    },
    {
      title: 'Notes',
      dataIndex: 'reviewNotes',
      key: 'reviewNotes',
      render: (notes) => notes || '-',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>My Credits</Title>

      {/* Credit Balance Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Statistic
              title="Total Credits Earned"
              value={creditBalance.toFixed(1)}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={`/ ${maxRequired}`}
            />
            <Progress
              percent={Math.min(progressPercentage, 100)}
              status={isMinimumMet ? 'success' : 'active'}
              strokeColor={isMinimumMet ? '#52c41a' : '#1890ff'}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                Minimum required: {minRequired} credits
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card>
            <Statistic
              title="Sessions Completed"
              value={transactions.filter(t => t.status === 'credited').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                @ {institutionData?.creditValuePerSession || '0.5'} credits/session
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card>
            <Statistic
              title="Pending Approval"
              value={transactions.filter(t => t.status === 'pending').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                Awaiting faculty review
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Status Message */}
      {userData && institutionData && (
        <Card style={{ marginBottom: 24, background: isMinimumMet ? '#f6ffed' : '#e6f7ff', borderColor: isMinimumMet ? '#b7eb8f' : '#91d5ff' }}>
          <Space>
            {isMinimumMet ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} /> : <ClockCircleOutlined style={{ color: '#1890ff', fontSize: 20 }} />}
            <div>
              <Text strong style={{ fontSize: 16 }}>
                {isMinimumMet
                  ? `✅ Congratulations! You've met the minimum requirement for ${userData.academicYear}`
                  : `You need ${(minRequired - creditBalance).toFixed(1)} more credits to meet the minimum requirement`
                }
              </Text>
              <br />
              <Text type="secondary">
                {isMinimumMet
                  ? creditBalance >= maxRequired
                    ? 'You\'ve reached the maximum credits allowed for this year!'
                    : `You can earn up to ${(maxRequired - creditBalance).toFixed(1)} more credits this year.`
                  : `Complete ${Math.ceil((minRequired - creditBalance) / parseFloat(institutionData.creditValuePerSession))} more tutoring sessions.`
                }
              </Text>
            </div>
          </Space>
        </Card>
      )}

      {/* Transaction History */}
      <Card title="Credit Transaction History" style={{ marginBottom: 24 }}>
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Timeline View */}
      <Card title="Credit Journey">
        <Timeline
          items={transactions.slice().reverse().map(transaction => ({
            color: transaction.status === 'credited' ? 'green' :
                   transaction.status === 'approved' ? 'blue' :
                   transaction.status === 'rejected' ? 'red' : 'orange',
            children: (
              <div>
                <div>
                  <Text strong>
                    {transaction.status === 'credited' ? 'Credits Applied' :
                     transaction.status === 'approved' ? 'Approved' :
                     transaction.status === 'rejected' ? 'Rejected' : 'Submitted for Review'}
                  </Text>
                  <Tag color={transaction.status === 'credited' ? 'green' : transaction.status === 'approved' ? 'blue' : transaction.status === 'rejected' ? 'red' : 'orange'} style={{ marginLeft: 8 }}>
                    +{parseFloat(transaction.creditsEarned).toFixed(1)} credits
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
                      Note: {transaction.reviewNotes}
                    </Text>
                  </div>
                )}
              </div>
            ),
          }))}
        />
      </Card>
    </div>
  );
}
