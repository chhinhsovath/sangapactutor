'use client';

import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, App, Card, Typography, Spin } from 'antd';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title } = Typography;
const { TextArea } = Input;

export default function TutorProfileEditPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [tutorData, setTutorData] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.tutorId) {
      fetchData();
    }
  }, [status, session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tutorRes, subjectsRes, countriesRes] = await Promise.all([
        fetch(`/api/tutors/${session?.user?.tutorId}`),
        fetch('/api/subjects'),
        fetch('/api/countries'),
      ]);

      const tutorData = await tutorRes.json();
      const subjectsData = await subjectsRes.json();
      const countriesData = await countriesRes.json();

      setTutorData(tutorData);
      setSubjects(subjectsData);
      setCountries(countriesData);

      // Parse spoken languages if it's a JSON string
      let spokenLanguages = '';
      if (tutorData.spokenLanguages) {
        try {
          const parsed = JSON.parse(tutorData.spokenLanguages);
          spokenLanguages = Array.isArray(parsed) ? parsed.join(', ') : tutorData.spokenLanguages;
        } catch {
          spokenLanguages = tutorData.spokenLanguages;
        }
      }

      form.setFieldsValue({
        firstName: tutorData.firstName,
        lastName: tutorData.lastName,
        subjectId: tutorData.subjectId,
        countryId: tutorData.countryId,
        specialization: tutorData.specialization,
        level: tutorData.level,
        hourlyRate: parseFloat(tutorData.hourlyRate),
        yearsExperience: tutorData.yearsExperience,
        bio: tutorData.bio,
        teachingStyle: tutorData.teachingStyle,
        spokenLanguages: spokenLanguages,
        videoIntro: tutorData.videoIntro,
      });
    } catch (error) {
      message.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Convert spoken languages to JSON array
      const languagesArray = values.spokenLanguages
        ? values.spokenLanguages.split(',').map((lang: string) => lang.trim()).filter(Boolean)
        : [];

      const response = await fetch(`/api/tutors/${session?.user?.tutorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          spokenLanguages: JSON.stringify(languagesArray),
          hourlyRate: values.hourlyRate.toString(),
        }),
      });

      if (response.ok) {
        message.success(t('tutor.tutorProfilePage.profileUpdated'));
        fetchData();
      } else {
        message.error(t('tutor.tutorProfilePage.updateFailed'));
      }
    } catch (error) {
      message.error(t('tutor.tutorProfilePage.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !tutorData) {
    return (
      <DashboardLayout role="tutor" user={{ name: '', email: '', avatar: '' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (!session?.user || !session?.user?.tutorId) {
    return null;
  }

  const user = {
    name: session.user.name || '',
    email: session.user.email || '',
    avatar: session.user.image || '',
  };

  return (
    <App>
      <DashboardLayout role="tutor" user={user}>
        <div style={{ maxWidth: '900px' }}>
          <Title level={2}>{t('tutor.tutorProfilePage.title')}</Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            {/* Basic Information */}
            <Card title={t('tutor.tutorProfilePage.basicInfo')} style={{ marginBottom: 24 }}>
              <Form.Item
                name="firstName"
                label={t('student.profilePage.firstName')}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="lastName"
                label={t('student.profilePage.lastName')}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="countryId"
                label={t('tutor.tutorProfilePage.country')}
                rules={[{ required: true, message: t('tutor.tutorProfilePage.selectCountryRequired') }]}
              >
                <Select placeholder={t('tutor.tutorProfilePage.selectCountry')}>
                  {countries.map((country) => (
                    <Select.Option key={country.id} value={country.id}>
                      {country.flag} {country.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="spokenLanguages"
                label={t('tutor.tutorProfilePage.spokenLanguages')}
              >
                <Input placeholder={t('tutor.tutorProfilePage.languagesPlaceholder')} />
              </Form.Item>
            </Card>

            {/* Teaching Information */}
            <Card title={t('tutor.tutorProfilePage.teachingInfo')} style={{ marginBottom: 24 }}>
              <Form.Item
                name="subjectId"
                label={t('tutor.tutorProfilePage.subject')}
                rules={[{ required: true, message: t('tutor.tutorProfilePage.selectSubjectRequired') }]}
              >
                <Select placeholder={t('tutor.tutorProfilePage.selectSubject')}>
                  {subjects.map((subject) => (
                    <Select.Option key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="specialization"
                label={t('tutor.tutorProfilePage.specialization')}
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="Conversational">Conversational</Select.Option>
                  <Select.Option value="Business">Business</Select.Option>
                  <Select.Option value="Test Preparation">Test Preparation</Select.Option>
                  <Select.Option value="Academic">Academic</Select.Option>
                  <Select.Option value="Kids & Teens">Kids & Teens</Select.Option>
                  <Select.Option value="Job Interview">Job Interview</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="level"
                label={t('tutor.tutorProfilePage.level')}
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="Beginner">Beginner</Select.Option>
                  <Select.Option value="Intermediate">Intermediate</Select.Option>
                  <Select.Option value="Advanced">Advanced</Select.Option>
                  <Select.Option value="Native">Native</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="hourlyRate"
                label={t('tutor.tutorProfilePage.hourlyRate')}
                rules={[{ required: true, message: t('tutor.tutorProfilePage.hourlyRateRequired') }]}
              >
                <InputNumber
                  min={5}
                  max={500}
                  step={5}
                  style={{ width: '100%' }}
                  addonBefore="$"
                  addonAfter="/ hour"
                />
              </Form.Item>

              <Form.Item
                name="yearsExperience"
                label={t('tutor.tutorProfilePage.yearsExperience')}
              >
                <InputNumber
                  min={0}
                  max={50}
                  style={{ width: '100%' }}
                  addonAfter="years"
                />
              </Form.Item>
            </Card>

            {/* About You */}
            <Card title={t('tutor.tutorProfilePage.aboutYou')} style={{ marginBottom: 24 }}>
              <Form.Item
                name="bio"
                label={t('tutor.tutorProfilePage.bio')}
                rules={[{ required: true, message: t('tutor.tutorProfilePage.bioRequired') }]}
              >
                <TextArea
                  rows={5}
                  placeholder={t('tutor.tutorProfilePage.bioPlaceholder')}
                />
              </Form.Item>

              <Form.Item
                name="teachingStyle"
                label={t('tutor.tutorProfilePage.teachingStyle')}
              >
                <TextArea
                  rows={4}
                  placeholder={t('tutor.tutorProfilePage.teachingStylePlaceholder')}
                />
              </Form.Item>

              <Form.Item
                name="videoIntro"
                label={t('tutor.tutorProfilePage.videoIntro')}
              >
                <Input placeholder={t('tutor.tutorProfilePage.videoPlaceholder')} />
              </Form.Item>
            </Card>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} size="large" block>
                {t('tutor.tutorProfilePage.updateProfile')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </DashboardLayout>
    </App>
  );
}
