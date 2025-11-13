'use client';

import { useState, useEffect } from 'react';
import { Card, Form, Select, InputNumber, Switch, Button, message, Typography, Space, Checkbox, TimePicker } from 'antd';
import { SaveOutlined, HeartOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface Subject {
  id: number;
  name: string;
}

interface Institution {
  id: number;
  name: string;
}

interface MatchingPreference {
  preferredSubjects: number[];
  preferredInstitutions: number[];
  preferredSessionTypes: string[];
  maxSessionsPerWeek: number;
  availableDays: string[];
  availableTimeSlots: Record<string, string[]>;
  willingToTravelDistance?: number;
  onlineOnly: boolean;
  preferRemoteStudents: boolean;
  isActive: boolean;
}

export default function MatchingPreferencesPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  // TODO: Get from authenticated user session
  const userId = 123;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch subjects
      const subjectsResponse = await fetch('/api/departments');
      const subjectsData = await subjectsResponse.json();
      setSubjects(subjectsData);

      // Fetch institutions
      const institutionsResponse = await fetch('/api/institutions');
      const institutionsData = await institutionsResponse.json();
      setInstitutions(institutionsData);

      // Fetch existing preferences
      const prefsResponse = await fetch(`/api/matching/preferences?userId=${userId}`);
      const prefsData = await prefsResponse.json();

      if (prefsData && prefsData.id) {
        // Set form values
        form.setFieldsValue({
          preferredSubjects: prefsData.preferredSubjects,
          preferredInstitutions: prefsData.preferredInstitutions,
          preferredSessionTypes: prefsData.preferredSessionTypes,
          maxSessionsPerWeek: prefsData.maxSessionsPerWeek,
          availableDays: prefsData.availableDays,
          onlineOnly: prefsData.onlineOnly,
          preferRemoteStudents: prefsData.preferRemoteStudents,
          isActive: prefsData.isActive,
        });
      }
    } catch (error) {
      message.error('Failed to load preferences');
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/matching/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...values,
        }),
      });

      if (response.ok) {
        message.success('Matching preferences saved successfully');
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to save preferences');
      }
    } catch (error) {
      message.error('Failed to save preferences');
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' },
  ];

  const sessionTypes = [
    { label: 'Tutoring', value: 'tutoring' },
    { label: 'Mentoring', value: 'mentoring' },
    { label: 'Counseling', value: 'counseling' },
    { label: 'Workshop', value: 'workshop' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>
            <HeartOutlined style={{ marginRight: 8, color: '#ff6b6b' }} />
            Matching Preferences
          </Title>
          <Text type="secondary">
            Set your preferences to get matched with students who need your help. The system will
            prioritize matching you with students from remote areas for maximum social impact.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            maxSessionsPerWeek: 3,
            onlineOnly: true,
            preferRemoteStudents: true,
            isActive: true,
            preferredSessionTypes: ['tutoring'],
          }}
        >
          <Form.Item
            label="Subjects I Can Teach"
            name="preferredSubjects"
            rules={[{ required: true, message: 'Please select at least one subject' }]}
            extra="Select the subjects you're comfortable teaching"
          >
            <Select
              mode="multiple"
              placeholder="Select subjects"
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {subjects.map(subject => (
                <Option key={subject.id} value={subject.id}>
                  {subject.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Preferred Institutions"
            name="preferredInstitutions"
            extra="Leave empty to accept matches from any institution"
          >
            <Select
              mode="multiple"
              placeholder="Select preferred institutions (optional)"
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {institutions.map(institution => (
                <Option key={institution.id} value={institution.id}>
                  {institution.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Session Types"
            name="preferredSessionTypes"
            rules={[{ required: true, message: 'Please select at least one session type' }]}
          >
            <Checkbox.Group options={sessionTypes} />
          </Form.Item>

          <Form.Item
            label="Maximum Sessions Per Week"
            name="maxSessionsPerWeek"
            rules={[{ required: true, message: 'Please specify max sessions per week' }]}
            extra="How many tutoring sessions can you handle per week?"
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Available Days"
            name="availableDays"
            rules={[{ required: true, message: 'Please select at least one day' }]}
          >
            <Checkbox.Group options={daysOfWeek} />
          </Form.Item>

          <Form.Item
            label="Online Only"
            name="onlineOnly"
            valuePropName="checked"
            extra="If disabled, you may be matched with local students for in-person sessions"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Prioritize Remote Students"
            name="preferRemoteStudents"
            valuePropName="checked"
            extra="Enable to help students from underserved rural areas (recommended for maximum social impact)"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Activate Matching"
            name="isActive"
            valuePropName="checked"
            extra="Turn this off to pause receiving new match suggestions"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
              block
            >
              Save Preferences
            </Button>
          </Form.Item>
        </Form>

        <Card
          style={{ marginTop: 24, background: '#e6f7ff', borderColor: '#91d5ff' }}
          bodyStyle={{ padding: 16 }}
        >
          <Space direction="vertical">
            <Text strong style={{ color: '#096dd9' }}>
              💡 How Matching Works
            </Text>
            <Text type="secondary">
              • The system matches you with students who need help in your subject areas
            </Text>
            <Text type="secondary">
              • Cross-institution matches earn higher credits and create more social impact
            </Text>
            <Text type="secondary">
              • You'll receive match suggestions that you can accept or decline
            </Text>
            <Text type="secondary">
              • Once both parties accept, you can start scheduling sessions together
            </Text>
          </Space>
        </Card>
      </Card>
    </div>
  );
}
