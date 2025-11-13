'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Tag, Select, Space } from 'antd';
import { TrophyOutlined, TeamOutlined, RiseOutlined, GlobalOutlined, HeartOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Column } from '@ant-design/plots';

const { Title, Text } = Typography;
const { Option } = Select;

interface ImpactMetrics {
  totalMatches: number;
  crossInstitutionMatches: number;
  totalSessions: number;
  totalCreditsEarned: number;
  activeStudentTutors: number;
  institutionsParticipating: number;
}

interface InstitutionImpact {
  id: number;
  name: string;
  tutorsSent: number;
  menteesReceived: number;
  totalSessions: number;
  creditsEarned: number;
  impactScore: number;
}

export default function ImpactDashboard() {
  const [metrics, setMetrics] = useState<ImpactMetrics>({
    totalMatches: 0,
    crossInstitutionMatches: 0,
    totalSessions: 0,
    totalCreditsEarned: 0,
    activeStudentTutors: 0,
    institutionsParticipating: 0,
  });
  const [institutionData, setInstitutionData] = useState<InstitutionImpact[]>([]);
  const [selectedYear, setSelectedYear] = useState('2024-2025');

  useEffect(() => {
    // TODO: Replace with real API calls
    fetchImpactData();
  }, [selectedYear]);

  const fetchImpactData = async () => {
    // Mock data - replace with actual API calls
    setMetrics({
      totalMatches: 156,
      crossInstitutionMatches: 98,
      totalSessions: 423,
      totalCreditsEarned: 211.5,
      activeStudentTutors: 67,
      institutionsParticipating: 8,
    });

    setInstitutionData([
      {
        id: 1,
        name: 'Royal University of Phnom Penh',
        tutorsSent: 25,
        menteesReceived: 8,
        totalSessions: 142,
        creditsEarned: 71.0,
        impactScore: 85,
      },
      {
        id: 2,
        name: 'Institute of Technology of Cambodia',
        tutorsSent: 18,
        menteesReceived: 12,
        totalSessions: 98,
        creditsEarned: 49.0,
        impactScore: 72,
      },
      {
        id: 3,
        name: 'Kampong Cham University',
        tutorsSent: 8,
        menteesReceived: 22,
        totalSessions: 76,
        creditsEarned: 38.0,
        impactScore: 68,
      },
      {
        id: 4,
        name: 'Battambang Teacher Training College',
        tutorsSent: 5,
        menteesReceived: 18,
        totalSessions: 54,
        creditsEarned: 27.0,
        impactScore: 55,
      },
      {
        id: 5,
        name: 'Svay Rieng University',
        tutorsSent: 3,
        menteesReceived: 15,
        totalSessions: 32,
        creditsEarned: 16.0,
        impactScore: 48,
      },
    ]);
  };

  const crossInstitutionPercentage = ((metrics.crossInstitutionMatches / metrics.totalMatches) * 100).toFixed(1);

  const columns: ColumnsType<InstitutionImpact> = [
    {
      title: 'Institution',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Tutors Provided',
      dataIndex: 'tutorsSent',
      key: 'tutorsSent',
      render: (count) => (
        <Space>
          <TeamOutlined style={{ color: '#1890ff' }} />
          <Text>{count}</Text>
        </Space>
      ),
      sorter: (a, b) => a.tutorsSent - b.tutorsSent,
    },
    {
      title: 'Students Helped',
      dataIndex: 'menteesReceived',
      key: 'menteesReceived',
      render: (count) => (
        <Space>
          <HeartOutlined style={{ color: '#ff6b6b' }} />
          <Text>{count}</Text>
        </Space>
      ),
      sorter: (a, b) => a.menteesReceived - b.menteesReceived,
    },
    {
      title: 'Sessions',
      dataIndex: 'totalSessions',
      key: 'totalSessions',
      sorter: (a, b) => a.totalSessions - b.totalSessions,
    },
    {
      title: 'Credits Earned',
      dataIndex: 'creditsEarned',
      key: 'creditsEarned',
      render: (credits) => (
        <Space>
          <TrophyOutlined style={{ color: '#faad14' }} />
          <Text>{credits.toFixed(1)}</Text>
        </Space>
      ),
      sorter: (a, b) => a.creditsEarned - b.creditsEarned,
    },
    {
      title: 'Impact Score',
      dataIndex: 'impactScore',
      key: 'impactScore',
      render: (score) => (
        <Tag color={score >= 70 ? 'green' : score >= 50 ? 'blue' : 'orange'}>
          {score}
        </Tag>
      ),
      sorter: (a, b) => a.impactScore - b.impactScore,
    },
  ];

  // Chart data for cross-institution flow
  const flowChartData = institutionData.map(inst => [
    { institution: inst.name, type: 'Tutors Sent', value: inst.tutorsSent },
    { institution: inst.name, type: 'Students Received', value: inst.menteesReceived },
  ]).flat();

  const chartConfig = {
    data: flowChartData,
    xField: 'institution',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [8, 8, 0, 0],
    },
    color: ['#1890ff', '#ff6b6b'],
    label: {
      position: 'top' as const,
      style: {
        fill: '#000000',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: true,
      },
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>
          <GlobalOutlined style={{ marginRight: 8 }} />
          Social Impact Dashboard
        </Title>
        <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 200 }}>
          <Option value="2024-2025">Academic Year 2024-2025</Option>
          <Option value="2023-2024">Academic Year 2023-2024</Option>
        </Select>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Matches Created"
              value={metrics.totalMatches}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {metrics.crossInstitutionMatches} cross-institution ({crossInstitutionPercentage}%)
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Sessions Completed"
              value={metrics.totalSessions}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Credits Earned"
              value={metrics.totalCreditsEarned}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix="credits"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Active Student Tutors"
              value={metrics.activeStudentTutors}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#ff6b6b' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Institutions Participating"
              value={metrics.institutionsParticipating}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Cross-Institution Impact"
              value={crossInstitutionPercentage}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Urban → Rural educational equity
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Cross-Institution Flow Chart */}
      <Card title="Urban → Rural Education Flow" style={{ marginBottom: 24 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Visualizing the flow of knowledge from urban to rural institutions
        </Text>
        <Column {...chartConfig} height={300} />
      </Card>

      {/* Institution Impact Table */}
      <Card title="Institution Impact Rankings">
        <Table
          columns={columns}
          dataSource={institutionData}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Impact Explanation */}
      <Card
        title="📊 How Impact Score is Calculated"
        style={{ marginTop: 24, background: '#f0f5ff', borderColor: '#adc6ff' }}
      >
        <Space direction="vertical">
          <Text>
            <strong>Impact Score</strong> is calculated based on:
          </Text>
          <ul style={{ marginBottom: 0 }}>
            <li>
              <Text type="secondary">
                <strong>Cross-institution matches:</strong> +10 points per match (prioritizes urban→rural flow)
              </Text>
            </li>
            <li>
              <Text type="secondary">
                <strong>Session completion rate:</strong> +5 points per completed session
              </Text>
            </li>
            <li>
              <Text type="secondary">
                <strong>Student satisfaction:</strong> Based on review ratings from mentees
              </Text>
            </li>
            <li>
              <Text type="secondary">
                <strong>Geographic diversity:</strong> Bonus for helping students from remote provinces
              </Text>
            </li>
          </ul>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Higher scores indicate greater contribution to educational equity across Cambodia.
          </Text>
        </Space>
      </Card>
    </div>
  );
}
