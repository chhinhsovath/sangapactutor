'use client';

import { useState, useEffect } from 'react';
import { Calendar, Badge, Modal, List, Avatar, Tag, Typography, Card, Spin, App } from 'antd';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function TutorSchedulePage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDayBookings, setSelectedDayBookings] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.tutorId) {
      fetchBookings();
    }
  }, [status, session]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings?tutorId=${session?.user?.tutorId}`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      message.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const getListData = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    return bookings.filter((booking: any) => 
      dayjs(booking.scheduledAt).format('YYYY-MM-DD') === dateStr
    );
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {listData.map((item: any) => (
          <li key={item.id}>
            <Badge 
              status={
                item.status === 'confirmed' ? 'success' : 
                item.status === 'pending' ? 'warning' : 
                item.status === 'completed' ? 'default' : 'error'
              } 
              text={dayjs(item.scheduledAt).format('HH:mm')} 
            />
          </li>
        ))}
      </ul>
    );
  };

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    const dayBookings = getListData(date);
    if (dayBookings.length > 0) {
      setSelectedDayBookings(dayBookings);
      setModalVisible(true);
    }
  };

  if (status === 'loading' || loading) {
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
    <DashboardLayout role="tutor" user={user}>
      <Title level={2}>{t('tutor.schedule')}</Title>

      <Card style={{ marginTop: 24 }}>
        <Calendar 
          dateCellRender={dateCellRender}
          onSelect={handleDateSelect}
        />
      </Card>

      <Modal
        title={`${t('tutor.schedule')} - ${selectedDate.format('MMMM D, YYYY')}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <List
          dataSource={selectedDayBookings}
          renderItem={(booking: any) => {
            const studentName = `${booking.student.firstName} ${booking.student.lastName}`;
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={booking.student.avatar || undefined}>{studentName.charAt(0)}</Avatar>}
                  title={
                    <div>
                      {studentName}
                      <Tag 
                        color={
                          booking.status === 'confirmed' ? 'green' : 
                          booking.status === 'pending' ? 'orange' : 
                          booking.status === 'completed' ? 'blue' : 'red'
                        }
                        style={{ marginLeft: 8 }}
                      >
                        {booking.status.toUpperCase()}
                      </Tag>
                    </div>
                  }
                  description={
                    <>
                      <Text>{dayjs(booking.scheduledAt).format('HH:mm')} - {booking.duration} min</Text>
                      <br />
                      <Text type="secondary">${booking.price}</Text>
                      {booking.notes && (
                        <>
                          <br />
                          <Text type="secondary">{booking.notes}</Text>
                        </>
                      )}
                    </>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}
