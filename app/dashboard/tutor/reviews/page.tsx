'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Rate, Card, App, Typography, Spin, Space, Tag, Input } from 'antd';
import { MessageOutlined, StarOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function TutorReviewsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.tutorId) {
      fetchReviews();
    }
  }, [status, session]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews?tutorId=${session?.user?.tutorId}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      message.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = (review: any) => {
    setSelectedReview(review);
    form.setFieldsValue({
      tutorResponse: review.tutorResponse || '',
    });
    setResponseModalVisible(true);
  };

  const handleSubmitResponse = async (values: any) => {
    try {
      const response = await fetch(`/api/reviews/${selectedReview.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorResponse: values.tutorResponse,
          respondedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        message.success(t('tutor.reviewsPage.responseSubmitted'));
        setResponseModalVisible(false);
        form.resetFields();
        fetchReviews();
      } else {
        message.error(t('errors.updateFailed'));
      }
    } catch (error) {
      message.error(t('errors.updateFailed'));
    }
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

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return {
      star,
      count,
      percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0,
    };
  });

  const columns = [
    {
      title: t('tutor.reviewsPage.student'),
      key: 'student',
      render: (_: any, record: any) => {
        const student = record.student;
        return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
      },
    },
    {
      title: t('tutor.reviewsPage.rating'),
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled value={rating} />,
    },
    {
      title: t('tutor.reviewsPage.comment'),
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      render: (comment: string) => comment || '-',
    },
    {
      title: t('tutor.reviewsPage.response'),
      dataIndex: 'tutorResponse',
      key: 'tutorResponse',
      render: (response: string) => (
        response ? <Tag color="green">{t('tutor.reviewsPage.responded')}</Tag> : <Tag color="orange">{t('tutor.reviewsPage.noResponse')}</Tag>
      ),
    },
    {
      title: t('common.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a: any, b: any) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          size="small"
          icon={<MessageOutlined />}
          onClick={() => handleRespond(record)}
        >
          {record.tutorResponse ? t('tutor.reviewsPage.editResponse') : t('tutor.reviewsPage.respond')}
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout role="tutor" user={user}>
      <Title level={2}>{t('tutor.reviewsPage.title')}</Title>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1890ff' }}>
              {averageRating.toFixed(1)}
            </div>
            <Rate disabled value={averageRating} allowHalf />
            <div style={{ marginTop: '8px', color: '#666' }}>
              {reviews.length} {t('tutor.reviewsPage.totalReviews')}
            </div>
          </div>
        </Card>

        <Card title={t('tutor.reviewsPage.ratingDistribution')}>
          {ratingDistribution.map((item) => (
            <div key={item.star} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ width: '60px' }}>{item.star} <StarOutlined /></span>
              <div
                style={{
                  flex: 1,
                  height: '8px',
                  background: '#f0f0f0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginRight: '8px',
                }}
              >
                <div
                  style={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    background: '#1890ff',
                  }}
                />
              </div>
              <span style={{ width: '40px', textAlign: 'right' }}>{item.count}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#52c41a' }}>
              {reviews.filter((r) => r.tutorResponse).length}
            </div>
            <div style={{ marginTop: '8px', color: '#666' }}>
              {t('tutor.reviewsPage.ratingsGiven')}
            </div>
            <div style={{ marginTop: '8px', fontSize: '14px' }}>
              {reviews.length > 0
                ? `${((reviews.filter((r) => r.tutorResponse).length / reviews.length) * 100).toFixed(0)}% ${t('tutor.reviewsPage.responseRate')}`
                : t('tutor.reviewsPage.noResponse')}
            </div>
          </div>
        </Card>
      </div>

      {/* Reviews Table */}
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="id"
        loading={loading}
        style={{ marginTop: '24px' }}
      />

      {/* Response Modal */}
      <Modal
        title={`${t('tutor.reviewsPage.respondTo')} ${selectedReview?.student?.firstName || 'Student'}`}
        open={responseModalVisible}
        onCancel={() => {
          setResponseModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        {selectedReview && (
          <div>
            <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
              <div style={{ marginBottom: '8px' }}>
                <Rate disabled value={selectedReview.rating} />
              </div>
              <div>{selectedReview.comment || t('admin.reviewsPage.noComment')}</div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                {dayjs(selectedReview.createdAt).format('MMM DD, YYYY')}
              </div>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmitResponse}>
              <Form.Item
                name="tutorResponse"
                label={t('tutor.reviewsPage.yourResponse')}
                rules={[{ required: true, message: t('errors.required') }]}
              >
                <TextArea
                  rows={6}
                  placeholder={t('tutor.reviewsPage.responsePlaceholder')}
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    {t('tutor.reviewsPage.submitResponse')}
                  </Button>
                  <Button onClick={() => setResponseModalVisible(false)}>{t('common.cancel')}</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
