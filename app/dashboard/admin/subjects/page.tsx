'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message as antMessage, Space, Popconfirm, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SubjectsPage() {
  const { t } = useLanguage();
  const { message } = App.useApp();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [form] = Form.useForm();

  const user = {
    name: 'Admin User',
    email: 'admin@tutorhub.com',
    avatar: 'https://i.pravatar.cc/150?img=0',
    role: 'admin' as const,
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/subjects');
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      message.error(t('admin.subjectsPage.failedToFetch'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSubject(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (subject: any) => {
    setEditingSubject(subject);
    form.setFieldsValue(subject);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        message.success(t('admin.subjectsPage.subjectDeleted'));
        fetchSubjects();
      } else {
        const error = await response.json();
        message.error(error.error || t('admin.subjectsPage.failedToDelete'));
      }
    } catch (error) {
      message.error(t('admin.subjectsPage.failedToDelete'));
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = editingSubject
        ? `/api/subjects/${editingSubject.id}`
        : '/api/subjects';
      
      const response = await fetch(url, {
        method: editingSubject ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(editingSubject ? t('admin.subjectsPage.subjectUpdated') : t('admin.subjectsPage.subjectCreated'));
        setModalVisible(false);
        form.resetFields();
        fetchSubjects();
      } else {
        const error = await response.json();
        message.error(error.error || t('admin.subjectsPage.failedToSave'));
      }
    } catch (error) {
      message.error(t('admin.subjectsPage.failedToSave'));
    }
  };

  const columns = [
    {
      title: t('admin.commonTable.id'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: t('admin.commonTable.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('admin.subjectsPage.slug'),
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: t('admin.commonTable.icon'),
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      render: (icon: string) => <span style={{ fontSize: 24 }}>{icon}</span>,
    },
    {
      title: t('admin.commonTable.actions'),
      key: 'actions',
      width: 150,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('admin.commonTable.edit')}
          </Button>
          <Popconfirm
            title={t('admin.subjectsPage.deleteSubject')}
            description={t('admin.subjectsPage.deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              {t('admin.commonTable.delete')}
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
          title={t('admin.subjectsPage.title')}
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              {t('admin.subjectsPage.addSubject')}
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={subjects}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>

        <Modal
          title={editingSubject ? t('admin.subjectsPage.editSubject') : t('admin.subjectsPage.createSubject')}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          okText={editingSubject ? t('common.update') : t('common.create')}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="nameKh"
              label={`${t('admin.subjectsPage.subjectName')} (ខ្មែរ)`}
              rules={[{ required: true, message: t('admin.subjectsPage.pleaseEnterName') }]}
            >
              <Input placeholder="គណិតវិទ្យា" />
            </Form.Item>

            <Form.Item
              name="nameEn"
              label={`${t('admin.subjectsPage.subjectName')} (English)`}
              rules={[{ required: true, message: t('admin.subjectsPage.pleaseEnterName') }]}
            >
              <Input placeholder="Mathematics" />
            </Form.Item>

            <Form.Item
              name="slug"
              label={t('admin.subjectsPage.slug')}
              rules={[{ required: true, message: t('admin.subjectsPage.pleaseEnterSlug') }]}
              extra={t('admin.subjectsPage.slugExtra')}
            >
              <Input placeholder={t('admin.subjectsPage.slugPlaceholder')} />
            </Form.Item>

            <Form.Item
              name="icon"
              label={t('admin.subjectsPage.icon')}
              extra={t('admin.subjectsPage.iconExtra')}
            >
              <Input placeholder="🇬🇧" />
            </Form.Item>
          </Form>
        </Modal>
      </DashboardLayout>
    </App>
  );
}
