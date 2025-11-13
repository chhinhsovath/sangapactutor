'use client';

import { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Tag, Input, Select, Modal, Form, message, Typography } from 'antd';
import { UserAddOutlined, SearchOutlined, DeleteOutlined, TrophyOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

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
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [enrollModalVisible, setEnrollModalVisible] = useState(false);
  const [form] = Form.useForm();

  // TODO: Get from authenticated user's session
  const institutionId = 1;

  useEffect(() => {
    fetchStudents();
  }, [roleFilter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') {
        params.append('role', roleFilter);
      }

      const response = await fetch(`/api/institutions/${institutionId}/enroll?${params.toString()}`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      message.error('Failed to fetch students');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (values: any) => {
    try {
      const response = await fetch(`/api/institutions/${institutionId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Student enrolled successfully');
        setEnrollModalVisible(false);
        form.resetFields();
        fetchStudents();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to enroll student');
      }
    } catch (error) {
      message.error('Failed to enroll student');
      console.error('Error enrolling student:', error);
    }
  };

  const handleUnenroll = async (userId: number, name: string) => {
    Modal.confirm({
      title: 'Unenroll Student',
      content: `Are you sure you want to unenroll ${name}?`,
      okText: 'Yes, Unenroll',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await fetch(`/api/institutions/${institutionId}/enroll/${userId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            message.success('Student unenrolled successfully');
            fetchStudents();
          } else {
            const error = await response.json();
            message.error(error.error || 'Failed to unenroll student');
          }
        } catch (error) {
          message.error('Failed to unenroll student');
          console.error('Error unenrolling student:', error);
        }
      },
    });
  };

  const columns: ColumnsType<EnrolledStudent> = [
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
      render: (id) => id || '-',
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        const name = `${record.firstName} ${record.lastName}`.toLowerCase();
        return name.includes((value as string).toLowerCase());
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
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
      title: 'Credit Balance',
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
      title: 'Academic Year',
      dataIndex: 'academicYear',
      key: 'academicYear',
      render: (year) => year || '-',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleUnenroll(record.id, `${record.firstName} ${record.lastName}`)}
        >
          Unenroll
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>
            Enrolled Students
          </Title>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setEnrollModalVisible(true)}
          >
            Enroll Student
          </Button>
        </div>

        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by name"
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 200 }}
          >
            <Option value="all">All Roles</Option>
            <Option value="student">Student</Option>
            <Option value="verified_tutor">Verified Tutor</Option>
            <Option value="mentee">Mentee</Option>
            <Option value="faculty_coordinator">Faculty Coordinator</Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={students}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} students`,
          }}
        />
      </Card>

      {/* Enroll Student Modal */}
      <Modal
        title="Enroll Student"
        open={enrollModalVisible}
        onCancel={() => {
          setEnrollModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEnroll}>
          <Form.Item
            label="User ID"
            name="userId"
            rules={[{ required: true, message: 'Please enter user ID' }]}
            extra="The system user ID of the student to enroll"
          >
            <Input type="number" placeholder="e.g., 123" />
          </Form.Item>

          <Form.Item
            label="Student ID"
            name="studentId"
            extra="Institution's internal student ID (optional)"
          >
            <Input placeholder="e.g., RU-2024-0123" />
          </Form.Item>

          <Form.Item
            label="Academic Year"
            name="academicYear"
          >
            <Input placeholder="e.g., 2024-2025" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Enroll
              </Button>
              <Button onClick={() => {
                setEnrollModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
