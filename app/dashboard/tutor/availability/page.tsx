'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Switch, TimePicker, Button, App, Spin, Space, Tag } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  enabled: boolean;
  slots: TimeSlot[];
}

interface Availability {
  [key: string]: DayAvailability;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

export default function TutorAvailabilityPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState<Availability>({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.tutorId) {
      fetchAvailability();
    }
  }, [status, session]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tutors/${session?.user?.tutorId}`);
      const tutor = await response.json();

      // Parse availability from JSON or set default
      let parsedAvailability: Availability = {};
      if (tutor.availability) {
        try {
          parsedAvailability = JSON.parse(tutor.availability);
        } catch (e) {
          console.error('Error parsing availability:', e);
        }
      }

      // Initialize default availability for all days if not set
      const initialAvailability: Availability = {};
      DAYS_OF_WEEK.forEach(({ key }) => {
        initialAvailability[key] = parsedAvailability[key] || {
          enabled: false,
          slots: [{ start: '09:00', end: '17:00' }],
        };
      });

      setAvailability(initialAvailability);
    } catch (error) {
      message.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day: string, enabled: boolean) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled,
      },
    }));
  };

  const handleTimeChange = (day: string, slotIndex: number, type: 'start' | 'end', time: Dayjs | null) => {
    if (!time) return;

    setAvailability((prev) => {
      const newSlots = [...prev[day].slots];
      newSlots[slotIndex] = {
        ...newSlots[slotIndex],
        [type]: time.format('HH:mm'),
      };

      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: newSlots,
        },
      };
    });
  };

  const handleAddSlot = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: '09:00', end: '17:00' }],
      },
    }));
  };

  const handleRemoveSlot = (day: string, slotIndex: number) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, index) => index !== slotIndex),
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/tutors/${session?.user?.tutorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          availability: JSON.stringify(availability),
        }),
      });

      if (response.ok) {
        message.success(t('tutor.availabilityPage.availabilitySaved'));
      } else {
        message.error(t('errors.updateFailed'));
      }
    } catch (error) {
      message.error(t('errors.updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleSetAllDays = (enabled: boolean) => {
    const newAvailability: Availability = {};
    DAYS_OF_WEEK.forEach(({ key }) => {
      newAvailability[key] = {
        enabled,
        slots: availability[key]?.slots || [{ start: '09:00', end: '17:00' }],
      };
    });
    setAvailability(newAvailability);
  };

  const handleCopyToAll = (sourceDay: string) => {
    const sourceAvailability = availability[sourceDay];
    const newAvailability: Availability = {};
    
    DAYS_OF_WEEK.forEach(({ key }) => {
      newAvailability[key] = {
        enabled: sourceAvailability.enabled,
        slots: sourceAvailability.slots.map(slot => ({ ...slot })),
      };
    });
    
    setAvailability(newAvailability);
    message.success(t('tutor.availabilityPage.copiedToAll'));
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

  const enabledDays = DAYS_OF_WEEK.filter(({ key }) => availability[key]?.enabled).length;

  return (
    <App>
      <DashboardLayout role="tutor" user={user}>
        <div style={{ maxWidth: 1000 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <Title level={2}>{t('tutor.availabilityPage.title')}</Title>
              <Paragraph type="secondary">
                {t('tutor.availabilityPage.subtitle')}
              </Paragraph>
            </div>
            <Button type="primary" size="large" onClick={handleSave} loading={saving}>
              {t('tutor.availabilityPage.saveAvailability')}
            </Button>
          </div>

          {/* Summary Card */}
          <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', color: 'white' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 'bold' }}>
                  {enabledDays}
                </div>
                <div>{t('tutor.availabilityPage.daysAvailable')}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 'bold' }}>
                  {Object.values(availability).reduce((sum, day) => sum + (day.enabled ? day.slots.length : 0), 0)}
                </div>
                <div>{t('tutor.availabilityPage.timeSlots')}</div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title={t('tutor.availabilityPage.quickActions')} style={{ marginBottom: 24 }}>
            <Space wrap>
              <Button onClick={() => handleSetAllDays(true)} icon={<CheckCircleOutlined />}>
                {t('tutor.availabilityPage.enableAllDays')}
              </Button>
              <Button onClick={() => handleSetAllDays(false)} icon={<CloseCircleOutlined />}>
                {t('tutor.availabilityPage.disableAllDays')}
              </Button>
            </Space>
          </Card>

          {/* Days Schedule */}
          {DAYS_OF_WEEK.map(({ key, label }) => {
            const dayData = availability[key] || { enabled: false, slots: [] };
            
            return (
              <Card
                key={key}
                style={{ marginBottom: 16 }}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                      <ClockCircleOutlined />
                      <span>{t(`tutor.availabilityPage.${key}`)}</span>
                      {dayData.enabled && (
                        <Tag color="green">{t('tutor.availabilityPage.available')}</Tag>
                      )}
                    </Space>
                    <Space>
                      <Switch
                        checked={dayData.enabled}
                        onChange={(checked) => handleDayToggle(key, checked)}
                      />
                      {dayData.enabled && (
                        <Button size="small" onClick={() => handleCopyToAll(key)}>
                          {t('tutor.availabilityPage.copyToAll')}
                        </Button>
                      )}
                    </Space>
                  </div>
                }
              >
                {dayData.enabled ? (
                  <div>
                    {dayData.slots.map((slot, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 12 }}>
                        <TimePicker
                          format="HH:mm"
                          value={dayjs(slot.start, 'HH:mm')}
                          onChange={(time) => handleTimeChange(key, index, 'start', time)}
                          minuteStep={15}
                        />
                        <Text>to</Text>
                        <TimePicker
                          format="HH:mm"
                          value={dayjs(slot.end, 'HH:mm')}
                          onChange={(time) => handleTimeChange(key, index, 'end', time)}
                          minuteStep={15}
                        />
                        {dayData.slots.length > 1 && (
                          <Button
                            danger
                            size="small"
                            onClick={() => handleRemoveSlot(key, index)}
                          >
                            {t('common.remove')}
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => handleAddSlot(key)}
                      style={{ marginTop: 8 }}
                    >
                      + {t('tutor.availabilityPage.addTimeSlot')}
                    </Button>
                  </div>
                ) : (
                  <Text type="secondary">{t('tutor.availabilityPage.dayNotAvailable')}</Text>
                )}
              </Card>
            );
          })}

          {/* Save Button at Bottom */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Button type="primary" size="large" onClick={handleSave} loading={saving}>
              {t('tutor.availabilityPage.saveAvailability')}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </App>
  );
}
