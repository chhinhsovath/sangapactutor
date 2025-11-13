'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Card, Space, Tag, Typography, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';

const { TextArea } = Input;
const { Title } = Typography;

export default function TutorEarningsPage() {
  const { data: session, status } = useSession();
  const [earningsData, setEarningsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adjustmentModalVisible, setAdjustmentModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock tutor ID - in real app, get from auth
  const tutorId = 1;

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/earnings?tutorId=${tutorId}`);
      const data = await response.json();
      setEarningsData(data);
    } catch (error) {
      message.error('Failed to fetch earnings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdjustment = async (values: any) => {
    try {
      const response = await fetch('/api/earnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorId,
          ...values,
        }),
      });

      if (response.ok) {
        message.success('Adjustment added successfully');
        setAdjustmentModalVisible(false);
        form.resetFields();
        fetchEarnings();
      } else {
        message.error('Failed to add adjustment');
      }
    } catch (error) {
      message.error('Failed to add adjustment');
    }
  };

  const handleDeleteAdjustment = (adjustmentId: number) => {
    Modal.confirm({
      title: 'Delete Adjustment',
      content: 'Are you sure you want to delete this adjustment?',
      okText: 'Yes, Delete',
      okType: 'danger',
      async onOk() {
        try {
          const response = await fetch(`/api/earnings/${adjustmentId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            message.success('Adjustment deleted successfully');
            fetchEarnings();
          } else {
            message.error('Failed to delete adjustment');
          }
        } catch (error) {
          message.error('Failed to delete adjustment');
        }
      },
    });
  };

  const handleExport = () => {
    if (!earningsData) return;

    const csvContent = [
      ['Date', 'Type', 'Student', 'Amount', 'Status'],
      ...earningsData.bookings.map((b: any) => [
        dayjs(b.scheduledAt).format('YYYY-MM-DD'),
        'Lesson',
        b.student ? `${b.student.firstName} ${b.student.lastName}` : 'Unknown',
        `$${b.price}`,
        b.status,
      ]),
      ...earningsData.adjustments.map((a: any) => [
        dayjs(a.createdAt).format('YYYY-MM-DD'),
        a.type === 'bonus' ? 'Bonus' : 'Deduction',
        a.reason,
        a.type === 'bonus' ? `+$${a.amount}` : `-$${a.amount}`,
        'Adjustment',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings-${dayjs().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    message.success('Earnings exported successfully');
  };

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout role="tutor" user={{ name: '', email: '', avatar: '' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (!session?.user || !session?.user?.tutorId) {
    return null;
  }

  const user = {
    name: session.user.name || '',
    email: session.user.email || '',
    avatar: session.user.image || '',
  };

  const bookingColumns = [
    {
      title: 'Date',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a: any, b: any) => dayjs(a.scheduledAt).unix() - dayjs(b.scheduledAt).unix(),
    },
    {
      title: 'Student Name',
      key: 'student',
      render: (_: any, record: any) => {
        const student = record.student;
        return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
      },
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration} min`,
    },
    {
      title: 'Amount',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>+${price}</span>
      ),
    },
  ];

  const adjustmentColumns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'bonus' ? 'green' : 'red'}>
          {type === 'bonus' ? 'Bonus' : 'Deduction'}
        </Tag>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string, record: any) => (
        <span style={{ color: record.type === 'bonus' ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' }}>
          {record.type === 'bonus' ? '+' : '-'}${amount}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteAdjustment(record.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout role="tutor" user={user}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>Earnings</Title>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAdjustmentModalVisible(true)}
            >
              Add Adjustment
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              Export CSV
            </Button>
          </Space>
        </div>

        {/* Summary Cards */}
        {earningsData && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                  Total Earnings
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1890ff' }}>
                  ${earningsData.totalEarnings.toFixed(2)}
                </div>
              </div>
            </Card>

            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                  From Lessons
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#52c41a' }}>
                  ${earningsData.totalFromBookings.toFixed(2)}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {earningsData.bookings.length} completed lessons
                </div>
              </div>
            </Card>

            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                  Adjustments
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: earningsData.totalAdjustments >= 0 ? '#52c41a' : '#ff4d4f' }}>
                  {earningsData.totalAdjustments >= 0 ? '+' : ''}${earningsData.totalAdjustments.toFixed(2)}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {earningsData.adjustments.length} adjustments
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Lesson Earnings */}
        <div style={{ marginTop: '32px' }}>
          <Title level={3}>Lesson Earnings</Title>
          <Table
            columns={bookingColumns}
            dataSource={earningsData?.bookings || []}
            rowKey="id"
            loading={loading}
            style={{ marginTop: '16px' }}
          />
        </div>

        {/* Adjustments */}
        <div style={{ marginTop: '32px' }}>
          <Title level={3}>Adjustments</Title>
          <Table
            columns={adjustmentColumns}
            dataSource={earningsData?.adjustments || []}
            rowKey="id"
            loading={loading}
            style={{ marginTop: '16px' }}
          />
        </div>

        {/* Add Adjustment Modal */}
        <Modal
          title="Add Earnings Adjustment"
          open={adjustmentModalVisible}
          onCancel={() => {
            setAdjustmentModalVisible(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleAddAdjustment}>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'This field is required' }]}
            >
              <Select>
                <Select.Option value="bonus">Bonus</Select.Option>
                <Select.Option value="deduction">Deduction</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="amount"
              label="Amount ($)"
              rules={[{ required: true, message: 'This field is required' }]}
            >
              <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="reason"
              label="Reason"
              rules={[{ required: true, message: 'This field is required' }]}
            >
              <TextArea rows={3} placeholder="Enter reason for adjustment" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Add Adjustment
                </Button>
                <Button onClick={() => setAdjustmentModalVisible(false)}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
