'use client';

import { useState, useEffect } from 'react';
import { Card, Form, Input, InputNumber, Select, Button, message as antdMessage, Switch, Space, Typography, App, Spin, Row, Col } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface InstitutionSettings {
  id: number;
  name: string;
  nameKh?: string;
  nameEn?: string;
  type: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  country?: string;
  creditRequirementMin: number;
  creditRequirementMax: number;
  creditValuePerSession: string;
  allowCrossInstitution: boolean;
  description?: string;
}

export default function InstitutionSettingsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [institution, setInstitution] = useState<InstitutionSettings | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.institutionId) {
      fetchInstitution();
    }
  }, [status, session]);

  const fetchInstitution = async () => {
    if (!session?.user?.institutionId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/institutions/${session.user.institutionId}`);
      const data = await response.json();
      setInstitution(data);
      form.setFieldsValue({
        name: data.name,
        nameKh: data.nameKh,
        nameEn: data.nameEn,
        type: data.type,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        address: data.address,
        city: data.city,
        country: data.country,
        creditRequirementMin: data.creditRequirementMin,
        creditRequirementMax: data.creditRequirementMax,
        creditValuePerSession: parseFloat(data.creditValuePerSession),
        allowCrossInstitution: data.allowCrossInstitution,
        description: data.description,
      });
    } catch (error) {
      message.error(t('errors.fetchFailed') || 'Failed to fetch institution settings');
      console.error('Error fetching institution:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    if (!session?.user?.institutionId) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/institutions/${session.user.institutionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(t('institution.settingsSaved') || 'Settings saved successfully');
        fetchInstitution();
      } else {
        const error = await response.json();
        message.error(error.error || t('errors.updateFailed') || 'Failed to update settings');
      }
    } catch (error) {
      message.error(t('errors.updateFailed') || 'Failed to update settings');
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <App>
        <DashboardLayout role={session?.user?.role as any || 'faculty_coordinator'} user={{
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          avatar: session?.user?.avatar,
        }}>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Spin size="large" />
          </div>
        </DashboardLayout>
      </App>
    );
  }

  const user = {
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    avatar: session?.user?.avatar,
  };

  return (
    <App>
      <DashboardLayout role={session?.user?.role as any || 'faculty_coordinator'} user={user}>
        <div style={{ padding: '24px' }}>
          <Title level={2}>{t('institution.institutionSettings') || 'Institution Settings'} / Institution Settings</Title>

          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
            >
              <Row gutter={16}>
                {/* Basic Information */}
                <Col xs={24}>
                  <Title level={4}>{t('institution.basicInformation') || 'Basic Information'} / Basic Information</Title>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label={`${t('institution.institutionName') || 'Institution Name'} / Institution Name`}
                    name="name"
                    rules={[{ required: true, message: t('errors.required') || 'Required' }]}
                  >
                    <Input placeholder="e.g., Royal University of Phnom Penh" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={`${t('institution.institutionType') || 'Institution Type'} / Institution Type`}
                    name="type"
                    rules={[{ required: true, message: t('errors.required') || 'Required' }]}
                  >
                    <Select>
                      <Option value="university">{t('institution.university') || 'University'} / University</Option>
                      <Option value="college">{t('institution.college') || 'College'} / College</Option>
                      <Option value="high_school">{t('institution.highSchool') || 'High School'} / High School</Option>
                      <Option value="training_center">{t('institution.trainingCenter') || 'Training Center'} / Training Center</Option>
                      <Option value="other">{t('common.other') || 'Other'} / Other</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={`${t('institution.nameKhmer') || 'Name (Khmer)'} / Name (Khmer)`}
                    name="nameKh"
                  >
                    <Input placeholder="ឧទាហរណ៍៖ សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={`${t('institution.nameEnglish') || 'Name (English)'} / Name (English)`}
                    name="nameEn"
                  >
                    <Input placeholder="e.g., Royal University of Phnom Penh" />
                  </Form.Item>
                </Col>

                {/* Contact Information */}
                <Col xs={24} style={{ marginTop: 16 }}>
                  <Title level={4}>{t('institution.contactInformation') || 'Contact Information'} / Contact Information</Title>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={`${t('institution.contactEmail') || 'Contact Email'} / Contact Email`}
                    name="contactEmail"
                  >
                    <Input type="email" placeholder="contact@institution.edu.kh" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={`${t('institution.contactPhone') || 'Contact Phone'} / Contact Phone`}
                    name="contactPhone"
                  >
                    <Input placeholder="+855 12 345 678" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={`${t('institution.address') || 'Address'} / Address`}
                    name="address"
                  >
                    <Input placeholder="Street address" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={`${t('institution.city') || 'City'} / City`}
                    name="city"
                  >
                    <Input placeholder="Phnom Penh" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                  <Form.Item
                    label={`${t('institution.country') || 'Country'} / Country`}
                    name="country"
                  >
                    <Input placeholder="Cambodia" />
                  </Form.Item>
                </Col>

                {/* Credit System Configuration */}
                <Col xs={24} style={{ marginTop: 16 }}>
                  <Title level={4}>{t('institution.creditSystemConfig') || 'Credit System Configuration'} / Credit System Configuration</Title>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={`${t('institution.creditsPerSession') || 'Credits per Session'} / Credits per Session`}
                    name="creditValuePerSession"
                    rules={[{ required: true, message: t('errors.required') || 'Required' }]}
                  >
                    <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={`${t('institution.minSessions') || 'Min Sessions/Year'} / Min Sessions Required per Year`}
                    name="creditRequirementMin"
                    rules={[{ required: true, message: t('errors.required') || 'Required' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={`${t('institution.maxSessions') || 'Max Sessions/Year'} / Max Sessions Allowed per Year`}
                    name="creditRequirementMax"
                    rules={[{ required: true, message: t('errors.required') || 'Required' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label={`${t('institution.allowCrossInstitution') || 'Allow Cross-Institution Matching'} / Allow Cross-Institution Matching`}
                    name="allowCrossInstitution"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('institution.crossInstitutionHelp') || 'Allow your students to be matched with students from other institutions'} / 
                    Allow your students to be matched with students from other institutions
                  </Text>
                </Col>

                {/* Description */}
                <Col xs={24} style={{ marginTop: 16 }}>
                  <Form.Item
                    label={`${t('common.description') || 'Description'} / Description`}
                    name="description"
                  >
                    <TextArea rows={4} placeholder="Brief description of your institution..." />
                  </Form.Item>
                </Col>

                {/* Save Button */}
                <Col xs={24}>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                        {t('institution.saveSettings') || 'Save Settings'} / Save Settings
                      </Button>
                      <Button onClick={() => form.resetFields()}>
                        {t('common.cancel') || 'Cancel'} / Cancel
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </DashboardLayout>
    </App>
  );
}
