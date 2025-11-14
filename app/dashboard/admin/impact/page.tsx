'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, App } from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined, ClockCircleOutlined, RiseOutlined, SmileOutlined, StarOutlined, TrophyOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminImpactPage() {
  const { t } = useLanguage();
  const { message } = App.useApp();
  const [stats, setStats] = useState<any>({
    totalStudents: 0,
    totalTutors: 0,
    totalSessions: 0,
    totalHours: 0,
    activeUsers: 0,
    averageRating: 0,
    satisfactionRate: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  const user = {
    name: 'Admin User',
    email: 'admin@tutorhub.com',
    avatar: 'https://i.pravatar.cc/150?img=0',
  };

  useEffect(() => {
    fetchImpactStats();
  }, []);

  const fetchImpactStats = async () => {
    setLoading(true);
    try {
      // Fetch from multiple endpoints
      const [usersRes, bookingsRes, reviewsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/bookings'),
        fetch('/api/reviews'),
      ]);

      const users = await usersRes.json();
      const bookings = await bookingsRes.json();
      const reviews = await reviewsRes.json();

      const students = users.filter((u: any) => u.role === 'student').length;
      const tutors = users.filter((u: any) => u.role === 'tutor' || u.role === 'verified_tutor').length;
      const completed = bookings.filter((b: any) => b.status === 'completed');
      const totalHours = completed.reduce((sum: number, b: any) => sum + (b.duration || 0), 0) / 60;
      
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + parseFloat(r.rating || 0), 0) / reviews.length
        : 0;

      setStats({
        totalStudents: students,
        totalTutors: tutors,
        totalSessions: completed.length,
        totalHours: totalHours.toFixed(0),
        activeUsers: users.filter((u: any) => u.isActive).length,
        averageRating: avgRating.toFixed(1),
        satisfactionRate: reviews.length > 0 ? ((reviews.filter((r: any) => parseFloat(r.rating) >= 4).length / reviews.length) * 100).toFixed(0) : 0,
        completionRate: bookings.length > 0 ? ((completed.length / bookings.length) * 100).toFixed(0) : 0,
      });
    } catch (error) {
      message.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <App>
      <DashboardLayout role="admin" user={user}>
        <Card
          title={
            <div>
              <TrophyOutlined style={{ fontSize: 20, marginRight: 8 }} />
              <span>{t('admin.impactPage.title')}</span>
            </div>
          }
          loading={loading}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={`${t('admin.impactPage.totalStudents')} / Total Students`}
                  value={stats.totalStudents}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={`${t('admin.impactPage.totalTutors')} / Total Tutors`}
                  value={stats.totalTutors}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={`${t('admin.impactPage.totalSessions')} / Total Sessions`}
                  value={stats.totalSessions}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={`${t('admin.impactPage.totalHours')} / Total Hours`}
                  value={stats.totalHours}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={`${t('admin.impactPage.activeUsers')} / Active Users`}
                  value={stats.activeUsers}
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={`${t('admin.impactPage.averageRating')} / Avg Rating`}
                  value={stats.averageRating}
                  prefix={<StarOutlined />}
                  suffix="/ 5"
                  valueStyle={{ color: '#eb2f96' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={`${t('admin.impactPage.satisfactionRate')} / Satisfaction`}
                  value={stats.satisfactionRate}
                  prefix={<SmileOutlined />}
                  suffix="%"
                  valueStyle={{ color: '#13c2c2' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={`${t('admin.impactPage.completionRate')} / Completion`}
                  value={stats.completionRate}
                  prefix={<TrophyOutlined />}
                  suffix="%"
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      </DashboardLayout>
    </App>
  );
}
