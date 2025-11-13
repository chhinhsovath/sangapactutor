'use client';

import { Card, Row, Col, Statistic, Typography, List, Avatar, Tag, Button, Progress, Space, Timeline, Spin } from 'antd';
import { BookOutlined, ClockCircleOutlined, StarFilled, TrophyOutlined, CalendarOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

interface Booking {
  id: number;
  scheduledAt: string;
  duration: number;
  status: string;
  tutor: {
    firstName: string;
    lastName: string;
    avatar: string | null;
    subject: {
      name: string;
    };
  };
}

export default function StudentDashboard() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalLessons: 0,
    hoursLearned: 0,
    activeTutors: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchDashboardData();
    }
  }, [status, session]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch student's bookings
      const bookingsRes = await fetch(`/api/bookings?studentId=${session?.user?.id}`);
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData);

      // Calculate stats
      const completed = bookingsData.filter((b: any) => b.status === 'completed');
      const totalHours = completed.reduce((sum: number, b: any) => sum + (b.duration / 60), 0);
      const uniqueTutors = new Set(bookingsData.map((b: any) => b.tutorId)).size;

      setStats({
        totalLessons: completed.length,
        hoursLearned: Math.round(totalHours * 10) / 10,
        activeTutors: uniqueTutors,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  // Get upcoming lessons (confirmed and future)
  const upcomingLessons = bookings
    .filter(b => 
      (b.status === 'confirmed' || b.status === 'pending') && 
      new Date(b.scheduledAt) > new Date()
    )
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3);

  // Calculate learning progress by subject
  const subjectProgress = bookings
    .filter(b => b.status === 'completed')
    .reduce((acc: any, booking) => {
      const subject = booking.tutor.subject.name;
      if (!acc[subject]) {
        acc[subject] = { count: 0, hours: 0 };
      }
      acc[subject].count += 1;
      acc[subject].hours += booking.duration / 60;
      return acc;
    }, {});

  const learningProgress = Object.entries(subjectProgress)
    .map(([subject, data]: [string, any]) => ({
      subject,
      lessons: data.count,
      progress: Math.min((data.count / 50) * 100, 100), // Assume 50 lessons = 100%
    }))
    .slice(0, 3);

  return (
    <DashboardLayout role="student" user={user}>
      <Title level={2}>{t('student.dashboardPage.welcomeBack')}, {user.name}! 👋</Title>
      <Text type="secondary">{t('student.dashboardPage.learningProgress')}</Text>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('student.dashboardPage.totalLessons')}
              value={stats.totalLessons}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('student.dashboardPage.hoursLearned')}
              value={stats.hoursLearned}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('student.dashboardPage.activeTutors')}
              value={stats.activeTutors}
              prefix={<StarFilled />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('student.dashboardPage.achievementPoints')}
              value={stats.totalLessons * 15}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        {/* Upcoming Lessons */}
        <Col xs={24} lg={12}>
          <Card
            title={<><CalendarOutlined /> {t('student.dashboardPage.upcomingLessons')}</>}
            extra={<Link href="/dashboard/student/lessons">{t('student.dashboardPage.viewAll')}</Link>}
          >
            {upcomingLessons.length === 0 ? (
              <Text type="secondary">{t('student.lessonsPage.failedToFetch')}</Text>
            ) : (
              <List
                dataSource={upcomingLessons}
                renderItem={(lesson) => {
                  const scheduledDate = new Date(lesson.scheduledAt);
                  const tutorName = `${lesson.tutor.firstName} ${lesson.tutor.lastName}`;
                  
                  return (
                    <List.Item
                      actions={[
                        <Button type="primary" size="small" key="join">{t('student.dashboardPage.join')}</Button>,
                        <Button size="small" key="reschedule">{t('student.dashboardPage.reschedule')}</Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={lesson.tutor.avatar || undefined} size={48}>{!lesson.tutor.avatar && tutorName.charAt(0)}</Avatar>}
                        title={tutorName}
                        description={
                          <Space direction="vertical" size={0}>
                            <Text type="secondary">{lesson.tutor.subject.name}</Text>
                            <Text strong>{scheduledDate.toLocaleDateString()} {t('student.dashboardPage.at')} {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                            <Tag color="blue">{lesson.duration} {t('student.dashboardPage.min')}</Tag>
                          </Space>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            )}
          </Card>
        </Col>

        {/* Learning Progress */}
        <Col xs={24} lg={12}>
          <Card title={t('student.dashboardPage.learningProgressTitle')}>
            {learningProgress.length === 0 ? (
              <Text type="secondary">No completed lessons yet</Text>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {learningProgress.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text strong>{item.subject}</Text>
                      <Text type="secondary">{item.lessons} {t('student.dashboardPage.lessons')}</Text>
                    </div>
                    <Progress percent={Math.round(item.progress)} status="active" />
                  </div>
                ))}
              </Space>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        {/* Recent Activity */}
        <Col xs={24} lg={12}>
          <Card title={t('student.dashboardPage.recentActivity')}>
            <Timeline
              items={bookings.slice(0, 5).map((booking) => {
                const tutorName = `${booking.tutor.firstName} ${booking.tutor.lastName}`;
                const timeAgo = Math.floor((Date.now() - new Date(booking.scheduledAt).getTime()) / (1000 * 60 * 60 * 24));
                
                return {
                  color: booking.status === 'completed' ? 'green' : booking.status === 'cancelled' ? 'red' : 'blue',
                  children: (
                    <>
                      <Text>{booking.status === 'completed' ? t('student.dashboardPage.completedLesson') : t('student.dashboardPage.bookedLesson')} {tutorName}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {timeAgo === 0 ? t('student.dashboardPage.hoursAgo') : `${timeAgo} ${timeAgo === 1 ? t('student.dashboardPage.dayAgo') : t('student.dashboardPage.daysAgo')}`}
                      </Text>
                    </>
                  ),
                };
              })}
            />
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={12}>
          <Card title={t('student.dashboardPage.quickActions')}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Link href="/dashboard/student/find-tutors" style={{ width: '100%' }}>
                <Button type="primary" block size="large">
                  {t('student.dashboardPage.findNewTutor')}
                </Button>
              </Link>
              <Link href="/dashboard/student/lessons" style={{ width: '100%' }}>
                <Button block size="large">
                  {t('student.dashboardPage.bookLesson')}
                </Button>
              </Link>
              <Link href="/dashboard/student/messages" style={{ width: '100%' }}>
                <Button block size="large">
                  {t('student.dashboardPage.messageTutors')}
                </Button>
              </Link>
            </Space>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
