'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Rate, Input, App, Typography, Spin, Empty, Tag } from 'antd';
import { PlusOutlined, StarFilled } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function StudentReviewsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [completedLessons, setCompletedLessons] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchData();
    }
  }, [status, session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reviewsRes, bookingsRes] = await Promise.all([
        fetch(`/api/reviews?studentId=${session?.user?.id}`),
        fetch(`/api/bookings?studentId=${session?.user?.id}&status=completed`),
      ]);

      const reviewsData = await reviewsRes.json();
      const bookingsData = await bookingsRes.json();

      setReviews(reviewsData);
      
      // Filter out lessons that already have reviews
      const reviewedBookingIds = new Set(reviewsData.map((r: any) => r.bookingId));
      const unreviewed = bookingsData.filter((b: any) => !reviewedBookingIds.has(b.id));
      setCompletedLessons(unreviewed);
    } catch (error) {
      message.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = (lesson: any) => {
    setSelectedLesson(lesson);
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedLesson.id,
          studentId: session?.user?.id,
          tutorId: selectedLesson.tutorId,
          rating: values.rating,
          comment: values.comment || null,
        }),
      });

      if (response.ok) {
        message.success(t('student.reviewsPage.reviewSubmitted'));
        setModalVisible(false);
        form.resetFields();
        fetchData();
      } else {
        const error = await response.json();
        message.error(error.error || t('student.reviewsPage.reviewFailed'));
      }
    } catch (error) {
      message.error(t('student.reviewsPage.reviewFailed'));
    }
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

  const reviewColumns = [
    {
      title: t('student.reviewsPage.tutor'),
      key: 'tutor',
      render: (_: any, record: any) => (
        <div>
          <Text strong>{record.tutor.firstName} {record.tutor.lastName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.tutor.subject.name}</Text>
        </div>
      ),
    },
    {
      title: t('student.reviewsPage.yourRating'),
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <div>
          <Rate disabled value={rating} style={{ fontSize: 14 }} />
          <br />
          <Text>{rating}/5</Text>
        </div>
      ),
    },
    {
      title: t('student.reviewsPage.yourComment'),
      dataIndex: 'comment',
      key: 'comment',
      render: (comment: string) => comment || <Text type="secondary">-</Text>,
    },
    {
      title: t('student.reviewsPage.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
    },
  ];

  return (
    <App>
      <DashboardLayout role="student" user={user}>
        <Title level={2}>{t('student.reviewsPage.title')}</Title>

        {/* Completed Lessons to Review */}
        {completedLessons.length > 0 && (
          <Card
            title={`${completedLessons.length} ${t('student.reviewsPage.lesson')}${completedLessons.length > 1 ? 's' : ''} waiting for review`}
            style={{ marginBottom: 24 }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {completedLessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  size="small"
                  style={{ width: 280 }}
                  hoverable
                >
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>{lesson.tutor.firstName} {lesson.tutor.lastName}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(lesson.scheduledAt).format('MMM D, YYYY')}
                    </Text>
                  </div>
                  <Button 
                    type="primary" 
                    size="small" 
                    icon={<PlusOutlined />}
                    onClick={() => handleWriteReview(lesson)}
                    block
                  >
                    {t('student.reviewsPage.writeReview')}
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* My Reviews */}
        <Card title="My Reviews">
          {reviews.length === 0 ? (
            <Empty description={t('student.reviewsPage.noReviews')} />
          ) : (
            <Table
              columns={reviewColumns}
              dataSource={reviews}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          )}
        </Card>

        {/* Write Review Modal */}
        <Modal
          title={`${t('student.reviewsPage.reviewFor')} ${selectedLesson?.tutor.firstName} ${selectedLesson?.tutor.lastName}`}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="rating"
              label={t('student.reviewsPage.rating')}
              rules={[{ required: true, message: t('student.reviewsPage.ratingRequired') }]}
            >
              <Rate style={{ fontSize: 32 }} />
            </Form.Item>

            <Form.Item
              name="comment"
              label={t('student.reviewsPage.comment')}
            >
              <TextArea 
                rows={4} 
                placeholder={t('student.reviewsPage.commentPlaceholder')}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {t('student.reviewsPage.submitReview')}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </DashboardLayout>
    </App>
  );
}
