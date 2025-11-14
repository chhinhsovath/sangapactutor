'use client';

import { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Space, Tag, Modal, Descriptions, App, Typography, Avatar, Rate, Spin } from 'antd';
import { CheckOutlined, CloseOutlined, UserOutlined, TrophyOutlined, HeartOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

interface Match {
  id: number;
  tutorUserId: number;
  menteeUserId: number;
  tutorInstitutionId: number;
  menteeInstitutionId: number;
  subjectId: number;
  matchScore: string;
  status: string;
  proposedBy: string;
  matchReason: string;
  acceptedByTutor: boolean;
  acceptedByMentee: boolean;
  acceptedAt?: string;
  startedAt?: string;
  totalSessions: number;
  impactScore?: string;
  createdAt: string;
  subject: {
    name: string;
    slug: string;
  };
}

export default function MatchingDashboard() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchMatches();
    }
  }, [status, session, activeTab]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        userId: session!.user!.id!.toString(),
        role: 'mentee',
        status: activeTab,
      });

      const response = await fetch(`/api/matching/matches?${params.toString()}`);
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      message.error(t('errors.fetchFailed'));
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (matchId: number) => {
    try {
      const response = await fetch(`/api/matching/matches/${matchId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(session!.user!.id!),
          role: 'mentee',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        message.success(result.message);
        fetchMatches();
        setDetailModalVisible(false);
      } else {
        const error = await response.json();
        message.error(error.error || t('errors.updateFailed'));
      }
    } catch (error) {
      message.error(t('errors.updateFailed'));
      console.error('Error accepting match:', error);
    }
  };

  const handleReject = async (matchId: number, reason?: string) => {
    Modal.confirm({
      title: `${t('admin.matchingPage.reject')} / Reject Match`,
      content: `តើអ្នកប្រាកដថាចង់បដិសេធការផ្គូផ្គងនេះទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។ / Are you sure you want to reject this match? This action cannot be undone.`,
      okText: `${t('common.yes')} / Yes, Reject`,
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await fetch(`/api/matching/matches/${matchId}/reject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: parseInt(session!.user!.id!),
              role: 'mentee',
              rejectionReason: reason || 'Not interested',
            }),
          });

          if (response.ok) {
            message.success(t('admin.matchingPage.rejected'));
            fetchMatches();
            setDetailModalVisible(false);
          } else {
            const error = await response.json();
            message.error(error.error || t('errors.updateFailed'));
          }
        } catch (error) {
          message.error(t('errors.updateFailed'));
          console.error('Error rejecting match:', error);
        }
      },
    });
  };

  const showDetails = (match: Match) => {
    setSelectedMatch(match);
    setDetailModalVisible(true);
  };

  if (status === 'loading' || loading) {
    return (
      <App>
        <DashboardLayout role="student" user={{ name: '', email: '', avatar: '' }}>
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

  const columns: ColumnsType<Match> = [
    {
      title: `${t('admin.matchingPage.tutor')} / Tutor`,
      key: 'partner',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div><Text strong>Student #{record.menteeUserId}</Text></div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.subject.name}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Match Score',
      dataIndex: 'matchScore',
      key: 'matchScore',
      render: (score) => {
        const scoreNum = parseFloat(score || '0');
        return (
          <Space>
            <Rate disabled value={Math.min(Math.floor(scoreNum / 20), 5)} style={{ fontSize: 14 }} />
            <Text type="secondary">({scoreNum})</Text>
          </Space>
        );
      },
      sorter: (a, b) => parseFloat(a.matchScore || '0') - parseFloat(b.matchScore || '0'),
    },
    {
      title: 'Cross-Institution',
      key: 'crossInstitution',
      render: (_, record) => (
        record.tutorInstitutionId !== record.menteeInstitutionId ? (
          <Tag color="purple" icon={<TrophyOutlined />}>
            High Impact
          </Tag>
        ) : (
          <Tag>Same Institution</Tag>
        )
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'matchReason',
      key: 'matchReason',
      ellipsis: true,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        if (record.status === 'accepted') {
          return <Tag color="green">Active</Tag>;
        }
        if (record.status === 'pending') {
          if (record.acceptedByMentee) {
            return <Tag color="blue">{t('admin.matchingPage.pending')} - Waiting for Tutor / រងចាំគ្រូបង្រៀន</Tag>;
          }
          return <Tag color="orange">{t('admin.matchingPage.pending')} - Your Response / ការឆ្លើយតបរបស់អ្នក</Tag>;
        }
        return <Tag>{record.status}</Tag>;
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => showDetails(record)}>
            View Details
          </Button>
          {record.status === 'pending' && !record.acceptedByMentee && (
                  <Button
                    type="primary"
                    size="small"
                    icon={<CheckOutlined />}
                    onClick={() => handleAccept(record.id)}
                  >
                    Accept
                  </Button>
              )}
              {record.status === 'pending' && !record.acceptedByMentee && (
                  <Button
                    danger
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={() => handleReject(record.id)}
                  >
                    Reject
                  </Button>
              )}
        </Space>
      ),
    },
  ];

  return (
    <App>
      <DashboardLayout role="student" user={user}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>
            <HeartOutlined style={{ marginRight: 8, color: '#ff6b6b' }} />
            {`${t('admin.matchingPage.title')} / My Matches`}
          </Title>
          <Link href="/dashboard/student/matching/preferences">
            <Button>{`${t('common.update')} / Update Preferences`}</Button>
          </Link>
        </div>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'pending',
              label: `${t('admin.matchingPage.pending')} / Pending Matches`,
              children: (
                <Table
                  columns={columns}
                  dataSource={matches}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'accepted',
              label: `${t('admin.matchingPage.active')} / Active Matches`,
              children: (
                <Table
                  columns={columns}
                  dataSource={matches}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'completed',
              label: `${t('admin.matchingPage.completed')} / Completed`,
              children: (
                <Table
                  columns={columns}
                  dataSource={matches}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Match Details Modal */}
      <Modal
        title="Match Details"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedMatch(null);
        }}
        footer={
          selectedMatch && selectedMatch.status === 'pending' ? (
            <Space>
              {selectedMatch.status === 'pending' && !selectedMatch.acceptedByMentee && (
                <>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => handleAccept(selectedMatch.id)}
                  >
                    Accept Match
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => handleReject(selectedMatch.id)}
                  >
                    Reject Match
                  </Button>
                </>
              )}
            </Space>
          ) : (
            <Button onClick={() => setDetailModalVisible(false)}>Close</Button>
          )
        }
        width={700}
      >
        {selectedMatch && (
          <>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Subject">
                <Tag color="blue">{selectedMatch.subject.name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Match Score">
                <Space>
                  <Rate
                    disabled
                    value={Math.min(Math.floor(parseFloat(selectedMatch.matchScore || '0') / 20), 5)}
                  />
                  <Text>({selectedMatch.matchScore} points)</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Cross-Institution">
                {selectedMatch.tutorInstitutionId !== selectedMatch.menteeInstitutionId ? (
                  <Tag color="purple" icon={<TrophyOutlined />}>
                    Yes - High Social Impact
                  </Tag>
                ) : (
                  <Tag>No - Same Institution</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Proposed By">
                <Tag>{selectedMatch.proposedBy}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Reason for Match">
                {selectedMatch.matchReason}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={
                  selectedMatch.status === 'accepted' ? 'green' :
                  selectedMatch.status === 'pending' ? 'orange' : 'default'
                }>
                  {selectedMatch.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tutor Accepted">
                {selectedMatch.acceptedByTutor ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Student Accepted">
                {selectedMatch.acceptedByMentee ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>}
              </Descriptions.Item>
              {selectedMatch.acceptedAt && (
                <Descriptions.Item label="Accepted Date">
                  {dayjs(selectedMatch.acceptedAt).format('MMMM DD, YYYY')}
                </Descriptions.Item>
              )}
              {selectedMatch.totalSessions > 0 && (
                <Descriptions.Item label="Sessions Completed">
                  {selectedMatch.totalSessions}
                </Descriptions.Item>
              )}
              {selectedMatch.impactScore && (
                <Descriptions.Item label="Impact Score">
                  <Space>
                    <TrophyOutlined style={{ color: '#faad14' }} />
                    <Text strong>{selectedMatch.impactScore}</Text>
                  </Space>
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedMatch.status === 'pending' && (
              <Card
                style={{ marginTop: 16, background: '#e6f7ff', borderColor: '#91d5ff' }}
                bodyStyle={{ padding: 16 }}
              >
                <Text strong style={{ color: '#096dd9' }}>
                  💡 What happens when you accept?
                </Text>
                <ul style={{ marginTop: 8, marginBottom: 0 }}>
                  <li>
                    <Text type="secondary">
                      ទាំអ្នក និងគ្រូបង្រៀនត្រូវទទួលយកដើម្បីឧការផ្គូផ្គងក្លាយជាសកម្ម / Both you and the tutor need to accept for the match to become active
                    </Text>
                  </li>
                  <li>
                    <Text type="secondary">
                      Once active, you can start scheduling tutoring sessions
                    </Text>
                  </li>
                  <li>
                    <Text type="secondary">
                      Each completed session earns credits toward your annual requirement
                    </Text>
                  </li>
                </ul>
              </Card>
            )}
          </>
        )}
      </Modal>
      </DashboardLayout>
    </App>
  );
}
