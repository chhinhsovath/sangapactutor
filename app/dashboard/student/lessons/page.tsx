'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, DatePicker, Tag, App, Space, Typography, Spin } from 'antd';
import { CalendarOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function StudentLessonsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchBookings();
    }
  }, [status, session]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bookings?studentId=${session?.user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      message.error(t('student.lessonsPage.failedToFetch'));
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = (record: any) => {
    setSelectedBooking(record);
    form.setFieldsValue({
      scheduledAt: dayjs(record.scheduledAt),
    });
    setRescheduleModalVisible(true);
  };

  const handleRescheduleSubmit = async (values: any) => {
    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduledAt: values.scheduledAt.toISOString(),
          status: 'pending',
        }),
      });

      if (response.ok) {
        message.success(t('student.lessonsPage.lessonRescheduled'));
        setRescheduleModalVisible(false);
        form.resetFields();
        fetchBookings();
      } else {
        message.error(t('student.lessonsPage.failedToReschedule'));
      }
    } catch (error) {
      message.error(t('student.lessonsPage.failedToReschedule'));
    }
  };

  const handleCancel = (record: any) => {
    Modal.confirm({
      title: t('student.lessonsPage.cancelLesson'),
      content: t('student.lessonsPage.cancelConfirm'),
      okText: t('student.lessonsPage.yesCancel'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      async onOk() {
        try {
          const response = await fetch(`/api/bookings/${record.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'cancelled' }),
          });

          if (response.ok) {
            message.success(t('student.lessonsPage.lessonCancelled'));
            fetchBookings();
          } else {
            message.error(t('student.lessonsPage.failedToCancel'));
          }
        } catch (error) {
          message.error(t('student.lessonsPage.failedToCancel'));
        }
      },
    });
  };

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout role="student" user={{ name: '', email: '', avatar: '' }}>
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
      title: t('student.lessonsPage.tutor'),
      key: 'tutor',
      render: (_: any, record: any) => {
        const tutor = record.tutor;
        return tutor ? `${tutor.firstName} ${tutor.lastName}` : 'Unknown';
      },
    },
    {
      title: t('student.lessonsPage.subject'),
      key: 'subject',
      render: (_: any, record: any) => record.tutor?.subject?.name || '-',
    },
    {
      title: t('student.lessonsPage.scheduledDate'),
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY HH:mm'),
      sorter: (a: any, b: any) => dayjs(a.scheduledAt).unix() - dayjs(b.scheduledAt).unix(),
    },
    {
      title: t('student.lessonsPage.duration'),
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration} min`,
    },
    {
      title: t('student.lessonsPage.price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => `$${price}`,
    },
    {
      title: t('student.lessonsPage.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: any = {
          pending: 'orange',
          confirmed: 'blue',
          completed: 'green',
          cancelled: 'red',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: t('student.lessonsPage.meetingLink'),
      dataIndex: 'meetingLink',
      key: 'meetingLink',
      render: (link: string) =>
        link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            {t('student.lessonsPage.joinMeeting')}
          </a>
        ) : (
          '-'
        ),
    },
    {
      title: t('student.lessonsPage.actions'),
      key: 'actions',
      render: (_: any, record: any) => {
        const canReschedule = ['pending', 'confirmed'].includes(record.status);
        const canCancel = ['pending', 'confirmed'].includes(record.status);

        return (
          <Space>
            {canReschedule && (
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleReschedule(record)}
              >
                {t('student.lessonsPage.reschedule')}
              </Button>
            )}
            {canCancel && (
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleCancel(record)}
              >
                {t('student.lessonsPage.cancel')}
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <DashboardLayout role="student" user={user}>
      <Title level={2}>{t('student.lessonsPage.title')}</Title>
      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="id"
        loading={loading}
        style={{ marginTop: '16px' }}
      />

      {/* Reschedule Modal */}
      <Modal
        title={t('student.lessonsPage.rescheduleLesson')}
        open={rescheduleModalVisible}
        onCancel={() => {
          setRescheduleModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleRescheduleSubmit}>
          <Form.Item
            name="scheduledAt"
            label={t('student.lessonsPage.newDateTime')}
            rules={[{ required: true, message: t('student.lessonsPage.selectDateTime') }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('student.lessonsPage.reschedule')}
              </Button>
              <Button onClick={() => setRescheduleModalVisible(false)}>{t('common.cancel')}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}
