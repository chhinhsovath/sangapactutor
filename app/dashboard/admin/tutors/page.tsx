'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, Tag, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const { TextArea } = Input;

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchTutors();
    fetchSubjects();
    fetchCountries();
  }, []);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tutors');
      const data = await response.json();
      setTutors(data);
    } catch (error) {
      message.error('Failed to fetch tutors');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects');
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to fetch subjects');
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/countries');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Failed to fetch countries');
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const slug = `${values.firstName}-${values.lastName}`.toLowerCase().replace(/\s+/g, '-');
      const response = await fetch('/api/tutors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, slug }),
      });

      if (response.ok) {
        message.success('Tutor created successfully');
        setCreateModalVisible(false);
        form.resetFields();
        fetchTutors();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to create tutor');
      }
    } catch (error) {
      message.error('Failed to create tutor');
    }
  };

  const handleEdit = (record: any) => {
    setSelectedTutor(record);
    editForm.setFieldsValue({
      ...record,
      subjectId: record.subject?.id,
      countryId: record.country?.id,
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async (values: any) => {
    try {
      const response = await fetch(`/api/tutors/${selectedTutor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Tutor updated successfully');
        setEditModalVisible(false);
        editForm.resetFields();
        fetchTutors();
      } else {
        message.error('Failed to update tutor');
      }
    } catch (error) {
      message.error('Failed to update tutor');
    }
  };

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: 'Delete Tutor',
      content: `Are you sure you want to delete ${record.firstName} ${record.lastName}?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      async onOk() {
        try {
          const response = await fetch(`/api/tutors/${record.id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            message.success('Tutor deleted successfully');
            fetchTutors();
          } else {
            message.error('Failed to delete tutor');
          }
        } catch (error) {
          message.error('Failed to delete tutor');
        }
      },
    });
  };

  const handleVerify = async (tutorId: number, isVerified: boolean) => {
    try {
      const response = await fetch(`/api/tutors/${tutorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !isVerified }),
      });

      if (response.ok) {
        message.success(`Tutor ${!isVerified ? 'verified' : 'unverified'} successfully`);
        fetchTutors();
      }
    } catch (error) {
      message.error('Failed to update verification status');
    }
  };

  const handleToggleActive = async (tutorId: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/tutors/${tutorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        message.success(`Tutor ${!isActive ? 'activated' : 'deactivated'} successfully`);
        fetchTutors();
      }
    } catch (error) {
      message.error('Failed to update active status');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (_: any, record: any) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Subject',
      dataIndex: ['subject', 'name'],
      key: 'subject',
    },
    {
      title: 'Country',
      dataIndex: ['country', 'name'],
      key: 'country',
    },
    {
      title: 'Hourly Rate',
      dataIndex: 'hourlyRate',
      key: 'hourlyRate',
      render: (rate: string) => `$${rate}/hr`,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: string, record: any) => `${rating} (${record.totalReviews})`,
    },
    {
      title: 'Lessons',
      dataIndex: 'totalLessons',
      key: 'totalLessons',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: any) => (
        <Space>
          <Tag color={record.isVerified ? 'green' : 'orange'}>
            {record.isVerified ? 'Verified' : 'Pending'}
          </Tag>
          <Tag color={record.isActive ? 'blue' : 'red'}>
            {record.isActive ? 'Active' : 'Inactive'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            type={record.isVerified ? 'default' : 'primary'}
            icon={record.isVerified ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleVerify(record.id, record.isVerified)}
          >
            {record.isVerified ? 'Unverify' : 'Verify'}
          </Button>
          <Button
            size="small"
            onClick={() => handleToggleActive(record.id, record.isActive)}
          >
            {record.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout
      role="admin"
      user={{ name: 'Admin User', email: 'admin@example.com' }}
    >
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h1>Tutor Management</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Add Tutor
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tutors}
          rowKey="id"
          loading={loading}
        />

        {/* Create Modal */}
        <Modal
          title="Create New Tutor"
          open={createModalVisible}
          onCancel={() => {
            setCreateModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form form={form} layout="vertical" onFinish={handleCreate}>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="subjectId" label="Subject" rules={[{ required: true }]}>
              <Select>
                {subjects.map((subject) => (
                  <Select.Option key={subject.id} value={subject.id}>
                    {subject.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="countryId" label="Country" rules={[{ required: true }]}>
              <Select>
                {countries.map((country) => (
                  <Select.Option key={country.id} value={country.id}>
                    {country.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="specialization" label="Specialization" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Conversational">Conversational</Select.Option>
                <Select.Option value="Business">Business</Select.Option>
                <Select.Option value="Test Preparation">Test Preparation</Select.Option>
                <Select.Option value="Academic">Academic</Select.Option>
                <Select.Option value="Kids & Teens">Kids & Teens</Select.Option>
                <Select.Option value="Job Interview">Job Interview</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="level" label="Level" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Beginner">Beginner</Select.Option>
                <Select.Option value="Intermediate">Intermediate</Select.Option>
                <Select.Option value="Advanced">Advanced</Select.Option>
                <Select.Option value="Native">Native</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="hourlyRate" label="Hourly Rate ($)" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="yearsExperience" label="Years of Experience" initialValue={0}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="bio" label="Bio" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="teachingStyle" label="Teaching Style">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="avatar" label="Avatar URL">
              <Input />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Create Tutor
                </Button>
                <Button onClick={() => setCreateModalVisible(false)}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Modal */}
        <Modal
          title="Edit Tutor"
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            editForm.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="subjectId" label="Subject" rules={[{ required: true }]}>
              <Select>
                {subjects.map((subject) => (
                  <Select.Option key={subject.id} value={subject.id}>
                    {subject.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="countryId" label="Country" rules={[{ required: true }]}>
              <Select>
                {countries.map((country) => (
                  <Select.Option key={country.id} value={country.id}>
                    {country.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="specialization" label="Specialization" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Conversational">Conversational</Select.Option>
                <Select.Option value="Business">Business</Select.Option>
                <Select.Option value="Test Preparation">Test Preparation</Select.Option>
                <Select.Option value="Academic">Academic</Select.Option>
                <Select.Option value="Kids & Teens">Kids & Teens</Select.Option>
                <Select.Option value="Job Interview">Job Interview</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="level" label="Level" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Beginner">Beginner</Select.Option>
                <Select.Option value="Intermediate">Intermediate</Select.Option>
                <Select.Option value="Advanced">Advanced</Select.Option>
                <Select.Option value="Native">Native</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="hourlyRate" label="Hourly Rate ($)" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="yearsExperience" label="Years of Experience">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="bio" label="Bio" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="teachingStyle" label="Teaching Style">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="avatar" label="Avatar URL">
              <Input />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Update Tutor
                </Button>
                <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
