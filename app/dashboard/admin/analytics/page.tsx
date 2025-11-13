'use client';

import { Card, Row, Col, Statistic, Typography, Spin } from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Line, Column, Pie } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function AdminAnalyticsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [bookingsData, setBookingsData] = useState<any[]>([]);
  const [userDistribution, setUserDistribution] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchAnalytics();
    }
  }, [status, session]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const [usersRes, tutorsRes, bookingsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/tutors'),
        fetch('/api/bookings'),
      ]);

      const users = await usersRes.json();
      const tutors = await tutorsRes.json();
      const bookings = await bookingsRes.json();

      // Calculate stats
      const completedBookings = bookings.filter((b: any) => b.status === 'completed');
      const totalRevenue = completedBookings.reduce((sum: number, b: any) => 
        sum + (parseFloat(b.price) * 0.15), 0
      );

      setStats({
        totalUsers: users.length,
        activeTutors: tutors.filter((t: any) => t.isActive).length,
        totalBookings: bookings.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
      });

      // Revenue by month (last 12 months)
      const monthlyRevenue: any = {};
      completedBookings.forEach((booking: any) => {
        const month = dayjs(booking.scheduledAt).format('MMM YYYY');
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
        .slice(-12);
      setRevenueData(revenueArray);

      // Bookings by month
      const monthlyBookings: any = {};
      bookings.forEach((booking: any) => {
        const month = dayjs(booking.scheduledAt).format('MMM YYYY');
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
        .slice(-12);
      setBookingsData(bookingsArray);

      // User role distribution
      const roleCounts = users.reduce((acc: any, user: any) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      const distributionArray = Object.entries(roleCounts).map(([role, count]) => ({
        type: role.charAt(0).toUpperCase() + role.slice(1),
        value: count as number,
      }));
      setUserDistribution(distributionArray);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
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

  const revenueConfig = {
    data: revenueData,
    xField: 'month',
    yField: 'revenue',
    smooth: true,
    color: '#1890ff',
    yAxis: {
      label: {
        formatter: (v: string) => `$${v}`,
      },
    },
  };

  const bookingsConfig = {
    data: bookingsData,
    xField: 'month',
    yField: 'bookings',
    color: '#52c41a',
  };

  const pieConfig = {
    data: userDistribution,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
  };

  return (
    <DashboardLayout role="admin" user={user}>
      <Title level={2}>{t('admin.analytics')}</Title>

      {/* Key Metrics */}
      {stats && (
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
                title="Active Tutors"
                value={stats.activeTutors}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Bookings"
                value={stats.totalBookings}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={stats.totalRevenue}
                prefix="$"
                suffix={<RiseOutlined style={{ color: '#3f8600', fontSize: 14 }} />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Charts */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Revenue Trend (Last 12 Months)">
            {revenueData.length > 0 ? (
              <Line {...revenueConfig} height={300} />
            ) : (
              <div style={{ textAlign: 'center', padding: '50px' }}>No data available</div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Bookings Trend (Last 12 Months)">
            {bookingsData.length > 0 ? (
              <Column {...bookingsConfig} height={300} />
            ) : (
              <div style={{ textAlign: 'center', padding: '50px' }}>No data available</div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="User Role Distribution">
            {userDistribution.length > 0 ? (
              <Pie {...pieConfig} height={300} />
            ) : (
              <div style={{ textAlign: 'center', padding: '50px' }}>No data available</div>
            )}
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
