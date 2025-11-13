'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin, Tag, Button, Space } from 'antd';
import { UserOutlined, TeamOutlined, TrophyOutlined, ClockCircleOutlined, SettingOutlined } from '@ant-design/icons';
import Link from 'next/link';

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
  const [institution, setInstitution] = useState<InstitutionStats | null>(null);
  const [loading, setLoading] = useState(true);

  // TODO: Get actual institutionId from authenticated user's session
  const institutionId = 1;

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await fetch(`/api/institutions/${institutionId}`);
        const data = await response.json();
        setInstitution(data);
      } catch (error) {
        console.error('Error fetching institution:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitution();
  }, [institutionId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!institution) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Text type="danger">Institution not found</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            {institution.name}
          </Title>
          <Space>
            <Tag color="blue">{institution.type}</Tag>
            {institution.currentPartnership && (
              <Tag color="purple">{institution.currentPartnership.tier.toUpperCase()} Tier</Tag>
            )}
          </Space>
        </div>
        <Link href="/dashboard/institution/settings">
          <Button icon={<SettingOutlined />}>Settings</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Enrolled Students"
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
              title="Total Credits Earned"
              value={parseFloat(institution.stats.totalCreditsEarned).toFixed(1)}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Credits Approved"
              value={institution.stats.creditsApproved}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Approval"
              value={institution.stats.creditsPending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            {institution.stats.creditsPending > 0 && (
              <Link href="/dashboard/institution/credits">
                <Button type="link" size="small" style={{ padding: 0 }}>
                  Review Now →
                </Button>
              </Link>
            )}
          </Card>
        </Col>
      </Row>

      {/* Credit System Settings */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Credit System Configuration" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Credits per Session:</Text>
                <Text>{institution.creditValuePerSession}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Min Sessions/Year:</Text>
                <Text>{institution.creditRequirementMin}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Max Sessions/Year:</Text>
                <Text>{institution.creditRequirementMax}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Cross-Institution:</Text>
                <Tag color={institution.allowCrossInstitution ? 'green' : 'red'}>
                  {institution.allowCrossInstitution ? 'Enabled' : 'Disabled'}
                </Tag>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Quick Actions" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Link href="/dashboard/institution/students" style={{ width: '100%' }}>
                <Button type="primary" block icon={<UserOutlined />}>
                  Manage Students
                </Button>
              </Link>
              <Link href="/dashboard/institution/credits" style={{ width: '100%' }}>
                <Button block icon={<TrophyOutlined />}>
                  Review Credit Requests
                </Button>
              </Link>
              <Link href="/dashboard/institution/analytics" style={{ width: '100%' }}>
                <Button block icon={<TeamOutlined />}>
                  View Analytics
                </Button>
              </Link>
              <Link href="/dashboard/institution/settings" style={{ width: '100%' }}>
                <Button block icon={<SettingOutlined />}>
                  Institution Settings
                </Button>
              </Link>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
