'use client';

import { Card, Table, Tag, Button, Space, Select, Typography, Avatar, Modal, Form, DatePicker, InputNumber, App, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const { Title } = Typography;
const { confirm } = Modal;

export default function AdminBookingsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editForm] = Form.useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchBookings();
    }
  }, [status, session, statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await fetch(`/api/bookings${params}`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      message.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: any) => {
    setSelectedBooking(record);
    editForm.setFieldsValue({
      scheduledAt: dayjs(record.scheduledAt),
      duration: record.duration,
      status: record.status,
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async (values: any) => {
    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduledAt: values.scheduledAt.toISOString(),
          duration: values.duration,
          status: values.status,
        }),
      });

      if (response.ok) {
        message.success(t('errors.updateFailed'));
        setEditModalVisible(false);
        editForm.resetFields();
        fetchBookings();
      } else {
        message.error(t('errors.updateFailed'));
      }
    } catch (error) {
      message.error(t('errors.updateFailed'));
    }
  };

  const handleDelete = (record: any) => {
    confirm({
      title: t('admin.usersPage.deleteConfirm'),
      icon: <ExclamationCircleOutlined />,
      content: t('admin.usersPage.permanentDelete'),
      okText: t('admin.usersPage.yesDelete'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      async onOk() {
        try {
          const response = await fetch(`/api/bookings/${record.id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            message.success(t('errors.deleteFailed'));
            fetchBookings();
          } else {
            message.error(t('errors.deleteFailed'));
          }
        } catch (error) {
          message.error(t('errors.deleteFailed'));
        }
      },
    });
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        message.success(newStatus === 'confirmed' ? t('admin.bookingsPage.bookingConfirmed') : t('admin.bookingsPage.bookingCancelled'));
        fetchBookings();
      } else {
        message.error(t('errors.updateFailed'));
      }
    } catch (error) {
      message.error(t('errors.updateFailed'));
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

  if (!session?.user) {
    return null;
  }

  const user = {
    name: session.user.name || '',
    email: session.user.email || '',
    avatar: session.user.image || '',
  };

  const columns = [
    {
      title: t('admin.bookingsPage.student'),
      key: 'student',
      render: (record: any) => (
        <Space>
          <Avatar src={record.student?.avatar}>{record.student?.firstName?.[0]}</Avatar>
          <span>{record.student?.firstName} {record.student?.lastName}</span>
        </Space>
      ),
    },
    {
      title: t('admin.bookingsPage.tutor'),
      key: 'tutor',
      render: (record: any) => (
        <Space>
          <Avatar src={record.tutor?.avatar} />
          <div>
            <div>{record.tutor?.firstName} {record.tutor?.lastName}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.tutor?.subject?.name}</div>
          </div>
        </Space>
      ),
    },
    {
      title: t('admin.bookingsPage.scheduledDate'),
      key: 'scheduledAt',
      render: (record: any) => {
        const date = new Date(record.scheduledAt);
        return (
          <div>
            <div>{date.toLocaleDateString()}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{date.toLocaleTimeString()}</div>
          </div>
        );
      },
    },
    {
      title: t('admin.bookingsPage.duration'),
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration} min`,
    },
    {
      title: t('admin.bookingsPage.price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => `$${price}`,
    },
    {
      title: t('admin.bookingsPage.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: any = {
          pending: 'warning',
          confirmed: 'blue',
          completed: 'success',
          cancelled: 'error',
        };
        return <Tag color={colors[status]}>{t(`admin.bookingsPage.${status}`)}</Tag>;
      },
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (record: any) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button
                size="small"
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleStatusChange(record.id, 'confirmed')}
              >
                {t('admin.bookingsPage.confirm')}
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleStatusChange(record.id, 'cancelled')}
              >
                {t('admin.bookingsPage.cancel')}
              </Button>
            </>
          )}
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            {t('common.edit')}
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            {t('common.delete')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout role="admin" user={user}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>{t('admin.bookingsPage.title')}</Title>
      </div>

      <Card>
        <Space style={{ marginBottom: 16 }} wrap>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
            options={[
              { label: t('common.status'), value: 'all' },
              { label: t('admin.bookingsPage.pending'), value: 'pending' },
              { label: t('admin.bookingsPage.confirmed'), value: 'confirmed' },
              { label: t('admin.bookingsPage.completed'), value: 'completed' },
              { label: t('admin.bookingsPage.cancelled'), value: 'cancelled' },
            ]}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={bookings}
          loading={loading}
          rowKey="id"
          pagination={{
            total: bookings.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} bookings`,
          }}
        />
      </Card>

      <Modal
        title={t('common.edit')}
        open={editModalVisible}
        onCancel={() => { setEditModalVisible(false); editForm.resetFields(); }}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item label={t('admin.bookingsPage.scheduledDate')} name="scheduledAt" rules={[{ required: true }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('admin.bookingsPage.duration')} name="duration" rules={[{ required: true }]}>
            <InputNumber min={30} max={180} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('admin.bookingsPage.status')} name="status" rules={[{ required: true }]}>
            <Select
              options={[
                { label: t('admin.bookingsPage.pending'), value: 'pending' },
                { label: t('admin.bookingsPage.confirmed'), value: 'confirmed' },
                { label: t('admin.bookingsPage.completed'), value: 'completed' },
                { label: t('admin.bookingsPage.cancelled'), value: 'cancelled' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">{t('common.update')}</Button>
              <Button onClick={() => { setEditModalVisible(false); editForm.resetFields(); }}>{t('common.cancel')}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}
