'use client';

import { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Tag, Modal, Form, Input, message, Typography, Tabs, Descriptions, App } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, TrophyOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CreditTransaction {
  id: number;
  userId: number;
  institutionId: number;
  bookingId: number;
  creditsEarned: string;
  academicYear: string;
  status: string;
  submittedAt: string;
  reviewedBy?: number;
  reviewedAt?: string;
  reviewNotes?: string;
  creditedAt?: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  institution: {
    name: string;
  };
}

export default function CreditApprovalsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message: msg } = App.useApp();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<CreditTransaction | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.institutionId) {
      fetchTransactions();
    }
  }, [status, session, activeTab]);

  const fetchTransactions = async () => {
    if (!session?.user?.institutionId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        institutionId: session.user.institutionId.toString(),
        status: activeTab,
      });

      const response = await fetch(`/api/credits?${params.toString()}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      msg.error(t('errors.fetchFailed') || 'Failed to fetch credit transactions');
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transactionId: number) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/credits/${transactionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewedBy: parseInt(session.user.id),
          reviewNotes: form.getFieldValue('reviewNotes') || 'Approved',
        }),
      });

      if (response.ok) {
        msg.success(t('institution.creditApproved') || 'Credit transaction approved');
        setReviewModalVisible(false);
        form.resetFields();
        fetchTransactions();

        // Automatically apply credits
        await applyCredits(transactionId);
      } else {
        const error = await response.json();
        msg.error(error.error || t('institution.approveFailed') || 'Failed to approve transaction');
      }
    } catch (error) {
      msg.error(t('institution.approveFailed') || 'Failed to approve transaction');
      console.error('Error approving transaction:', error);
    }
  };

  const handleReject = async (values: any) => {
    if (!selectedTransaction || !session?.user?.id) return;

    try {
      const response = await fetch(`/api/credits/${selectedTransaction.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewedBy: parseInt(session.user.id),
          reviewNotes: values.reviewNotes,
        }),
      });

      if (response.ok) {
        msg.success(t('institution.creditRejected') || 'Credit transaction rejected');
        setReviewModalVisible(false);
        form.resetFields();
        fetchTransactions();
      } else {
        const error = await response.json();
        msg.error(error.error || t('institution.rejectFailed') || 'Failed to reject transaction');
      }
    } catch (error) {
      msg.error(t('institution.rejectFailed') || 'Failed to reject transaction');
      console.error('Error rejecting transaction:', error);
    }
  };

  const applyCredits = async (transactionId: number) => {
    try {
      const response = await fetch(`/api/credits/${transactionId}/credit`, {
        method: 'POST',
      });

      if (response.ok) {
        msg.success(t('institution.creditsApplied') || 'Credits applied to student balance');
      } else {
        const error = await response.json();
        msg.warning(error.error || t('institution.applyFailed') || 'Failed to apply credits automatically');
      }
    } catch (error) {
      console.error('Error applying credits:', error);
    }
  };

  const showReviewModal = (transaction: CreditTransaction) => {
    setSelectedTransaction(transaction);
    setReviewModalVisible(true);
  };

  const columns: ColumnsType<CreditTransaction> = [
    {
      title: `${t('tutor.creditsPage.student') || 'Student'} / Student`,
      key: 'student',
      render: (_, record) => (
        <div>
          <div><strong>{record.user.firstName} {record.user.lastName}</strong></div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.user.email}</Text>
        </div>
      ),
    },
    {
      title: `${t('institution.credits') || 'Credits'} / Credits`,
      dataIndex: 'creditsEarned',
      key: 'creditsEarned',
      render: (credits) => (
        <Space>
          <TrophyOutlined style={{ color: '#faad14' }} />
          <Text strong>{parseFloat(credits).toFixed(1)}</Text>
        </Space>
      ),
    },
    {
      title: `${t('institution.academicYear') || 'Academic Year'} / Academic Year`,
      dataIndex: 'academicYear',
      key: 'academicYear',
    },
    {
      title: `${t('institution.submitted') || 'Submitted'} / Submitted`,
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.submittedAt).unix() - dayjs(b.submittedAt).unix(),
    },
    {
      title: `${t('common.status') || 'Status'} / Status`,
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap: Record<string, string> = {
          pending: 'orange',
          approved: 'blue',
          credited: 'green',
          rejected: 'red',
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: `${t('common.actions') || 'Actions'} / Actions`,
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showReviewModal(record)}
          >
            {t('institution.review') || 'Review'} / Review
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  setSelectedTransaction(record);
                  handleApprove(record.id);
                }}
                style={{ color: '#52c41a' }}
              >
                {t('institution.quickApprove') || 'Quick Approve'} / Quick Approve
              </Button>
            </>
          )}
          {record.status === 'approved' && !record.creditedAt && (
            <Button
              type="link"
              onClick={() => applyCredits(record.id)}
            >
              {t('institution.applyCredits') || 'Apply Credits'} / Apply Credits
            </Button>
          )}
        </Space>
      ),
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
            <Typography.Text>{t('common.loading') || 'Loading...'}</Typography.Text>
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
      <Card>
        <Title level={3}>{t('institution.creditApprovals') || 'Credit Approvals'} / Credit Approvals</Title>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'pending',
              label: `${t('institution.pendingReview') || 'Pending Review'} / Pending Review`,
              children: (
                <Table
                  columns={columns}
                  dataSource={transactions}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'approved',
              label: `${t('institution.approved') || 'Approved'} / Approved`,
              children: (
                <Table
                  columns={columns}
                  dataSource={transactions}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'credited',
              label: `${t('institution.credited') || 'Credited'} / Credited`,
              children: (
                <Table
                  columns={columns}
                  dataSource={transactions}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'rejected',
              label: `${t('institution.rejected') || 'Rejected'} / Rejected`,
              children: (
                <Table
                  columns={columns}
                  dataSource={transactions}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Review Modal */}
      <Modal
        title={`${t('institution.reviewCreditTransaction') || 'Review Credit Transaction'} / Review Credit Transaction`}
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          setSelectedTransaction(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        {selectedTransaction && (
          <>
            <Descriptions bordered column={1} style={{ marginBottom: 16 }}>
              <Descriptions.Item label={`${t('tutor.creditsPage.student') || 'Student'} / Student`}>
                {selectedTransaction.user.firstName} {selectedTransaction.user.lastName}
              </Descriptions.Item>
              <Descriptions.Item label={`${t('auth.email') || 'Email'} / Email`}>
                {selectedTransaction.user.email}
              </Descriptions.Item>
              <Descriptions.Item label={`${t('institution.creditsEarned') || 'Credits Earned'} / Credits Earned`}>
                <Space>
                  <TrophyOutlined style={{ color: '#faad14' }} />
                  {parseFloat(selectedTransaction.creditsEarned).toFixed(1)}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label={`${t('institution.academicYear') || 'Academic Year'} / Academic Year`}>
                {selectedTransaction.academicYear}
              </Descriptions.Item>
              <Descriptions.Item label={`${t('institution.bookingId') || 'Booking ID'} / Booking ID`}>
                #{selectedTransaction.bookingId}
              </Descriptions.Item>
              <Descriptions.Item label={`${t('institution.submitted') || 'Submitted'} / Submitted`}>
                {dayjs(selectedTransaction.submittedAt).format('MMMM DD, YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label={`${t('common.status') || 'Status'} / Status`}>
                <Tag color={
                  selectedTransaction.status === 'pending' ? 'orange' :
                  selectedTransaction.status === 'approved' ? 'blue' :
                  selectedTransaction.status === 'credited' ? 'green' : 'red'
                }>
                  {selectedTransaction.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              {selectedTransaction.reviewNotes && (
                <Descriptions.Item label={`${t('institution.reviewNotes') || 'Review Notes'} / Review Notes`}>
                  {selectedTransaction.reviewNotes}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedTransaction.status === 'pending' && (
              <Form form={form} layout="vertical" onFinish={handleReject}>
                <Form.Item label={`${t('institution.reviewNotes') || 'Review Notes'} / Review Notes`} name="reviewNotes">
                  <TextArea rows={3} placeholder={`${t('institution.addReviewNotes') || 'Add notes about this review...'}`} />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={() => handleApprove(selectedTransaction.id)}
                    >
                      {t('institution.approveAndApply') || 'Approve & Apply Credits'} / Approve & Apply Credits
                    </Button>
                    <Button
                      danger
                      icon={<CloseCircleOutlined />}
                      htmlType="submit"
                    >
                      {t('common.reject') || 'Reject'} / Reject
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            )}
          </>
        )}
      </Modal>
    </div>
      </DashboardLayout>
    </App>
  );
}
