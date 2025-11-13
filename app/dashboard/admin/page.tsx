'use client';

import { Card, Row, Col, Statistic, Typography, Table, Tag, Button, Space, Progress, Spin } from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined, DollarOutlined, RiseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Line, Column } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTutors: 0,
    totalBookings: 0,
    platformRevenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [pendingTutors, setPendingTutors] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [bookingsData, setBookingsData] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchDashboardData();
    } else if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, session]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersRes, tutorsRes, bookingsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/tutors'),
        fetch('/api/bookings'),
      ]);

      const users = await usersRes.json();
      const tutors = await tutorsRes.json();
      const bookings = await bookingsRes.json();

      // Calculate stats
      const activeTutors = tutors.filter((t: any) => t.isActive && t.isVerified).length;
      const completedBookings = bookings.filter((b: any) => b.status === 'completed');
      const platformRevenue = completedBookings.reduce((sum: number, b: any) => 
        sum + (parseFloat(b.price) * 0.15), 0  // 15% commission
      );

      setStats({
        totalUsers: users.length,
        activeTutors,
        totalBookings: bookings.length,
        platformRevenue: Math.round(platformRevenue * 100) / 100,
      });

      // Recent users (last 10)
      const sortedUsers = users
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
        .map((user: any) => ({
          key: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          status: user.isActive ? 'active' : 'inactive',
          joinDate: dayjs(user.createdAt).format('MMM DD, YYYY'),
        }));
      setRecentUsers(sortedUsers);

      // Pending tutor approvals
      const pending = tutors
        .filter((t: any) => !t.isVerified)
        .slice(0, 5)
        .map((tutor: any) => ({
          key: tutor.id,
          tutor: `${tutor.firstName} ${tutor.lastName}`,
          subject: tutor.subject?.name || 'N/A',
          experience: `${tutor.yearsExperience || 0} years`,
          status: 'pending',
        }));
      setPendingTutors(pending);

      // Revenue trend (last 6 months)
      const monthlyRevenue: any = {};
      completedBookings.forEach((booking: any) => {
        const month = dayjs(booking.scheduledAt).format('MMM');
        if (!monthlyRevenue[month]) {
          monthlyRevenue[month] = 0;
        }
        monthlyRevenue[month] += parseFloat(booking.price) * 0.15;
      });

      const revenueArray = Object.entries(monthlyRevenue)
        .map(([month, revenue]) => ({
          month,
          revenue: Math.round(revenue as number * 100) / 100,
        }))
        .slice(-6);
      setRevenueData(revenueArray);

      // Bookings trend (last 6 months)
      const monthlyBookings: any = {};
      bookings.forEach((booking: any) => {
        const month = dayjs(booking.scheduledAt).format('MMM');
        if (!monthlyBookings[month]) {
          monthlyBookings[month] = 0;
        }
        monthlyBookings[month] += 1;
      });

      const bookingsArray = Object.entries(monthlyBookings)
        .map(([month, count]) => ({
          month,
          bookings: count,
        }))
        .slice(-6);
      setBookingsData(bookingsArray);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTutor = async (tutorId: number) => {
    try {
      const response = await fetch(`/api/tutors/${tutorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: true }),
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error verifying tutor:', error);
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

  const userColumns = [
    { title: t('admin.usersPage.name'), dataIndex: 'name', key: 'name' },
    { title: t('admin.usersPage.email'), dataIndex: 'email', key: 'email' },
    {
      title: t('admin.usersPage.role'),
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'tutor' ? 'blue' : role === 'admin' ? 'red' : 'green'}>
          {t(`admin.usersPage.${role}`)}
        </Tag>
      ),
    },
    {
      title: t('admin.usersPage.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'warning'}>
          {t(`admin.usersPage.${status}`)}
        </Tag>
      ),
    },
    { title: t('admin.usersPage.createdAt'), dataIndex: 'joinDate', key: 'joinDate' },
    {
      title: t('common.actions'),
      key: 'action',
      render: (_: any, record: any) => (
        <Link href={`/dashboard/admin/users`}>{t('common.edit')}</Link>
      ),
    },
  ];

  const approvalColumns = [
    { title: t('admin.tutorsPage.name'), dataIndex: 'tutor', key: 'tutor' },
    { title: t('admin.tutorsPage.subject'), dataIndex: 'subject', key: 'subject' },
    { title: t('admin.tutorsPage.yearsExperience'), dataIndex: 'experience', key: 'experience' },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: () => <Tag color="warning">{t('admin.tutorsPage.pending')}</Tag>,
    },
    {
      title: t('common.actions'),
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleVerifyTutor(record.key)}
          >
            {t('admin.tutorsPage.verify')}
          </Button>
          <Link href={`/dashboard/admin/tutors`}>
            <Button size="small">{t('common.edit')}</Button>
          </Link>
        </Space>
      ),
    },
  ];

  const revenueConfig = {
    data: revenueData,
    xField: 'month',
    yField: 'revenue',
    smooth: true,
    color: '#1890ff',
  };

  const bookingsConfig = {
    data: bookingsData,
    xField: 'month',
    yField: 'bookings',
    color: '#52c41a',
  };

  return (
    <DashboardLayout role="admin" user={user}>
      <Title level={2}>{t('admin.portal')} 📊</Title>
      <Text type="secondary">Monitor and manage your tutoring platform</Text>

      {/* Key Metrics */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('admin.tutors')}
              value={stats.activeTutors}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>{pendingTutors.length} pending</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('admin.bookings')}
              value={stats.totalBookings}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Platform Revenue"
              value={stats.platformRevenue}
              prefix="$"
              valueStyle={{ color: '#3f8600' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>15% commission</Text>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Revenue Trend (6 months)">
            {revenueData.length > 0 ? (
              <Line {...revenueConfig} height={250} />
            ) : (
              <Text type="secondary">No data available</Text>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Bookings Trend (6 months)">
            {bookingsData.length > 0 ? (
              <Column {...bookingsConfig} height={250} />
            ) : (
              <Text type="secondary">No data available</Text>
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Users */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card 
            title={`${t('admin.users')} (Recent)`}
            extra={<Link href="/dashboard/admin/users">View All</Link>}
          >
            <Table
              columns={userColumns}
              dataSource={recentUsers}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Pending Approvals */}
      {pendingTutors.length > 0 && (
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col xs={24}>
            <Card 
              title="Pending Tutor Approvals"
              extra={<Link href="/dashboard/admin/tutors">View All</Link>}
            >
              <Table
                columns={approvalColumns}
                dataSource={pendingTutors}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>
      )}
    </DashboardLayout>
  );
}
