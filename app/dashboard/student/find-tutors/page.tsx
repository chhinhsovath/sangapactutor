'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Typography, Input, Space, Spin, Modal, Form, DatePicker, InputNumber, Button, App } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TutorFilters from '@/components/filters/JobFilters';
import TutorList from '@/components/job-list/JobList';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { TextArea } = Input;

const { Title, Paragraph } = Typography;

export default function StudentFindTutorsPage() {
  const { t } = useLanguage();
  const { message } = App.useApp();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [bookingForm] = Form.useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tutorsRes, subjectsRes, countriesRes] = await Promise.all([
        fetch('/api/tutors'),
        fetch('/api/subjects'),
        fetch('/api/countries'),
      ]);

      const tutorsData = await tutorsRes.json();
      const subjectsData = await subjectsRes.json();
      const countriesData = await countriesRes.json();

      setTutors(tutorsData.filter((t: any) => t.isActive && t.isVerified));
      setSubjects(subjectsData);
      setCountries(countriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSubject('all');
    setSelectedCountry('all');
    setSelectedSpecialization('all');
    setPriceRange([0, 100]);
    setSearchQuery('');
  };

  const handleBookLesson = (tutor: any) => {
    setSelectedTutor(tutor);
    bookingForm.resetFields();
    setBookingModalVisible(true);
  };

  const handleBookingSubmit = async (values: any) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: session?.user?.id,
          tutorId: selectedTutor.id,
          scheduledAt: values.scheduledAt.toISOString(),
          duration: values.duration,
          price: (selectedTutor.hourlyRate * (values.duration / 60)).toFixed(2),
          notes: values.notes || null,
        }),
      });

      if (response.ok) {
        message.success(t('student.findTutorsPage.bookingSuccess'));
        setBookingModalVisible(false);
        bookingForm.resetFields();
      } else {
        message.error(t('student.findTutorsPage.bookingFailed'));
      }
    } catch (error) {
      message.error(t('student.findTutorsPage.bookingFailed'));
    }
  };

  if (status === 'loading' || loading) {
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

  const user = {
    name: session.user.name || '',
    email: session.user.email || '',
    avatar: session.user.image || '',
  };

  // Filter tutors
  const filteredTutors = tutors.filter((tutor: any) => {
    const matchesSearch = searchQuery === '' || 
      `${tutor.firstName} ${tutor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subject?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || tutor.subjectId === parseInt(selectedSubject);
    const matchesCountry = selectedCountry === 'all' || tutor.countryId === parseInt(selectedCountry);
    const matchesSpecialization = selectedSpecialization === 'all' || tutor.specialization === selectedSpecialization;
    const matchesPrice = parseFloat(tutor.hourlyRate) >= priceRange[0] && parseFloat(tutor.hourlyRate) <= priceRange[1];

    return matchesSearch && matchesSubject && matchesCountry && matchesSpecialization && matchesPrice;
  });

  return (
    <App>
      <DashboardLayout role="student" user={user}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2}>{t('student.findTutorsPage.title')}</Title>
        <Paragraph type="secondary">
          {t('student.findTutorsPage.subtitle')}
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Search Bar */}
        <Input
          size="large"
          placeholder={t('student.findTutorsPage.searchPlaceholder')}
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: 600 }}
        />

        {/* Filters */}
        <TutorFilters
          subjects={subjects}
          countries={countries}
          selectedSubject={selectedSubject}
          selectedCountry={selectedCountry}
          selectedSpecialization={selectedSpecialization}
          priceRange={priceRange}
          onSubjectChange={setSelectedSubject}
          onCountryChange={setSelectedCountry}
          onSpecializationChange={setSelectedSpecialization}
          onPriceChange={setPriceRange}
          onReset={handleReset}
        />

        {/* Tutor List */}
        <TutorList tutors={filteredTutors} onBookLesson={handleBookLesson} />
      </Space>

      {/* Booking Modal */}
      <Modal
        title={`${t('student.findTutorsPage.bookingTitle')} ${selectedTutor?.firstName} ${selectedTutor?.lastName}`}
        open={bookingModalVisible}
        onCancel={() => {
          setBookingModalVisible(false);
          bookingForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={bookingForm} layout="vertical" onFinish={handleBookingSubmit}>
          <Form.Item
            name="scheduledAt"
            label={t('student.findTutorsPage.selectDateTime')}
            rules={[{ required: true, message: t('student.findTutorsPage.selectDateTimeRequired') }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label={t('student.findTutorsPage.duration')}
            rules={[{ required: true, message: t('student.findTutorsPage.durationRequired') }]}
            initialValue={60}
          >
            <InputNumber
              min={30}
              max={180}
              step={15}
              style={{ width: '100%' }}
              addonAfter="minutes"
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.duration !== currentValues.duration}
          >
            {({ getFieldValue }) => {
              const duration = getFieldValue('duration') || 60;
              const price = (parseFloat(selectedTutor?.hourlyRate || 0) * (duration / 60)).toFixed(2);
              return (
                <div style={{ marginBottom: 16, padding: 12, background: '#f0f2f5', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t('student.findTutorsPage.totalPrice')}:</span>
                    <span style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>${price}</span>
                  </div>
                </div>
              );
            }}
          </Form.Item>

          <Form.Item
            name="notes"
            label={t('student.findTutorsPage.notes')}
          >
            <TextArea 
              rows={3} 
              placeholder={t('student.findTutorsPage.notesPlaceholder')}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              {t('student.findTutorsPage.confirmBooking')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
    </App>
  );
}
