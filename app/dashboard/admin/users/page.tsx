'use client';

import { Card, Table, Tag, Button, Space, Input, Select, Typography, Avatar, Modal, Form, Switch, message } from 'antd';
import { SearchOutlined, UserAddOutlined, EditOutlined, DeleteOutlined, MailOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useState, useEffect } from 'react';

const { Title } = Typography;
const { confirm } = Modal;

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState('all');
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const user = {
    name: 'Admin User',
    email: 'admin@tutorhub.com',
    avatar: 'https://i.pravatar.cc/150?img=60',
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users?role=${selectedRole}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const handleCreate = async (values: any) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('User created successfully');
        setCreateModalVisible(false);
        form.resetFields();
        fetchUsers();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to create user');
      }
    } catch (error) {
      message.error('Failed to create user');
    }
  };

  const handleEdit = (record: any) => {
    setSelectedUser(record);
    editForm.setFieldsValue({
      email: record.email,
      firstName: record.firstName,
      lastName: record.lastName,
      role: record.role,
      isActive: record.isActive,
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async (values: any) => {
    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('User updated successfully');
        setEditModalVisible(false);
        editForm.resetFields();
        fetchUsers();
      } else {
        message.error('Failed to update user');
      }
    } catch (error) {
      message.error('Failed to update user');
    }
  };

  const handleDelete = (record: any) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete ${record.firstName} ${record.lastName}`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          const response = await fetch(`/api/users/${record.id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            message.success('User deleted successfully');
            fetchUsers();
          } else {
            message.error('Failed to delete user');
          }
        } catch (error) {
          message.error('Failed to delete user');
        }
      },
    });
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (record: any) => {
        const fullName = `${record.firstName || ''} ${record.lastName || ''}`.trim();
        const initial = record.firstName?.[0] || record.email?.[0] || 'U';
        return (
          <Space>
            <Avatar src={record.avatar}>{initial}</Avatar>
            <div>
              <div>{fullName || record.email}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Role',
      key: 'role',
      dataIndex: 'role',
      render: (role: string) => {
        const colors: any = { student: 'green', tutor: 'blue', admin: 'red' };
        return <Tag color={colors[role]}>{role?.charAt(0).toUpperCase() + role?.slice(1)}</Tag>;
      },
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>{isActive ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Join Date',
      key: 'joinDate',
      render: (record: any) => new Date(record.createdAt).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout role="admin" user={user}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>User Management</Title>
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setCreateModalVisible(true)}>
          Create User
        </Button>
      </div>

      <Card>
        {/* Filters */}
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          <Select
            value={selectedRole}
            onChange={setSelectedRole}
            style={{ width: 150 }}
            options={[
              { label: 'All Roles', value: 'all' },
              { label: 'Students', value: 'student' },
              { label: 'Tutors', value: 'tutor' },
              { label: 'Admins', value: 'admin' },
            ]}
          />
          <Select
            placeholder="Status"
            style={{ width: 150 }}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
          <Button>Apply Filters</Button>
          <Button>Reset</Button>
        </Space>

        {/* Users Table */}
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          pagination={{
            total: users.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
        />
      </Card>

      {/* Create User Modal */}
      <Modal
        title="Create New User"
        open={createModalVisible}
        onCancel={() => {setCreateModalVisible(false); form.resetFields();}}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
            <Input placeholder="Enter first name" />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
            <Input placeholder="Enter last name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input type="email" placeholder="Enter email" />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select
              placeholder="Select role"
              options={[
                { label: 'Student', value: 'student' },
                { label: 'Tutor', value: 'tutor' },
                { label: 'Admin', value: 'admin' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item label="Active Status" name="isActive" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Create User</Button>
              <Button onClick={() => {setCreateModalVisible(false); form.resetFields();}}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={editModalVisible}
        onCancel={() => {setEditModalVisible(false); editForm.resetFields();}}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
            <Input placeholder="Enter first name" />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
            <Input placeholder="Enter last name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input type="email" placeholder="Enter email" />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select
              placeholder="Select role"
              options={[
                { label: 'Student', value: 'student' },
                { label: 'Tutor', value: 'tutor' },
                { label: 'Admin', value: 'admin' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Active Status" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Update User</Button>
              <Button onClick={() => {setEditModalVisible(false); editForm.resetFields();}}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}
