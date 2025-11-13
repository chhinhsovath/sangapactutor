'use client';
'use client';

import { Layout, Menu, Avatar, Dropdown, Typography, Space, App } from 'antd';
import {
  DashboardOutlined,
  CalendarOutlined,
  MessageOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BookOutlined,
  StarOutlined,
  TeamOutlined,
  LineChartOutlined,
  DollarOutlined,
  GlobalOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'student' | 'tutor' | 'admin';
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

function DashboardContent({ children, role, user }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { message } = App.useApp();

  const handleMenuClick = (e: any) => {
    if (e.key === 'logout') {
      message.success(t('navigation.logoutSuccess') || 'Logged out successfully');
      router.push('/login');
    } else if (e.key === 'profile') {
      router.push(`/dashboard/${role}/profile`);
    } else if (e.key === 'settings') {
      router.push(`/dashboard/${role}/settings`);
    }
  };

  const getMenuItems = () => {
    const basePrefix = `/dashboard/${role}`;

    if (role === 'student') {
      return [
        {
          key: `${basePrefix}`,
          icon: <DashboardOutlined />,
          label: <Link href={basePrefix}>{t('student.dashboard')}</Link>,
        },
        {
          key: `${basePrefix}/find-tutors`,
          icon: <TeamOutlined />,
          label: <Link href={`${basePrefix}/find-tutors`}>{t('student.findTutors')}</Link>,
        },
        {
          key: `${basePrefix}/lessons`,
          icon: <BookOutlined />,
          label: <Link href={`${basePrefix}/lessons`}>{t('student.myLessons')}</Link>,
        },
        {
          key: `${basePrefix}/messages`,
          icon: <MessageOutlined />,
          label: <Link href={`${basePrefix}/messages`}>{t('student.messages')}</Link>,
        },
        {
          key: `${basePrefix}/profile`,
          icon: <UserOutlined />,
          label: <Link href={`${basePrefix}/profile`}>{t('student.profile')}</Link>,
        },
      ];
    }

    if (role === 'tutor') {
      return [
        {
          key: `${basePrefix}`,
          icon: <DashboardOutlined />,
          label: <Link href={basePrefix}>{t('tutor.dashboard')}</Link>,
        },
        {
          key: `${basePrefix}/schedule`,
          icon: <CalendarOutlined />,
          label: <Link href={`${basePrefix}/schedule`}>{t('tutor.schedule')}</Link>,
        },
        {
          key: `${basePrefix}/students`,
          icon: <TeamOutlined />,
          label: <Link href={`${basePrefix}/students`}>{t('tutor.students')}</Link>,
        },
        {
          key: `${basePrefix}/earnings`,
          icon: <DollarOutlined />,
          label: <Link href={`${basePrefix}/earnings`}>{t('tutor.earnings')}</Link>,
        },
        {
          key: `${basePrefix}/reviews`,
          icon: <StarOutlined />,
          label: <Link href={`${basePrefix}/reviews`}>{t('tutor.reviews')}</Link>,
        },
        {
          key: `${basePrefix}/messages`,
          icon: <MessageOutlined />,
          label: <Link href={`${basePrefix}/messages`}>{t('tutor.messages')}</Link>,
        },
        {
          key: `${basePrefix}/profile`,
          icon: <UserOutlined />,
          label: <Link href={`${basePrefix}/profile`}>{t('tutor.profile')}</Link>,
        },
      ];
    }

    // Admin
    return [
      {
        key: `${basePrefix}`,
        icon: <DashboardOutlined />,
        label: <Link href={basePrefix}>{t('admin.dashboard')}</Link>,
      },
      {
        key: `${basePrefix}/users`,
        icon: <TeamOutlined />,
        label: <Link href={`${basePrefix}/users`}>{t('admin.users')}</Link>,
      },
      {
        key: `${basePrefix}/tutors`,
        icon: <UserOutlined />,
        label: <Link href={`${basePrefix}/tutors`}>{t('admin.tutors')}</Link>,
      },
      {
        key: `${basePrefix}/subjects`,
        icon: <TagsOutlined />,
        label: <Link href={`${basePrefix}/subjects`}>{t('admin.subjects')}</Link>,
      },
      {
        key: `${basePrefix}/countries`,
        icon: <GlobalOutlined />,
        label: <Link href={`${basePrefix}/countries`}>{t('admin.countries')}</Link>,
      },
      {
        key: `${basePrefix}/bookings`,
        icon: <BookOutlined />,
        label: <Link href={`${basePrefix}/bookings`}>{t('admin.bookings')}</Link>,
      },
      {
        key: `${basePrefix}/reviews`,
        icon: <StarOutlined />,
        label: <Link href={`${basePrefix}/reviews`}>{t('admin.reviews')}</Link>,
      },
      {
        key: `${basePrefix}/analytics`,
        icon: <LineChartOutlined />,
        label: <Link href={`${basePrefix}/analytics`}>{t('admin.analytics')}</Link>,
      },
      {
        key: `${basePrefix}/settings`,
        icon: <SettingOutlined />,
        label: <Link href={`${basePrefix}/settings`}>{t('admin.settings')}</Link>,
      },
    ];
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('navigation.profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('navigation.settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('navigation.logout'),
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={250}
        style={{
          background: '#001529',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
        }}
      >
      <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Text strong style={{ color: 'white', fontSize: 20 }}>
          {t(`${role}.portal`)}
        </Text>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        items={getMenuItems()}
        style={{ marginTop: 16 }}
      />
    </Sider>

    <Layout style={{ marginLeft: 250 }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #f0f0f0',
        height: 64
      }}>
        <div style={{ flex: 1 }} />
        <Space size={24} align="center">
          <LanguageSwitcher />
          <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }} size={12}>
              <Avatar src={user.avatar} icon={<UserOutlined />} size={40} />
              <div style={{ lineHeight: '1.2' }}>
                <div>
                  <Text strong style={{ fontSize: 14 }}>{user.name}</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{user.email}</Text>
                </div>
              </div>
            </Space>
          </Dropdown>
        </Space>
      </Header>

      <Content style={{ margin: '24px', minHeight: 'calc(100vh - 88px)' }}>
        {children}
      </Content>
    </Layout>
  </Layout>
  );
}

export default function DashboardLayout({ children, role, user }: DashboardLayoutProps) {
  return (
    <App>
      <DashboardContent role={role} user={user}>
        {children}
      </DashboardContent>
    </App>
  );
}
