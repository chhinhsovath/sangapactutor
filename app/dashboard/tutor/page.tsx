'use client';

import { Card, Row, Col, Statistic, Typography, List, Avatar, Tag, Button, Space, Spin } from 'antd';
import { DollarOutlined, ClockCircleOutlined, StarFilled, TeamOutlined, RiseOutlined, CalendarOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function TutorDashboard() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    monthEarnings: 0,
    totalStudents: 0,
    monthLessons: 0,
    totalHours: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [todayBookings, setTodayBookings] = useState<any[]>([]);
  const [recentStudents, setRecentStudents] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id && session?.user?.tutorId) {
      fetchDashboardData();
    }
  }, [status, session]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tutor's bookings
      const bookingsRes = await fetch(`/api/bookings?tutorId=${session?.user?.tutorId}`);
      const bookings = await bookingsRes.json();

      // Today's bookings
      const today = dayjs().format('YYYY-MM-DD');
      const todaysBookings = bookings.filter((b: any) => 
        dayjs(b.scheduledAt).format('YYYY-MM-DD') === today && 
        (b.status === 'confirmed' || b.status === 'pending')
      );
      setTodayBookings(todaysBookings);

      // Calculate stats
      const completed = bookings.filter((b: any) => b.status === 'completed');
      const thisMonth = completed.filter((b: any) => 
        dayjs(b.scheduledAt).isSame(dayjs(), 'month')
      );
      
      const monthEarnings = thisMonth.reduce((sum: number, b: any) => sum + parseFloat(b.price), 0);
      const monthLessons = thisMonth.length;
      const totalHours = thisMonth.reduce((sum: number, b: any) => sum + (b.duration / 60), 0);

      // Get unique students
      const uniqueStudentIds = new Set(bookings.map((b: any) => b.studentId));

      // Get tutor details for rating
      const tutorRes = await fetch(`/api/tutors/${session?.user?.tutorId}`);
      const tutorData = await tutorRes.json();

      setStats({
        monthEarnings: Math.round(monthEarnings * 100) / 100,
        totalStudents: uniqueStudentIds.size,
        monthLessons,
        totalHours: Math.round(totalHours * 10) / 10,
        averageRating: parseFloat(tutorData.rating || 0),
        totalReviews: tutorData.totalReviews || 0,
      });

      // Get recent students with their booking counts
      const studentBookingCounts = completed.reduce((acc: any, booking: any) => {
        const studentId = booking.student.id;
        if (!acc[studentId]) {
          acc[studentId] = {
            student: booking.student,
            count: 0,
            lastLesson: booking.scheduledAt,
          };
        }
        acc[studentId].count += 1;
        if (dayjs(booking.scheduledAt).isAfter(dayjs(acc[studentId].lastLesson))) {
          acc[studentId].lastLesson = booking.scheduledAt;
        }
        return acc;
      }, {});

      const recentStudentsData = Object.values(studentBookingCounts)
        .sort((a: any, b: any) => dayjs(b.lastLesson).diff(dayjs(a.lastLesson)))
        .slice(0, 5);
      
      setRecentStudents(recentStudentsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
    return (
      <DashboardLayout role="tutor" user={{ name: session?.user?.name || '', email: session?.user?.email || '', avatar: '' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>{t('errors.fetchFailed')}</Text>
        </div>
      </DashboardLayout>
    );
  }

  const user = {
    name: session.user.name || '',
    email: session.user.email || '',
    avatar: session.user.image || '',
  };

  return (
    <DashboardLayout role="tutor" user={user}>
      <Title level={2}>{t('student.dashboardPage.welcomeBack')}, {user.name}! 👨‍🏫</Title>
      <Text type="secondary">{todayBookings.length > 0 ? `${t('common.welcome')} - ${todayBookings.length} lessons today` : `${t('common.welcome')}`}</Text>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('tutor.earningsPage.totalEarnings')}
              value={stats.monthEarnings}
              prefix="$"
              suffix={<RiseOutlined style={{ color: '#3f8600', fontSize: 14 }} />}
              valueStyle={{ color: '#3f8600' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>{t('tutor.earningsPage.fromLessons')}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('tutor.students')}
              value={stats.totalStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Total students</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('student.dashboardPage.totalLessons')}
              value={stats.monthLessons}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>{stats.totalHours} hours total</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('tutor.reviewsPage.averageRating')}
              value={stats.averageRating}
              prefix={<StarFilled />}
              valueStyle={{ color: '#cf1322' }}
              precision={2}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>{stats.totalReviews} reviews</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        {/* Today's Schedule */}
        <Col xs={24} lg={12}>
          <Card
            title={<><CalendarOutlined /> Today's Schedule</>}
            extra={<Link href="/dashboard/tutor/schedule">View Calendar</Link>}
          >
            {todayBookings.length === 0 ? (
              <Text type="secondary">No lessons scheduled today</Text>
            ) : (
              <List
                dataSource={todayBookings}
                renderItem={(lesson: any) => {
                  const scheduledTime = dayjs(lesson.scheduledAt);
                  const studentName = `${lesson.student.firstName} ${lesson.student.lastName}`;
                  
                  return (
                    <List.Item
                      actions={[
                        <Button type="primary" size="small" key="start">Start</Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={lesson.student.avatar || undefined} size={48}>{!lesson.student.avatar && studentName.charAt(0)}</Avatar>}
                        title={studentName}
                        description={
                          <Space>
                            <Text strong>{scheduledTime.format('HH:mm')}</Text>
                            <Tag color="blue">{lesson.duration} min</Tag>
                            <Tag color={lesson.status === 'confirmed' ? 'green' : 'orange'}>{lesson.status}</Tag>
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

        {/* Recent Students */}
        <Col xs={24} lg={12}>
          <Card
            title={t('tutor.students')}
            extra={<Link href="/dashboard/tutor/students">View All</Link>}
          >
            {recentStudents.length === 0 ? (
              <Text type="secondary">No students yet</Text>
            ) : (
              <List
                dataSource={recentStudents}
                renderItem={(item: any) => {
                  const student = item.student;
                  const studentName = `${student.firstName} ${student.lastName}`;
                  const daysSince = dayjs().diff(dayjs(item.lastLesson), 'day');
                  
                  return (
                    <List.Item>
                      <List.Item.Meta
                        title={studentName}
                        description={
                          <Space direction="vertical" size={0}>
                            <Text type="secondary">{item.count} lessons completed</Text>
                            <Text type="secondary">Last: {daysSince === 0 ? 'today' : `${daysSince} days ago`}</Text>
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
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        {/* Quick Actions */}
        <Col xs={24}>
          <Card title={t('student.dashboardPage.quickActions')}>
            <Space direction="horizontal" style={{ width: '100%' }} size="middle" wrap>
              <Link href="/dashboard/tutor/schedule">
                <Button type="primary" size="large">
                  {t('tutor.schedule')}
                </Button>
              </Link>
              <Link href="/dashboard/tutor/students">
                <Button size="large">
                  {t('tutor.students')}
                </Button>
              </Link>
              <Link href="/dashboard/tutor/earnings">
                <Button size="large">
                  {t('tutor.earnings')}
                </Button>
              </Link>
              <Link href="/dashboard/tutor/reviews">
                <Button size="large">
                  {t('tutor.reviews')}
                </Button>
              </Link>
            </Space>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
