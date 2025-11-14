'use client';

import { useState } from 'react';
import { Layout, Card, Form, Input, Button, Typography, Space, Divider, App } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function LoginForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        message.error(result.error || t('auth.loginFailed'));
        return;
      }

      if (result?.ok) {
        // Fetch user data from session to determine role
        const response = await fetch('/api/auth/session');
        const session = await response.json();

        if (session?.user) {
          const roleName = session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1);
          message.success(`${t('common.welcome')} ${roleName}!`);

          // Redirect based on role
          const roleMap: Record<string, string> = {
            'admin': '/dashboard/admin',
            'tutor': '/dashboard/tutor',
            'verified_tutor': '/dashboard/tutor',
            'student': '/dashboard/student',
            'mentee': '/dashboard/student',
            'faculty_coordinator': '/dashboard/institution',
            'institution_admin': '/dashboard/institution',
            'student_coordinator': '/dashboard/student_coordinator',
          };

          const redirectUrl = roleMap[session.user.role] || '/dashboard/student';
          router.push(redirectUrl);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard/student' });
    } catch (error) {
      console.error('Google sign-in error:', error);
      message.error(t('auth.loginFailed'));
    }
  };

  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'TutorHub';

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Header style={{ background: 'transparent', borderBottom: 'none', padding: '0 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Title level={3} style={{ margin: 0, color: 'white' }}>
              {companyName}
            </Title>
          </Link>
          <LanguageSwitcher />
        </div>
      </Header>

      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <Card style={{ width: '100%', maxWidth: 450 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              {t('auth.welcomeBack')}
            </Title>
            <Text type="secondary">
              {t('auth.loginSubtitle')}
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label={t('auth.email')}
              rules={[
                { required: true, message: t('auth.enterEmail') },
                { type: 'email', message: t('auth.validEmail') },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="your@email.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={t('auth.password')}
              rules={[{ required: true, message: t('auth.enterPassword') }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/forgot-password" style={{ fontSize: 14 }}>
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                {t('auth.login')}
              </Button>
            </Form.Item>
          </Form>

          <Divider>{t('common.or') || 'OR'}</Divider>

          <Button
            size="large"
            block
            icon={<GoogleOutlined />}
            onClick={handleGoogleSignIn}
            style={{
              backgroundColor: '#fff',
              borderColor: '#d9d9d9',
              color: '#000',
              marginBottom: 24,
            }}
          >
            {t('auth.continueWithGoogle') || 'Continue with Google'}
          </Button>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">{t('auth.dontHaveAccount')} </Text>
            <Link href="/signup">
              <Text strong style={{ color: '#1890ff' }}>{t('auth.signUp')}</Text>
            </Link>
          </div>

          <Divider />

          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="small">
              <Text type="secondary" style={{ fontSize: 12 }}>{t('auth.demoAccounts')}</Text>
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, marginTop: 8 }}>Institution Accounts</Text>
              <Text style={{ fontSize: 11 }}>Faculty Coordinator: sovan.kim@rupp.edu.kh / demo123</Text>
              <Text style={{ fontSize: 11 }}>Tutor (RUPP): sokha.chan@rupp.edu.kh / demo123</Text>
              <Text style={{ fontSize: 11 }}>Mentee (Rural): sophea.prak@kcu.edu.kh / demo123</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 600 }}>Original Accounts</Text>
              <Text style={{ fontSize: 11 }}>Admin: admin@tutorhub.com / admin123</Text>
              <Text style={{ fontSize: 11 }}>Tutor: sarah@example.com / tutor123</Text>
              <Text style={{ fontSize: 11 }}>Student: john@example.com / student123</Text>
            </Space>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}

export default function LoginPage() {
  return (
    <App>
      <LoginForm />
    </App>
  );
}
