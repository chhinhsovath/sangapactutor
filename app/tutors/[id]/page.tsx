'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Typography, Button, Rate, Tag, Card, Avatar, Spin, Space, Modal, Form, DatePicker, InputNumber, Input, App, Divider } from 'antd';
import { EnvironmentOutlined, CheckCircleOutlined, StarOutlined, ClockCircleOutlined, BookOutlined, MessageOutlined, VideoCameraOutlined, TrophyOutlined } from '@ant-design/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function TutorPublicPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { data: session } = useSession();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [tutor, setTutor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [bookingForm] = Form.useForm();
  const [messageForm] = Form.useForm();

  useEffect(() => {
    fetchTutorData();
  }, [params.id]);

  const fetchTutorData = async () => {
    try {
      setLoading(true);
      const [tutorRes, reviewsRes] = await Promise.all([
        fetch(`/api/tutors/${params.id}`),
        fetch(`/api/reviews?tutorId=${params.id}`),
      ]);

      if (!tutorRes.ok) {
        router.push('/404');
        return;
      }

      const tutorData = await tutorRes.json();
      const reviewsData = await reviewsRes.json();

      setTutor(tutorData);
      setReviews(reviewsData);
    } catch (error) {
      message.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleBookLesson = () => {
    if (!session) {
      router.push('/login');
      return;
    }
    bookingForm.resetFields();
    setBookingModalVisible(true);
  };

  const handleSendMessage = () => {
    if (!session) {
      router.push('/login');
      return;
    }
    messageForm.resetFields();
    setMessageModalVisible(true);
  };

  const handleBookingSubmit = async (values: any) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: session?.user?.id,
          tutorId: tutor.id,
          scheduledAt: values.scheduledAt.toISOString(),
          duration: values.duration,
          price: (tutor.hourlyRate * (values.duration / 60)).toFixed(2),
          notes: values.notes || null,
        }),
      });

      if (response.ok) {
        message.success(t('student.findTutorsPage.bookingSuccess'));
        setBookingModalVisible(false);
        bookingForm.resetFields();
      } else {
        message.error(t('student.findTutorsPage.bookingFailed'));
      }
    } catch (error) {
      message.error(t('student.findTutorsPage.bookingFailed'));
    }
  };

  const handleMessageSubmit = async (values: any) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: session?.user?.id,
          receiverId: tutor.userId,
          message: values.message,
        }),
      });

      if (response.ok) {
        message.success(t('student.messagesPage.messageSent'));
        setMessageModalVisible(false);
        messageForm.resetFields();
      } else {
        message.error(t('student.messagesPage.failedToSend'));
      }
    } catch (error) {
      message.error(t('student.messagesPage.failedToSend'));
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <Title level={2}>{t('tutorDetail.tutorNotFound')}</Title>
        <Paragraph>{t('tutorDetail.tutorNotFoundDesc')}</Paragraph>
        <Link href="/">
          <Button type="primary">{t('tutorDetail.backToHome')}</Button>
        </Link>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const spokenLanguages = tutor.spokenLanguages ? JSON.parse(tutor.spokenLanguages) : [];

  return (
    <App>
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px 0', marginBottom: 24 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <Link href="/">
              <Button type="text" style={{ color: 'white', marginBottom: 16 }}>← {t('tutorDetail.backToHome')}</Button>
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            {/* Left Column */}
            <div>
              {/* Tutor Header Card */}
              <Card style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 24 }}>
                  <Avatar size={120} src={tutor.avatar}>
                    {tutor.firstName?.charAt(0)}{tutor.lastName?.charAt(0)}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <Title level={2} style={{ marginBottom: 8 }}>
                      {tutor.firstName} {tutor.lastName}
                    </Title>
                    <Space wrap>
                      <Tag icon={<BookOutlined />} color="blue">
                        {tutor.subject?.name}
                      </Tag>
                      <Tag icon={<EnvironmentOutlined />}>
                        {tutor.country?.flag} {tutor.country?.name}
                      </Tag>
                      {tutor.verified && (
                        <Tag icon={<CheckCircleOutlined />} color="success">
                          {t('tutorDetail.verifiedTutor')}
                        </Tag>
                      )}
                    </Space>
                    <div style={{ marginTop: 12 }}>
                      <Rate disabled value={averageRating} allowHalf />
                      <Text style={{ marginLeft: 8 }}>
                        {averageRating.toFixed(1)} ({reviews.length} {t('tutorDetail.reviews')})
                      </Text>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>
                        ${tutor.hourlyRate}
                      </Text>
                      <Text type="secondary"> {t('tutorDetail.perHour')}</Text>
                    </div>
                  </div>
                </div>
              </Card>

              {/* About Section */}
              <Card title="About Me" style={{ marginBottom: 24 }}>
                <Paragraph>{tutor.bio}</Paragraph>
                
                {tutor.teachingStyle && (
                  <>
                    <Title level={5}>Teaching Style</Title>
                    <Paragraph>{tutor.teachingStyle}</Paragraph>
                  </>
                )}

                <div style={{ marginTop: 16 }}>
                  <Space wrap>
                    {tutor.specialization && (
                      <Tag color="purple">Specialization: {tutor.specialization}</Tag>
                    )}
                    {tutor.level && (
                      <Tag color="green">Level: {tutor.level}</Tag>
                    )}
                    {tutor.yearsExperience && (
                      <Tag icon={<TrophyOutlined />} color="gold">
                        {tutor.yearsExperience} {t('tutorDetail.yearsExperience')}
                      </Tag>
                    )}
                  </Space>
                </div>

                {spokenLanguages.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <Title level={5}>{t('tutorDetail.languagesSpoken')}</Title>
                    <Space wrap>
                      {spokenLanguages.map((lang: string, idx: number) => (
                        <Tag key={idx}>{lang}</Tag>
                      ))}
                    </Space>
                  </div>
                )}

                {tutor.videoIntro && (
                  <div style={{ marginTop: 16 }}>
                    <Button icon={<VideoCameraOutlined />} href={tutor.videoIntro} target="_blank">
                      Watch Introduction Video
                    </Button>
                  </div>
                )}
              </Card>

              {/* Reviews Section */}
              <Card title={`${t('tutorDetail.reviews')} (${reviews.length})`}>
                {reviews.length === 0 ? (
                  <Text type="secondary">No reviews yet</Text>
                ) : (
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {reviews.slice(0, 5).map((review: any) => (
                      <div key={review.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div>
                            <Text strong>
                              {review.student?.firstName} {review.student?.lastName}
                            </Text>
                            <div>
                              <Rate disabled value={review.rating} style={{ fontSize: 14 }} />
                            </div>
                          </div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {dayjs(review.createdAt).format('MMM DD, YYYY')}
                          </Text>
                        </div>
                        {review.comment && <Paragraph>{review.comment}</Paragraph>}
                        {review.tutorResponse && (
                          <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                            <Text type="secondary" strong>Tutor's Response:</Text>
                            <Paragraph style={{ marginTop: 4, marginBottom: 0 }}>{review.tutorResponse}</Paragraph>
                          </div>
                        )}
                        {reviews.indexOf(review) < reviews.length - 1 && <Divider />}
                      </div>
                    ))}
                  </Space>
                )}
              </Card>
            </div>

            {/* Right Column - Booking Card */}
            <div>
              <Card style={{ position: 'sticky', top: 24 }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#1890ff' }}>
                    ${tutor.hourlyRate}
                  </Text>
                  <Text type="secondary"> {t('tutorDetail.perHour')}</Text>
                </div>

                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<BookOutlined />}
                    onClick={handleBookLesson}
                  >
                    {t('tutorDetail.bookTrialLesson')}
                  </Button>
                  <Button
                    size="large"
                    block
                    icon={<MessageOutlined />}
                    onClick={handleSendMessage}
                  >
                    {t('tutorDetail.sendMessage')}
                  </Button>
                </Space>

                <Divider />

                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ClockCircleOutlined style={{ color: '#52c41a' }} />
                    <Text type="secondary">{t('tutorDetail.responseWithin24')}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StarOutlined style={{ color: '#faad14' }} />
                    <Text type="secondary">
                      {averageRating.toFixed(1)} avg rating ({reviews.length} reviews)
                    </Text>
                  </div>
                  {tutor.lessonsCompleted > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <TrophyOutlined style={{ color: '#1890ff' }} />
                      <Text type="secondary">
                        {tutor.lessonsCompleted} {t('tutorDetail.lessonsCompleted')}
                      </Text>
                    </div>
                  )}
                </Space>
              </Card>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <Modal
          title={`${t('student.findTutorsPage.bookingTitle')} ${tutor.firstName} ${tutor.lastName}`}
          open={bookingModalVisible}
          onCancel={() => {
            setBookingModalVisible(false);
            bookingForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form form={bookingForm} layout="vertical" onFinish={handleBookingSubmit}>
            <Form.Item
              name="scheduledAt"
              label={t('student.findTutorsPage.selectDateTime')}
              rules={[{ required: true, message: t('student.findTutorsPage.selectDateTimeRequired') }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="duration"
              label={t('student.findTutorsPage.duration')}
              rules={[{ required: true, message: t('student.findTutorsPage.durationRequired') }]}
              initialValue={60}
            >
              <InputNumber
                min={30}
                max={180}
                step={15}
                style={{ width: '100%' }}
                addonAfter="minutes"
              />
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.duration !== currentValues.duration}
            >
              {({ getFieldValue }) => {
                const duration = getFieldValue('duration') || 60;
                const price = (parseFloat(tutor.hourlyRate) * (duration / 60)).toFixed(2);
                return (
                  <div style={{ marginBottom: 16, padding: 12, background: '#f0f2f5', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t('student.findTutorsPage.totalPrice')}:</span>
                      <span style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>${price}</span>
                    </div>
                  </div>
                );
              }}
            </Form.Item>

            <Form.Item
              name="notes"
              label={t('student.findTutorsPage.notes')}
            >
              <TextArea 
                rows={3} 
                placeholder={t('student.findTutorsPage.notesPlaceholder')}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                {t('student.findTutorsPage.confirmBooking')}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Message Modal */}
        <Modal
          title={`${t('tutorDetail.sendMessage')} ${tutor.firstName} ${tutor.lastName}`}
          open={messageModalVisible}
          onCancel={() => {
            setMessageModalVisible(false);
            messageForm.resetFields();
          }}
          footer={null}
          width={500}
        >
          <Form form={messageForm} layout="vertical" onFinish={handleMessageSubmit}>
            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: 'Please enter your message' }]}
            >
              <TextArea 
                rows={6} 
                placeholder={t('student.messagesPage.typeMessage')}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                {t('student.messagesPage.send')}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </App>
  );
}
