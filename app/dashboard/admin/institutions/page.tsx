'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message as antMessage, Space, Popconfirm, App, Select, Switch, Tag, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BankOutlined, TeamOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const { TextArea } = Input;

interface Institution {
  id: number;
  name: string;
  nameKh?: string;
  nameEn?: string;
  slug: string;
  type: string;
  logo?: string;
  description?: string;
  descriptionKh?: string;
  descriptionEn?: string;
  address?: string;
  city?: string;
  countryId?: number;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  creditRequirementMin?: number;
  creditRequirementMax?: number;
  creditValuePerSession?: string;
  academicYearStart?: string;
  academicYearEnd?: string;
  allowCrossInstitution?: boolean;
  requireApproval?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function InstitutionsPage() {
  const { t } = useLanguage();
  const { message } = App.useApp();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);
  const [form] = Form.useForm();

  const user = {
    name: 'Admin User',
    email: 'admin@tutorhub.com',
    avatar: 'https://i.pravatar.cc/150?img=0',
    role: 'admin' as const,
  };

  useEffect(() => {
    fetchInstitutions();
    fetchCountries();
  }, []);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/institutions');
      const data = await response.json();
      setInstitutions(data);
    } catch (error) {
      message.error('Failed to fetch institutions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/countries');
      const data = await response.json();
      setCountries(data.map((c: any) => ({ label: c.nameEn || c.name, value: c.id })));
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };

  const handleCreate = () => {
    setEditingInstitution(null);
    form.resetFields();
    // Set default values
    form.setFieldsValue({
      creditRequirementMin: 3,
      creditRequirementMax: 6,
      creditValuePerSession: '0.5',
      allowCrossInstitution: true,
      requireApproval: true,
      isActive: true,
    });
    setModalVisible(true);
  };

  const handleEdit = (institution: Institution) => {
    setEditingInstitution(institution);
    form.setFieldsValue(institution);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/institutions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        message.success('Institution deactivated successfully');
        fetchInstitutions();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to delete institution');
      }
    } catch (error) {
      message.error('Failed to delete institution');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // Generate slug from name if not provided
      if (!values.slug) {
        values.slug = values.nameEn?.toLowerCase().replace(/\s+/g, '-') || values.name?.toLowerCase().replace(/\s+/g, '-');
      }

      // Set name field as fallback
      values.name = values.nameEn || values.nameKh || values.name;

      const url = editingInstitution
        ? `/api/institutions/${editingInstitution.id}`
        : '/api/institutions';
      
      const response = await fetch(url, {
        method: editingInstitution ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(editingInstitution ? 'Institution updated successfully' : 'Institution created successfully');
        setModalVisible(false);
        form.resetFields();
        fetchInstitutions();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to save institution');
      }
    } catch (error) {
      message.error('Failed to save institution');
    }
  };

  const institutionTypes = [
    { label: 'University', value: 'university' },
    { label: 'College', value: 'college' },
    { label: 'High School', value: 'high_school' },
    { label: 'Training Center', value: 'training_center' },
    { label: 'Other', value: 'other' },
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Institution',
      key: 'institution',
      render: (_: any, record: Institution) => (
        <Space>
          {record.logo ? (
            <Avatar src={record.logo} size={40} />
          ) : (
            <Avatar icon={<BankOutlined />} size={40} style={{ backgroundColor: '#1890ff' }} />
          )}
          <div>
            <div style={{ fontWeight: 500 }}>{record.nameEn || record.name}</div>
            {record.nameKh && <div style={{ fontSize: 12, color: '#999' }}>{record.nameKh}</div>}
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string) => (
        <Tag color="blue">{type.replace('_', ' ').toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Location',
      key: 'location',
      render: (_: any, record: Institution) => (
        <div>
          {record.city && <div>{record.city}</div>}
        </div>
      ),
      width: 150,
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_: any, record: Institution) => (
        <div style={{ fontSize: 12 }}>
          {record.contactEmail && <div>{record.contactEmail}</div>}
          {record.contactPhone && <div>{record.contactPhone}</div>}
        </div>
      ),
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={isActive ? 'success' : 'default'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Institution) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Deactivate Institution?"
            description="This will deactivate the institution and its partnerships."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <App>
      <DashboardLayout role="admin" user={user}>
        <Card
          title={
            <Space>
              <BankOutlined style={{ fontSize: 20 }} />
              <span>{t('admin.institutionsPage.title')}</span>
            </Space>
          }
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              {t('admin.institutionsPage.addInstitution')}
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={institutions}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} institutions` }}
          />
        </Card>

        <Modal
          title={editingInstitution ? t('admin.institutionsPage.editInstitution') : t('admin.institutionsPage.createInstitution')}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          okText={editingInstitution ? t('common.update') : t('common.create')}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="nameKh"
              label="Institution Name (Khmer)"
            >
              <Input placeholder="ឧទាហរណ៍៖ សាកលវិទ្យាល័យភ្នំពេញ" />
            </Form.Item>

            <Form.Item
              name="nameEn"
              label="Institution Name (English)"
              rules={[{ required: true, message: 'Please enter institution name in English' }]}
            >
              <Input placeholder="e.g., Phnom Penh University" />
            </Form.Item>

            <Form.Item
              name="slug"
              label="Slug (URL-friendly identifier)"
              extra="Leave blank to auto-generate from English name"
            >
              <Input placeholder="e.g., phnom-penh-university" />
            </Form.Item>

            <Form.Item
              name="type"
              label="Institution Type"
              rules={[{ required: true, message: 'Please select institution type' }]}
            >
              <Select options={institutionTypes} placeholder="Select type" />
            </Form.Item>

            <Form.Item
              name="logo"
              label="Logo URL"
            >
              <Input placeholder="https://example.com/logo.png" />
            </Form.Item>

            <Form.Item
              name="descriptionKh"
              label="Description (Khmer)"
            >
              <TextArea rows={3} placeholder="ពិពណ៌នាអំពីស្ថាប័ន" />
            </Form.Item>

            <Form.Item
              name="descriptionEn"
              label="Description (English)"
            >
              <TextArea rows={3} placeholder="Description of the institution" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
            >
              <TextArea rows={2} placeholder="Full address" />
            </Form.Item>

            <Form.Item
              name="city"
              label="City"
            >
              <Input placeholder="e.g., Phnom Penh" />
            </Form.Item>

            <Form.Item
              name="countryId"
              label="Country"
            >
              <Select options={countries} placeholder="Select country" showSearch />
            </Form.Item>

            <Form.Item
              name="contactEmail"
              label="Contact Email"
              rules={[{ type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input placeholder="contact@institution.edu" />
            </Form.Item>

            <Form.Item
              name="contactPhone"
              label="Contact Phone"
            >
              <Input placeholder="+855 12 345 678" />
            </Form.Item>

            <Form.Item
              name="website"
              label="Website"
            >
              <Input placeholder="https://institution.edu" />
            </Form.Item>

            <div style={{ background: '#f5f5f5', padding: 16, marginBottom: 16, borderRadius: 4 }}>
              <h4>Credit System Settings</h4>
              
              <Space style={{ width: '100%' }} size="large">
                <Form.Item
                  name="creditRequirementMin"
                  label="Min Sessions/Year"
                  style={{ marginBottom: 0 }}
                >
                  <Input type="number" min={1} placeholder="3" style={{ width: 120 }} />
                </Form.Item>

                <Form.Item
                  name="creditRequirementMax"
                  label="Max Sessions/Year"
                  style={{ marginBottom: 0 }}
                >
                  <Input type="number" min={1} placeholder="6" style={{ width: 120 }} />
                </Form.Item>

                <Form.Item
                  name="creditValuePerSession"
                  label="Credits per Session"
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="0.5" style={{ width: 120 }} />
                </Form.Item>
              </Space>

              <Space style={{ width: '100%', marginTop: 16 }} size="large">
                <Form.Item
                  name="academicYearStart"
                  label="Academic Year Start"
                  style={{ marginBottom: 0 }}
                  extra="Format: MM-DD"
                >
                  <Input placeholder="09-01" style={{ width: 120 }} />
                </Form.Item>

                <Form.Item
                  name="academicYearEnd"
                  label="Academic Year End"
                  style={{ marginBottom: 0 }}
                  extra="Format: MM-DD"
                >
                  <Input placeholder="06-30" style={{ width: 120 }} />
                </Form.Item>
              </Space>
            </div>

            <Form.Item
              name="allowCrossInstitution"
              label="Allow Cross-Institution Tutoring"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="requireApproval"
              label="Require Faculty Approval for Credits"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="isActive"
              label="Active Status"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </DashboardLayout>
    </App>
  );
}
