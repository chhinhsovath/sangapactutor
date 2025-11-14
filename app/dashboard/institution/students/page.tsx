'use client';

import { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Tag, Input, Select, Modal, Form, message, Typography, App } from 'antd';
import { UserAddOutlined, SearchOutlined, DeleteOutlined, TrophyOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const { Title } = Typography;
const { Option } = Select;

interface EnrolledStudent {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  studentId?: string;
  creditBalance: string;
  academicYear?: string;
  isActive: boolean;
  createdAt: string;
}

export default function EnrolledStudentsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message: msg } = App.useApp();
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [enrollModalVisible, setEnrollModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.institutionId) {
      fetchStudents();
    }
  }, [status, session, roleFilter]);

  const fetchStudents = async () => {
    if (!session?.user?.institutionId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') {
        params.append('role', roleFilter);
      }

      const response = await fetch(`/api/institutions/${session.user.institutionId}/enroll?${params.toString()}`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      msg.error(t('errors.fetchFailed') || 'Failed to fetch students');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (values: any) => {
    if (!session?.user?.institutionId) return;

    try {
      const response = await fetch(`/api/institutions/${session.user.institutionId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        msg.success(t('institution.studentEnrolled') || 'Student enrolled successfully');
        setEnrollModalVisible(false);
        form.resetFields();
        fetchStudents();
      } else {
        const error = await response.json();
        msg.error(error.error || t('institution.enrollFailed') || 'Failed to enroll student');
      }
    } catch (error) {
      msg.error(t('institution.enrollFailed') || 'Failed to enroll student');
      console.error('Error enrolling student:', error);
    }
  };

  const handleUnenroll = async (userId: number, name: string) => {
    if (!session?.user?.institutionId) return;

    Modal.confirm({
      title: `${t('institution.unenrollStudent') || 'Unenroll Student'} / Unenroll Student`,
      content: `${t('institution.confirmUnenroll') || 'Are you sure you want to unenroll'} ${name}?`,
      okText: `${t('common.yes') || 'Yes'} / Yes, Unenroll`,
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await fetch(`/api/institutions/${session.user.institutionId}/enroll/${userId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            msg.success(t('institution.studentUnenrolled') || 'Student unenrolled successfully');
            fetchStudents();
          } else {
            const error = await response.json();
            msg.error(error.error || t('institution.unenrollFailed') || 'Failed to unenroll student');
          }
        } catch (error) {
          msg.error(t('institution.unenrollFailed') || 'Failed to unenroll student');
          console.error('Error unenrolling student:', error);
        }
      },
    });
  };

  const columns: ColumnsType<EnrolledStudent> = [
    {
      title: `${t('institution.studentId') || 'Student ID'} / Student ID`,
      dataIndex: 'studentId',
      key: 'studentId',
      render: (id) => id || '-',
    },
    {
      title: `${t('common.name') || 'Name'} / Name`,
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        const name = `${record.firstName} ${record.lastName}`.toLowerCase();
        return name.includes((value as string).toLowerCase());
      },
    },
    {
      title: `${t('auth.email') || 'Email'} / Email`,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: `${t('common.role') || 'Role'} / Role`,
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colorMap: Record<string, string> = {
          student: 'blue',
          verified_tutor: 'green',
          mentee: 'orange',
          faculty_coordinator: 'purple',
        };
        return <Tag color={colorMap[role] || 'default'}>{role.replace('_', ' ').toUpperCase()}</Tag>;
      },
    },
    {
      title: `${t('institution.creditBalance') || 'Credit Balance'} / Credit Balance`,
      dataIndex: 'creditBalance',
      key: 'creditBalance',
      render: (balance) => (
        <Space>
          <TrophyOutlined style={{ color: '#faad14' }} />
          <span>{parseFloat(balance).toFixed(1)}</span>
        </Space>
      ),
      sorter: (a, b) => parseFloat(a.creditBalance) - parseFloat(b.creditBalance),
    },
    {
      title: `${t('institution.academicYear') || 'Academic Year'} / Academic Year`,
      dataIndex: 'academicYear',
      key: 'academicYear',
      render: (year) => year || '-',
    },
    {
      title: `${t('common.status') || 'Status'} / Status`,
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? `${t('common.active') || 'Active'} / Active` : `${t('common.inactive') || 'Inactive'} / Inactive`}
        </Tag>
      ),
    },
    {
      title: `${t('common.actions') || 'Actions'} / Actions`,
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleUnenroll(record.id, `${record.firstName} ${record.lastName}`)}
        >
          {t('institution.unenroll') || 'Unenroll'} / Unenroll
        </Button>
      ),
    },
  ];

  if (status === 'loading' || loading) {
    return (
      <App>
        <DashboardLayout role={session?.user?.role as any || 'faculty_coordinator'} user={{
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          avatar: session?.user?.avatar,
        }}>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Typography.Text>{t('common.loading') || 'Loading...'}</Typography.Text>
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
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>
            {t('institution.enrolledStudents') || 'Enrolled Students'} / Enrolled Students
          </Title>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setEnrollModalVisible(true)}
          >
            {t('institution.enrollStudent') || 'Enroll Student'} / Enroll Student
          </Button>
        </div>

        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder={`${t('common.search') || 'Search'} / Search by name`}
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 200 }}
          >
            <Option value="all">{t('common.allRoles') || 'All Roles'} / All Roles</Option>
            <Option value="student">{t('student.portal') || 'Student'} / Student</Option>
            <Option value="verified_tutor">{t('institution.verifiedTutor') || 'Verified Tutor'} / Verified Tutor</Option>
            <Option value="mentee">{t('institution.mentee') || 'Mentee'} / Mentee</Option>
            <Option value="faculty_coordinator">{t('institution.facultyCoordinator') || 'Faculty Coordinator'} / Faculty Coordinator</Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={students}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `${t('common.total') || 'Total'} ${total} ${t('institution.students') || 'students'}`,
          }}
        />
      </Card>

      {/* Enroll Student Modal */}
      <Modal
        title={`${t('institution.enrollStudent') || 'Enroll Student'} / Enroll Student`}
        open={enrollModalVisible}
        onCancel={() => {
          setEnrollModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEnroll}>
          <Form.Item
            label={`${t('institution.userId') || 'User ID'} / User ID`}
            name="userId"
            rules={[{ required: true, message: t('institution.enterUserId') || 'Please enter user ID' }]}
            extra={t('institution.userIdHelp') || 'The system user ID of the student to enroll'}
          >
            <Input type="number" placeholder="e.g., 123" />
          </Form.Item>

          <Form.Item
            label={`${t('institution.studentId') || 'Student ID'} / Student ID`}
            name="studentId"
            extra={t('institution.studentIdHelp') || "Institution's internal student ID (optional)"}
          >
            <Input placeholder="e.g., RU-2024-0123" />
          </Form.Item>

          <Form.Item
            label={`${t('institution.academicYear') || 'Academic Year'} / Academic Year`}
            name="academicYear"
          >
            <Input placeholder="e.g., 2024-2025" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('institution.enroll') || 'Enroll'} / Enroll
              </Button>
              <Button onClick={() => {
                setEnrollModalVisible(false);
                form.resetFields();
              }}>
                {t('common.cancel') || 'Cancel'} / Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
      </DashboardLayout>
    </App>
  );
}
