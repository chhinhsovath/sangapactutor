'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message as antMessage, Space, Popconfirm, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CountriesPage() {
  const { t } = useLanguage();
  const { message } = App.useApp();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCountry, setEditingCountry] = useState<any>(null);
  const [form] = Form.useForm();

  const user = {
    name: 'Admin User',
    email: 'admin@tutorhub.com',
    avatar: 'https://i.pravatar.cc/150?img=0',
    role: 'admin' as const,
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/countries');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      message.error(t('admin.countriesPage.failedToFetch'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCountry(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (country: any) => {
    setEditingCountry(country);
    form.setFieldsValue(country);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/countries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        message.success(t('admin.countriesPage.countryDeleted'));
        fetchCountries();
      } else {
        const error = await response.json();
        message.error(error.error || t('admin.countriesPage.failedToDelete'));
      }
    } catch (error) {
      message.error(t('admin.countriesPage.failedToDelete'));
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = editingCountry
        ? `/api/countries/${editingCountry.id}`
        : '/api/countries';
      
      const response = await fetch(url, {
        method: editingCountry ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(editingCountry ? t('admin.countriesPage.countryUpdated') : t('admin.countriesPage.countryCreated'));
        setModalVisible(false);
        form.resetFields();
        fetchCountries();
      } else {
        const error = await response.json();
        message.error(error.error || t('admin.countriesPage.failedToSave'));
      }
    } catch (error) {
      message.error(t('admin.countriesPage.failedToSave'));
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
      title: t('admin.commonTable.code'),
      dataIndex: 'code',
      key: 'code',
      width: 100,
    },
    {
      title: t('admin.commonTable.flag'),
      dataIndex: 'flag',
      key: 'flag',
      width: 80,
      render: (flag: string) => <span style={{ fontSize: 24 }}>{flag}</span>,
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
            title={t('admin.countriesPage.deleteCountry')}
            description={t('admin.countriesPage.deleteConfirm')}
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
          title={t('admin.countriesPage.title')}
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              {t('admin.countriesPage.addCountry')}
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={countries}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>

        <Modal
          title={editingCountry ? t('admin.countriesPage.editCountry') : t('admin.countriesPage.createCountry')}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          okText={editingCountry ? t('common.update') : t('common.create')}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="nameKh"
              label={`${t('admin.countriesPage.countryName')} (ខ្មែរ)`}
              rules={[{ required: true, message: t('admin.countriesPage.pleaseEnterName') }]}
            >
              <Input placeholder="កម្ពុជា" />
            </Form.Item>

            <Form.Item
              name="nameEn"
              label={`${t('admin.countriesPage.countryName')} (English)`}
              rules={[{ required: true, message: t('admin.countriesPage.pleaseEnterName') }]}
            >
              <Input placeholder="Cambodia" />
            </Form.Item>

            <Form.Item
              name="code"
              label={t('admin.countriesPage.countryCode')}
              rules={[
                { required: true, message: t('admin.countriesPage.pleaseEnterCode') },
                { len: 2, message: t('admin.countriesPage.codeMustBe2') }
              ]}
              extra={t('admin.countriesPage.codeExtra')}
            >
              <Input placeholder={t('admin.countriesPage.codePlaceholder')} maxLength={2} style={{ textTransform: 'uppercase' }} />
            </Form.Item>

            <Form.Item
              name="flag"
              label={t('admin.countriesPage.flag')}
              extra={t('admin.countriesPage.flagExtra')}
            >
              <Input placeholder="🇺🇸" />
            </Form.Item>
          </Form>
        </Modal>
      </DashboardLayout>
    </App>
  );
}
