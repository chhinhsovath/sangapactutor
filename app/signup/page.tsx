'use client';

import { useState } from 'react';
import { Layout, Card, Form, Input, Button, Typography, Space, Divider, Select, Radio, App } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSignup = async (values: any) => {
    setLoading(true);
    try {
      // TODO: Implement actual user registration
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          role: values.role,
        }),
      });

      if (response.ok) {
        message.success(t('auth.accountCreated'));
        
        // Redirect based on role
        setTimeout(() => {
          if (values.role === 'admin') {
            router.push('/dashboard/admin');
          } else if (values.role === 'tutor') {
            router.push('/dashboard/tutor');
          } else {
            router.push('/dashboard/student');
          }
        }, 1500);
      } else {
        const error = await response.json();
        message.error(error.error || t('auth.registrationFailed'));
      }
    } catch (error) {
      message.error(t('auth.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'TutorHub';

  return (
    <App>
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
          <Card style={{ width: '100%', maxWidth: 500 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Title level={2} style={{ marginBottom: 8 }}>
                {t('auth.createAccount')}
              </Title>
              <Text type="secondary">
                {t('auth.signupSubtitle')}
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSignup}
              autoComplete="off"
              initialValues={{ role: 'student' }}
            >
              <Form.Item
                name="role"
                label={t('auth.iWantTo')}
                rules={[{ required: true }]}
              >
                <Radio.Group size="large">
                  <Radio.Button value="student">{t('auth.learn')}</Radio.Button>
                  <Radio.Button value="tutor">{t('auth.teach')}</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Space.Compact style={{ width: '100%' }}>
                <Form.Item
                  name="firstName"
                  label={t('auth.firstName')}
                  rules={[{ required: true, message: t('auth.required') }]}
                  style={{ width: '50%', marginBottom: 0 }}
                >
                  <Input
                    placeholder={t('auth.firstName')}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  label={t('auth.lastName')}
                  rules={[{ required: true, message: t('auth.required') }]}
                  style={{ width: '50%', marginBottom: 0 }}
                >
                  <Input
                    placeholder={t('auth.lastName')}
                    size="large"
                  />
                </Form.Item>
              </Space.Compact>

              <Form.Item
                name="email"
                label={t('auth.email')}
                rules={[
                  { required: true, message: t('auth.enterEmail') },
                  { type: 'email', message: t('auth.validEmail') },
                ]}
                style={{ marginTop: 24 }}
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
                rules={[
                  { required: true, message: t('auth.enterPassword') },
                  { min: 6, message: t('auth.passwordMin6') },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder={t('auth.createPasswordPlaceholder')}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={t('auth.confirmPassword')}
                dependencies={['password']}
                rules={[
                  { required: true, message: t('auth.confirmPasswordMsg') },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t('auth.passwordsNotMatch')));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                >
                  {t('auth.createAccount')}
                </Button>
              </Form.Item>

              <Form.Item>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t('auth.bySigningUp')}{' '}
                  <Link href="/terms">{t('auth.termsOfService')}</Link> {t('auth.and')}{' '}
                  <Link href="/privacy">{t('auth.privacyPolicy')}</Link>
                </Text>
              </Form.Item>
            </Form>

            <Divider>OR</Divider>

            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">{t('auth.alreadyHaveAccount')} </Text>
              <Link href="/login">
                <Text strong style={{ color: '#1890ff' }}>{t('auth.login')}</Text>
              </Link>
            </div>
          </Card>
        </Content>
      </Layout>
    </App>
  );
}
