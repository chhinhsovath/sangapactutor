'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Modal, App, Statistic, Row, Col, Descriptions } from 'antd';
import { HeartOutlined, EyeOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminMatchingPage() {
  const { t } = useLanguage();
  const { message } = App.useApp();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  const user = {
    name: 'Admin User',
    email: 'admin@tutorhub.com',
    avatar: 'https://i.pravatar.cc/150?img=0',
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/matching/matches');
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      message.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record: any) => {
    setSelectedMatch(record);
    setDetailsModalVisible(true);
  };

  const getStatusTag = (status: string) => {
    const statusMap: any = {
      pending: { color: 'orange', text: t('admin.matchingPage.pending') },
      accepted: { color: 'green', text: t('admin.matchingPage.accepted') },
      rejected: { color: 'red', text: t('admin.matchingPage.rejected') },
      active: { color: 'blue', text: t('admin.matchingPage.active') },
      completed: { color: 'default', text: t('admin.matchingPage.completed') },
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: t('admin.commonTable.id'),
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: t('admin.matchingPage.student'),
      key: 'student',
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.student?.firstName} {record.student?.lastName}
          </div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.student?.email}</div>
        </div>
      ),
    },
    {
      title: t('admin.matchingPage.tutor'),
      key: 'tutor',
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.tutor?.firstName} {record.tutor?.lastName}
          </div>
        </div>
      ),
    },
    {
      title: t('admin.matchingPage.matchScore'),
      dataIndex: 'matchScore',
      key: 'matchScore',
      width: 120,
      render: (score: number) => <strong>{score ? `${score}%` : '-'}</strong>,
    },
    {
      title: t('admin.matchingPage.status'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: getStatusTag,
    },
    {
      title: t('admin.matchingPage.createdDate'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      width: 130,
    },
    {
      title: t('admin.matchingPage.actions'),
      key: 'actions',
      width: 150,
      render: (_: any, record: any) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          {t('admin.matchingPage.view')}
        </Button>
      ),
    },
  ];

  const stats = matches.reduce(
    (acc, match) => {
      if (match.status === 'active') acc.active++;
      if (match.status === 'completed') acc.completed++;
      acc.total++;
      return acc;
    },
    { active: 0, completed: 0, total: 0 }
  );

  return (
    <App>
      <DashboardLayout role="admin" user={user}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title={t('admin.matchingPage.totalMatches')}
                value={stats.total}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title={t('admin.matchingPage.activeMatches')}
                value={stats.active}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title={t('admin.matchingPage.completedMatches')}
                value={stats.completed}
                valueStyle={{ color: '#999' }}
              />
            </Card>
          </Col>
        </Row>

        <Card
          title={
            <Space>
              <HeartOutlined style={{ fontSize: 20 }} />
              <span>{t('admin.matchingPage.title')}</span>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={matches}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `សរុប / Total: ${total}` }}
          />
        </Card>

        {/* Details Modal */}
        <Modal
          title={t('admin.matchingPage.matchDetails')}
          open={detailsModalVisible}
          onCancel={() => setDetailsModalVisible(false)}
          footer={null}
          width={700}
        >
          {selectedMatch && (
            <Descriptions bordered column={2}>
              <Descriptions.Item label={t('admin.matchingPage.student')} span={2}>
                {selectedMatch.student?.firstName} {selectedMatch.student?.lastName} ({selectedMatch.student?.email})
              </Descriptions.Item>
              <Descriptions.Item label={t('admin.matchingPage.tutor')} span={2}>
                {selectedMatch.tutor?.firstName} {selectedMatch.tutor?.lastName}
              </Descriptions.Item>
              <Descriptions.Item label={t('admin.matchingPage.matchScore')}>
                {selectedMatch.matchScore ? `${selectedMatch.matchScore}%` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('admin.matchingPage.status')}>
                {getStatusTag(selectedMatch.status)}
              </Descriptions.Item>
              <Descriptions.Item label={t('admin.matchingPage.createdDate')} span={2}>
                {new Date(selectedMatch.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </DashboardLayout>
    </App>
  );
}
