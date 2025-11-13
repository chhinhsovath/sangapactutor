'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, App, Card, Typography, Spin, Space, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, DollarOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

export default function AdminEarningsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [tutors, setTutors] = useState<any[]>([]);
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [adjustmentModalVisible, setAdjustmentModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [tutorEarnings, setTutorEarnings] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchData();
    }
  }, [status, session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tutorsRes, adjustmentsRes] = await Promise.all([
        fetch('/api/tutors'),
        fetch('/api/admin/earnings-adjustments'),
      ]);

      const tutorsData = await tutorsRes.json();
      const adjustmentsData = await adjustmentsRes.json();

      setTutors(tutorsData);
      setAdjustments(adjustmentsData);
    } catch (error) {
      message.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdjustment = () => {
    form.resetFields();
    setAdjustmentModalVisible(true);
  };

  const handleSubmitAdjustment = async (values: any) => {
    try {
      const response = await fetch('/api/admin/earnings-adjustments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          createdBy: session?.user?.id,
        }),
      });

      if (response.ok) {
        message.success(t('admin.earningsPage.adjustmentAdded'));
        setAdjustmentModalVisible(false);
        form.resetFields();
        fetchData();
      } else {
        message.error(t('errors.createFailed'));
      }
    } catch (error) {
      message.error(t('errors.createFailed'));
    }
  };

  const handleDeleteAdjustment = (adjustmentId: number) => {
    Modal.confirm({
      title: t('admin.earningsPage.deleteAdjustment'),
      content: t('admin.earningsPage.deleteConfirm'),
      okText: t('common.yes'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      async onOk() {
        try {
          const response = await fetch(`/api/admin/earnings-adjustments/${adjustmentId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            message.success(t('admin.earningsPage.adjustmentDeleted'));
            fetchData();
          } else {
            message.error(t('errors.deleteFailed'));
          }
        } catch (error) {
          message.error(t('errors.deleteFailed'));
        }
      },
    });
  };

  const handleViewDetails = async (tutor: any) => {
    setSelectedTutor(tutor);
    setDetailModalVisible(true);
    
    try {
      const response = await fetch(`/api/earnings?tutorId=${tutor.id}`);
      const data = await response.json();
      setTutorEarnings(data);
    } catch (error) {
      message.error(t('errors.fetchFailed'));
    }
  };

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout role="admin" user={{ name: '', email: '', avatar: '' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (!session?.user || session?.user?.role !== 'admin') {
    return null;
  }

  const user = {
    name: session.user.name || '',
    email: session.user.email || '',
    avatar: session.user.image || '',
  };

  // Calculate total earnings per tutor
  const tutorsWithEarnings = tutors.map((tutor) => {
    const tutorAdjustments = adjustments.filter((adj) => adj.tutorId === tutor.id);
    const totalAdjustments = tutorAdjustments.reduce((sum, adj) => {
      return sum + (adj.type === 'bonus' ? parseFloat(adj.amount) : -parseFloat(adj.amount));
    }, 0);

    return {
      ...tutor,
      totalAdjustments,
      adjustmentCount: tutorAdjustments.length,
    };
  });

  const tutorColumns = [
    {
      title: t('admin.earningsPage.tutor'),
      key: 'tutor',
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>
            {record.firstName} {record.lastName}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {record.subject?.name}
          </div>
        </div>
      ),
    },
    {
      title: t('admin.earningsPage.adjustments'),
      dataIndex: 'adjustmentCount',
      key: 'adjustmentCount',
      sorter: (a: any, b: any) => a.adjustmentCount - b.adjustmentCount,
    },
    {
      title: t('admin.earningsPage.totalAdjustments'),
      key: 'totalAdjustments',
      render: (_: any, record: any) => (
        <span style={{ 
          color: record.totalAdjustments >= 0 ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold' 
        }}>
          {record.totalAdjustments >= 0 ? '+' : ''}${record.totalAdjustments.toFixed(2)}
        </span>
      ),
      sorter: (a: any, b: any) => a.totalAdjustments - b.totalAdjustments,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: any, record: any) => (
        <Button size="small" onClick={() => handleViewDetails(record)}>
          {t('admin.earningsPage.viewDetails')}
        </Button>
      ),
    },
  ];

  const adjustmentColumns = [
    {
      title: t('common.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a: any, b: any) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: t('admin.earningsPage.tutor'),
      key: 'tutor',
      render: (_: any, record: any) => {
        const tutor = tutors.find((t) => t.id === record.tutorId);
        return tutor ? `${tutor.firstName} ${tutor.lastName}` : 'Unknown';
      },
    },
    {
      title: t('tutor.earningsPage.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'bonus' ? 'green' : 'red'}>
          {type === 'bonus' ? t('tutor.earningsPage.bonus') : t('tutor.earningsPage.deduction')}
        </Tag>
      ),
    },
    {
      title: t('tutor.earningsPage.reason'),
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
    {
      title: t('tutor.earningsPage.amount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string, record: any) => (
        <span style={{ 
          color: record.type === 'bonus' ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold' 
        }}>
          {record.type === 'bonus' ? '+' : '-'}${amount}
        </span>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteAdjustment(record.id)}
        >
          {t('common.delete')}
        </Button>
      ),
    },
  ];

  const totalAdjustments = adjustments.reduce((sum, adj) => {
    return sum + (adj.type === 'bonus' ? parseFloat(adj.amount) : -parseFloat(adj.amount));
  }, 0);

  return (
    <App>
      <DashboardLayout role="admin" user={user}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={2}>{t('admin.earningsPage.title')}</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddAdjustment}>
            {t('admin.earningsPage.addAdjustment')}
          </Button>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                {t('admin.earningsPage.totalTutors')}
              </div>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: '#1890ff' }}>
                {tutors.length}
              </div>
            </div>
          </Card>

          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                {t('admin.earningsPage.totalAdjustmentsGiven')}
              </div>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: totalAdjustments >= 0 ? '#52c41a' : '#ff4d4f' }}>
                {totalAdjustments >= 0 ? '+' : ''}${totalAdjustments.toFixed(2)}
              </div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                {adjustments.length} {t('admin.earningsPage.adjustmentsCount')}
              </div>
            </div>
          </Card>
        </div>

        {/* Tutors Table */}
        <Card title={t('admin.earningsPage.tutorEarnings')} style={{ marginBottom: 24 }}>
          <Table
            columns={tutorColumns}
            dataSource={tutorsWithEarnings}
            rowKey="id"
            loading={loading}
          />
        </Card>

        {/* All Adjustments Table */}
        <Card title={t('admin.earningsPage.allAdjustments')}>
          <Table
            columns={adjustmentColumns}
            dataSource={adjustments}
            rowKey="id"
            loading={loading}
          />
        </Card>

        {/* Add Adjustment Modal */}
        <Modal
          title={t('admin.earningsPage.addEarningsAdjustment')}
          open={adjustmentModalVisible}
          onCancel={() => {
            setAdjustmentModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmitAdjustment}>
            <Form.Item
              name="tutorId"
              label={t('admin.earningsPage.selectTutor')}
              rules={[{ required: true, message: t('errors.required') }]}
            >
              <Select
                showSearch
                placeholder={t('admin.earningsPage.selectTutorPlaceholder')}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={tutors.map((tutor) => ({
                  value: tutor.id,
                  label: `${tutor.firstName} ${tutor.lastName} - ${tutor.subject?.name}`,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="type"
              label={t('tutor.earningsPage.type')}
              rules={[{ required: true, message: t('errors.required') }]}
            >
              <Select>
                <Select.Option value="bonus">{t('tutor.earningsPage.bonus')}</Select.Option>
                <Select.Option value="deduction">{t('tutor.earningsPage.deduction')}</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="amount"
              label={t('tutor.earningsPage.amount')} 
              rules={[{ required: true, message: t('errors.required') }]}
            >
              <InputNumber
                min={0.01}
                step={0.01}
                style={{ width: '100%' }}
                addonBefore="$"
              />
            </Form.Item>

            <Form.Item
              name="reason"
              label={t('tutor.earningsPage.reason')}
              rules={[{ required: true, message: t('errors.required') }]}
            >
              <TextArea
                rows={3}
                placeholder={t('tutor.earningsPage.reasonPlaceholder')}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {t('common.submit')}
                </Button>
                <Button onClick={() => setAdjustmentModalVisible(false)}>
                  {t('common.cancel')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Tutor Details Modal */}
        <Modal
          title={`${t('admin.earningsPage.earningsDetails')} - ${selectedTutor?.firstName} ${selectedTutor?.lastName}`}
          open={detailModalVisible}
          onCancel={() => {
            setDetailModalVisible(false);
            setSelectedTutor(null);
            setTutorEarnings(null);
          }}
          footer={null}
          width={800}
        >
          {tutorEarnings && (
            <div>
              {/* Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#666' }}>{t('admin.earningsPage.totalEarnings')}</div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                      ${tutorEarnings.totalEarnings.toFixed(2)}
                    </div>
                  </div>
                </Card>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#666' }}>{t('admin.earningsPage.fromLessons')}</div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                      ${tutorEarnings.totalFromBookings.toFixed(2)}
                    </div>
                  </div>
                </Card>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#666' }}>{t('admin.earningsPage.adjustments')}</div>
                    <div style={{ 
                      fontSize: 24, 
                      fontWeight: 'bold',
                      color: tutorEarnings.totalAdjustments >= 0 ? '#52c41a' : '#ff4d4f' 
                    }}>
                      {tutorEarnings.totalAdjustments >= 0 ? '+' : ''}${tutorEarnings.totalAdjustments.toFixed(2)}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Lessons */}
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>{t('admin.earningsPage.recentLessons')}</Title>
                <Table
                  size="small"
                  columns={[
                    {
                      title: t('common.date'),
                      dataIndex: 'scheduledAt',
                      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
                    },
                    {
                      title: t('admin.earningsPage.student'),
                      render: (_: any, record: any) => 
                        `${record.student?.firstName} ${record.student?.lastName}`,
                    },
                    {
                      title: t('tutor.earningsPage.amount'),
                      dataIndex: 'price',
                      render: (price: string) => <span style={{ color: '#52c41a' }}>+${price}</span>,
                    },
                  ]}
                  dataSource={tutorEarnings.bookings.slice(0, 5)}
                  rowKey="id"
                  pagination={false}
                />
              </div>

              {/* Adjustments */}
              <div>
                <Title level={5}>{t('admin.earningsPage.adjustments')}</Title>
                <Table
                  size="small"
                  columns={[
                    {
                      title: t('common.date'),
                      dataIndex: 'createdAt',
                      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
                    },
                    {
                      title: t('tutor.earningsPage.type'),
                      dataIndex: 'type',
                      render: (type: string) => (
                        <Tag color={type === 'bonus' ? 'green' : 'red'}>
                          {type === 'bonus' ? t('tutor.earningsPage.bonus') : t('tutor.earningsPage.deduction')}
                        </Tag>
                      ),
                    },
                    {
                      title: t('tutor.earningsPage.reason'),
                      dataIndex: 'reason',
                      ellipsis: true,
                    },
                    {
                      title: t('tutor.earningsPage.amount'),
                      render: (_: any, record: any) => (
                        <span style={{ 
                          color: record.type === 'bonus' ? '#52c41a' : '#ff4d4f',
                          fontWeight: 'bold' 
                        }}>
                          {record.type === 'bonus' ? '+' : '-'}${record.amount}
                        </span>
                      ),
                    },
                  ]}
                  dataSource={tutorEarnings.adjustments}
                  rowKey="id"
                  pagination={false}
                />
              </div>
            </div>
          )}
        </Modal>
      </DashboardLayout>
    </App>
  );
}
