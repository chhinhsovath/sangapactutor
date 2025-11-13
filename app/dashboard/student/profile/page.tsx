'use client';

import { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, App, Card, Avatar, Typography, Spin } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function StudentProfilePage() {
  const { t } = useLanguage();
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchUserProfile();
    }
  }, [status, session]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setUser(data);
      form.setFieldsValue({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        avatar: data.avatar,
      });
    } catch (error) {
      message.error(t('student.profilePage.failedToFetch'));
    }
  };

  const handleProfileUpdate = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(t('student.profilePage.profileUpdated'));
        fetchUserProfile();
        // Update session
        await update();
      } else {
        message.error(t('student.profilePage.failedToUpdate'));
      }
    } catch (error) {
      message.error(t('student.profilePage.failedToUpdate'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error(t('student.profilePage.passwordsNotMatch'));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: values.newPassword }),
      });

      if (response.ok) {
        message.success(t('student.profilePage.passwordChanged'));
        passwordForm.resetFields();
      } else {
        message.error(t('student.profilePage.failedToChange'));
      }
    } catch (error) {
      message.error(t('student.profilePage.failedToChange'));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (info: any) => {
    if (info.file.status === 'done') {
      const avatarUrl = `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&size=200`;
      form.setFieldsValue({ avatar: avatarUrl });
      message.success(t('student.profilePage.avatarUploaded'));
    } else if (info.file.status === 'error') {
      message.error(t('student.profilePage.avatarUploadFailed'));
    }
  };

  if (status === 'loading' || !user) {
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

  const userInfo = {
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    email: user.email || '',
    avatar: user.avatar || '',
  };

  return (
    <DashboardLayout role="student" user={userInfo}>
      <div style={{ maxWidth: '800px' }}>
        <Title level={2}>{t('student.profilePage.title')}</Title>

        {/* Profile Information */}
        <Card title={t('student.profilePage.information')} style={{ marginTop: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={user?.avatar}
            />
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleProfileUpdate}
          >
            <Form.Item
              name="firstName"
              label={t('student.profilePage.firstName')}
              rules={[{ required: true, message: t('student.profilePage.enterFirstName') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label={t('student.profilePage.lastName')}
              rules={[{ required: true, message: t('student.profilePage.enterLastName') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label={t('student.profilePage.email')}
              rules={[
                { required: true, message: t('student.profilePage.enterEmail') },
                { type: 'email', message: t('student.profilePage.enterValidEmail') },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="avatar" label={t('student.profilePage.avatarUrl')}>
              <Input placeholder={t('student.profilePage.avatarUrlPlaceholder')} />
            </Form.Item>

            <Form.Item>
              <Upload
                name="avatar"
                showUploadList={false}
                onChange={handleAvatarUpload}
                customRequest={({ onSuccess }: any) => {
                  setTimeout(() => {
                    onSuccess('ok');
                  }, 0);
                }}
              >
                <Button icon={<UploadOutlined />}>{t('student.profilePage.uploadAvatar')}</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {t('student.profilePage.updateProfile')}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Change Password */}
        <Card title={t('student.profilePage.changePassword')} style={{ marginTop: '24px' }}>
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordChange}
          >
            <Form.Item
              name="currentPassword"
              label={t('student.profilePage.currentPassword')}
              rules={[{ required: true, message: t('student.profilePage.enterCurrentPassword') }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label={t('student.profilePage.newPassword')}
              rules={[
                { required: true, message: t('student.profilePage.enterNewPassword') },
                { min: 6, message: t('student.profilePage.passwordMinLength') },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={t('student.profilePage.confirmPassword')}
              rules={[
                { required: true, message: t('student.profilePage.confirmNewPassword') },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {t('student.profilePage.changePassword')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
