'use client';

import { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Tag, Modal, Form, Input, message, Typography, Tabs, Descriptions } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, TrophyOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

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
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<CreditTransaction | null>(null);
  const [form] = Form.useForm();

  // TODO: Get from authenticated user's session
  const institutionId = 1;
  const currentUserId = 10; // Faculty coordinator ID

  useEffect(() => {
    fetchTransactions();
  }, [activeTab]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        institutionId: institutionId.toString(),
        status: activeTab,
      });

      const response = await fetch(`/api/credits?${params.toString()}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      message.error('Failed to fetch credit transactions');
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transactionId: number) => {
    try {
      const response = await fetch(`/api/credits/${transactionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewedBy: currentUserId,
          reviewNotes: form.getFieldValue('reviewNotes') || 'Approved',
        }),
      });

      if (response.ok) {
        message.success('Credit transaction approved');
        setReviewModalVisible(false);
        form.resetFields();
        fetchTransactions();

        // Automatically apply credits
        await applyCredits(transactionId);
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to approve transaction');
      }
    } catch (error) {
      message.error('Failed to approve transaction');
      console.error('Error approving transaction:', error);
    }
  };

  const handleReject = async (values: any) => {
    if (!selectedTransaction) return;

    try {
      const response = await fetch(`/api/credits/${selectedTransaction.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewedBy: currentUserId,
          reviewNotes: values.reviewNotes,
        }),
      });

      if (response.ok) {
        message.success('Credit transaction rejected');
        setReviewModalVisible(false);
        form.resetFields();
        fetchTransactions();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to reject transaction');
      }
    } catch (error) {
      message.error('Failed to reject transaction');
      console.error('Error rejecting transaction:', error);
    }
  };

  const applyCredits = async (transactionId: number) => {
    try {
      const response = await fetch(`/api/credits/${transactionId}/credit`, {
        method: 'POST',
      });

      if (response.ok) {
        message.success('Credits applied to student balance');
      } else {
        const error = await response.json();
        message.warning(error.error || 'Failed to apply credits automatically');
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
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <div>
          <div><strong>{record.user.firstName} {record.user.lastName}</strong></div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.user.email}</Text>
        </div>
      ),
    },
    {
      title: 'Credits',
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
      title: 'Academic Year',
      dataIndex: 'academicYear',
      key: 'academicYear',
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.submittedAt).unix() - dayjs(b.submittedAt).unix(),
    },
    {
      title: 'Status',
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showReviewModal(record)}
          >
            Review
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
                Quick Approve
              </Button>
            </>
          )}
          {record.status === 'approved' && !record.creditedAt && (
            <Button
              type="link"
              onClick={() => applyCredits(record.id)}
            >
              Apply Credits
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={3}>Credit Approvals</Title>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'pending',
              label: 'Pending Review',
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
              label: 'Approved',
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
              label: 'Credited',
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
              label: 'Rejected',
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
        title="Review Credit Transaction"
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
              <Descriptions.Item label="Student">
                {selectedTransaction.user.firstName} {selectedTransaction.user.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedTransaction.user.email}
              </Descriptions.Item>
              <Descriptions.Item label="Credits Earned">
                <Space>
                  <TrophyOutlined style={{ color: '#faad14' }} />
                  {parseFloat(selectedTransaction.creditsEarned).toFixed(1)}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Academic Year">
                {selectedTransaction.academicYear}
              </Descriptions.Item>
              <Descriptions.Item label="Booking ID">
                #{selectedTransaction.bookingId}
              </Descriptions.Item>
              <Descriptions.Item label="Submitted">
                {dayjs(selectedTransaction.submittedAt).format('MMMM DD, YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={
                  selectedTransaction.status === 'pending' ? 'orange' :
                  selectedTransaction.status === 'approved' ? 'blue' :
                  selectedTransaction.status === 'credited' ? 'green' : 'red'
                }>
                  {selectedTransaction.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              {selectedTransaction.reviewNotes && (
                <Descriptions.Item label="Review Notes">
                  {selectedTransaction.reviewNotes}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedTransaction.status === 'pending' && (
              <Form form={form} layout="vertical" onFinish={handleReject}>
                <Form.Item label="Review Notes" name="reviewNotes">
                  <TextArea rows={3} placeholder="Add notes about this review..." />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={() => handleApprove(selectedTransaction.id)}
                    >
                      Approve & Apply Credits
                    </Button>
                    <Button
                      danger
                      icon={<CloseCircleOutlined />}
                      htmlType="submit"
                    >
                      Reject
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
