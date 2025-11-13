'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, App, Typography, Spin, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title } = Typography;
const { TextArea } = Input;

export default function TutorStudentsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.tutorId) {
      fetchStudents();
    }
  }, [status, session]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const bookingsRes = await fetch(`/api/bookings?tutorId=${session?.user?.tutorId}`);
      const bookings = await bookingsRes.json();

      // Get unique students with their stats
      const studentMap = new Map();
      bookings.forEach((booking: any) => {
        const studentId = booking.student.id;
        if (!studentMap.has(studentId)) {
          studentMap.set(studentId, {
            ...booking.student,
            totalLessons: 0,
            upcomingLessons: 0,
          });
        }
        const student = studentMap.get(studentId);
        if (booking.status === 'completed') {
          student.totalLessons++;
        }
        if (booking.status === 'confirmed' || booking.status === 'pending') {
          student.upcomingLessons++;
        }
      });

      // Fetch notes for each student
      const studentsArray = Array.from(studentMap.values());
      const notesRes = await fetch(`/api/student-notes?tutorId=${session?.user?.tutorId}`);
      const notes = await notesRes.json();

      studentsArray.forEach((student: any) => {
        student.note = notes.find((n: any) => n.studentId === student.id);
      });

      setStudents(studentsArray);
    } catch (error) {
      message.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = (student: any) => {
    setEditingNote({ studentId: student.id, studentName: `${student.firstName} ${student.lastName}` });
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditNote = (student: any) => {
    setEditingNote({ 
      ...student.note, 
      studentName: `${student.firstName} ${student.lastName}`,
      studentId: student.id,
    });
    form.setFieldsValue({
      notes: student.note.notes,
      progressLevel: student.note.progressLevel,
    });
    setModalVisible(true);
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      const response = await fetch(`/api/student-notes/${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        message.success(t('tutor.studentsPage.noteDeleted'));
        fetchStudents();
      } else {
        message.error(t('errors.deleteFailed'));
      }
    } catch (error) {
      message.error(t('errors.deleteFailed'));
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = editingNote?.id 
        ? `/api/student-notes/${editingNote.id}`
        : '/api/student-notes';
      
      const response = await fetch(url, {
        method: editingNote?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorId: session?.user?.tutorId,
          studentId: editingNote.studentId,
          notes: values.notes,
          progressLevel: values.progressLevel,
        }),
      });

      if (response.ok) {
        message.success(editingNote?.id ? t('tutor.studentsPage.noteUpdated') : t('tutor.studentsPage.noteAdded'));
        setModalVisible(false);
        form.resetFields();
        fetchStudents();
      } else {
        message.error(t('errors.createFailed'));
      }
    } catch (error) {
      message.error(t('errors.createFailed'));
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

  const columns = [
    {
      title: t('tutor.studentsPage.name'),
      key: 'name',
      render: (_: any, record: any) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: t('tutor.studentsPage.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('tutor.studentsPage.totalLessons'),
      dataIndex: 'totalLessons',
      key: 'totalLessons',
    },
    {
      title: t('tutor.studentsPage.upcomingLessons'),
      dataIndex: 'upcomingLessons',
      key: 'upcomingLessons',
    },
    {
      title: t('tutor.studentsPage.progressLevel'),
      key: 'progressLevel',
      render: (_: any, record: any) => {
        if (!record.note?.progressLevel) return '-';
        const colors: any = {
          beginner: 'blue',
          intermediate: 'orange',
          advanced: 'green',
          expert: 'purple',
        };
        return (
          <Tag color={colors[record.note.progressLevel]}>
            {t(`tutor.studentsPage.${record.note.progressLevel}`)}
          </Tag>
        );
      },
    },
    {
      title: t('tutor.studentsPage.notes'),
      key: 'notes',
      render: (_: any, record: any) => (
        record.note ? (
          <Tag color="green">{t('tutor.studentsPage.hasNotes')}</Tag>
        ) : (
          <Tag>{t('tutor.studentsPage.noNotes')}</Tag>
        )
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.note ? (
            <>
              <Button 
                size="small" 
                icon={<EditOutlined />}
                onClick={() => handleEditNote(record)}
              >
                {t('tutor.studentsPage.editNote')}
              </Button>
              <Button 
                size="small" 
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteNote(record.note.id)}
              >
                {t('tutor.studentsPage.deleteNote')}
              </Button>
            </>
          ) : (
            <Button 
              type="primary" 
              size="small" 
              icon={<PlusOutlined />}
              onClick={() => handleAddNote(record)}
            >
              {t('tutor.studentsPage.addNote')}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout role="tutor" user={user}>
      <Title level={2}>{t('tutor.studentsPage.title')}</Title>

      <Table
        columns={columns}
        dataSource={students}
        rowKey="id"
        loading={loading}
        style={{ marginTop: 24 }}
      />

      <Modal
        title={editingNote?.id ? t('tutor.studentsPage.editStudentNote') : `${t('tutor.studentsPage.addNoteFor')} ${editingNote?.studentName}`}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="notes"
            label={t('tutor.studentsPage.notes')}
            rules={[{ required: true, message: t('errors.required') }]}
          >
            <TextArea 
              rows={4} 
              placeholder={t('tutor.studentsPage.notePlaceholder')}
            />
          </Form.Item>

          <Form.Item
            name="progressLevel"
            label={t('tutor.studentsPage.progressLevel')}
          >
            <Select>
              <Select.Option value="beginner">{t('tutor.studentsPage.beginner')}</Select.Option>
              <Select.Option value="intermediate">{t('tutor.studentsPage.intermediate')}</Select.Option>
              <Select.Option value="advanced">{t('tutor.studentsPage.advanced')}</Select.Option>
              <Select.Option value="expert">{t('tutor.studentsPage.expert')}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('common.save')}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}
