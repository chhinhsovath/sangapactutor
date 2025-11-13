'use client';

import { Table, Button, Modal, Rate, Tag, Card, App, Typography, Spin, Space } from 'antd';
import { EyeOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function AdminReviewsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchReviews();
    }
  }, [status, session]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      message.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (review: any) => {
    setSelectedReview(review);
    setDetailModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: t('admin.reviewsPage.deleteConfirm'),
      icon: <ExclamationCircleOutlined />,
      okText: t('admin.reviewsPage.yesDelete'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      async onOk() {
        try {
          const response = await fetch(`/api/reviews/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            message.success(t('admin.reviewsPage.reviewDeleted'));
            fetchReviews();
          } else {
            message.error(t('errors.deleteFailed'));
          }
        } catch (error) {
          message.error(t('errors.deleteFailed'));
        }
      },
    });
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
      title: t('admin.reviewsPage.student'),
      key: 'student',
      render: (_: any, record: any) => {
        const student = record.student;
        return student ? `${student.firstName} ${student.lastName}` : '-';
      },
    },
    {
      title: t('admin.reviewsPage.tutor'),
      key: 'tutor',
      render: (_: any, record: any) => {
        const tutor = record.tutor;
        return tutor ? `${tutor.firstName} ${tutor.lastName}` : '-';
      },
    },
    {
      title: t('admin.reviewsPage.rating'),
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled value={rating} />,
    },
    {
      title: t('admin.reviewsPage.comment'),
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      render: (comment: string) => comment || t('admin.reviewsPage.noComment'),
    },
    {
      title: t('admin.reviewsPage.response'),
      dataIndex: 'tutorResponse',
      key: 'tutorResponse',
      render: (response: string) =>
        response ? (
          <Tag color="green">{t('admin.reviewsPage.responded')}</Tag>
        ) : (
          <Tag>{t('admin.reviewsPage.noResponse')}</Tag>
        ),
    },
    {
      title: t('admin.reviewsPage.submitted'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            {t('admin.reviewsPage.view')}
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            {t('admin.reviewsPage.delete')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout role="admin" user={user}>
      <Title level={2}>{t('admin.reviewsPage.title')}</Title>

      <Card style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={reviews}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={t('admin.reviewsPage.reviewDetails')}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            {t('common.close')}
          </Button>,
        ]}
        width={600}
      >
        {selectedReview && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>{t('admin.reviewsPage.student')}: </Text>
              <Text>{selectedReview.student?.firstName} {selectedReview.student?.lastName}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>{t('admin.reviewsPage.tutor')}: </Text>
              <Text>{selectedReview.tutor?.firstName} {selectedReview.tutor?.lastName}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>{t('admin.reviewsPage.rating')}: </Text>
              <Rate disabled value={selectedReview.rating} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>{t('admin.reviewsPage.comment')}: </Text>
              <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '4px', marginTop: 8 }}>
                {selectedReview.comment || t('admin.reviewsPage.noComment')}
              </div>
            </div>
            {selectedReview.tutorResponse && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>{t('admin.reviewsPage.tutorResponse')}: </Text>
                <div style={{ padding: '12px', background: '#e6f7ff', borderRadius: '4px', marginTop: 8 }}>
                  {selectedReview.tutorResponse}
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                  {t('admin.reviewsPage.respondedOn')}: {dayjs(selectedReview.respondedAt).format('MMM DD, YYYY')}
                </div>
              </div>
            )}
            <div>
              <Text strong>{t('admin.reviewsPage.submitted')}: </Text>
              <Text>{dayjs(selectedReview.createdAt).format('MMM DD, YYYY HH:mm')}</Text>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
