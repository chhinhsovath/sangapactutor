'use client';

import { Card, Form, Input, Button, Switch, InputNumber, App, Typography, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { Title, Paragraph } = Typography;

export default function AdminSettingsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  if (status === 'loading') {
    return (
      <DashboardLayout role="admin" user={{ name: '', email: '', avatar: '' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (!session?.user) {
    return null;
  }

  const user = {
    name: session.user.name || '',
    email: session.user.email || '',
    avatar: session.user.image || '',
  };

  const handleSaveGeneral = async (values: any) => {
    setLoading(true);
    try {
      // In a real app, save to database or config
      message.success('General settings saved successfully');
    } catch (error) {
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePayment = async (values: any) => {
    setLoading(true);
    try {
      message.success('Payment settings saved successfully');
    } catch (error) {
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async (values: any) => {
    setLoading(true);
    try {
      message.success('Notification settings saved successfully');
    } catch (error) {
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin" user={user}>
      <Title level={2}>{t('admin.settings')}</Title>

      {/* General Settings */}
      <Card title="General Settings" style={{ marginTop: 24 }}>
        <Form
          layout="vertical"
          onFinish={handleSaveGeneral}
          initialValues={{
            siteName: 'TutorHub',
            siteDescription: 'Connect with expert tutors worldwide',
            maintenanceMode: false,
            allowRegistration: true,
          }}
        >
          <Form.Item
            label="Site Name"
            name="siteName"
            rules={[{ required: true, message: 'Please enter site name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Site Description"
            name="siteDescription"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Maintenance Mode"
            name="maintenanceMode"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Allow New Registrations"
            name="allowRegistration"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
              Save General Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Payment Settings */}
      <Card title="Payment Settings" style={{ marginTop: 24 }}>
        <Form
          layout="vertical"
          onFinish={handleSavePayment}
          initialValues={{
            commissionRate: 15,
            minBookingAmount: 10,
            currency: 'USD',
          }}
        >
          <Form.Item
            label="Platform Commission Rate (%)"
            name="commissionRate"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Minimum Booking Amount ($)"
            name="minBookingAmount"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Currency"
            name="currency"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
              Save Payment Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Notification Settings */}
      <Card title="Notification Settings" style={{ marginTop: 24 }}>
        <Form
          layout="vertical"
          onFinish={handleSaveNotifications}
          initialValues={{
            emailNotifications: true,
            bookingNotifications: true,
            reviewNotifications: true,
            messageNotifications: true,
          }}
        >
          <Form.Item
            label="Email Notifications"
            name="emailNotifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Booking Notifications"
            name="bookingNotifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Review Notifications"
            name="reviewNotifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Message Notifications"
            name="messageNotifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
              Save Notification Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </DashboardLayout>
  );
}
