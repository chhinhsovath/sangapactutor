'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Modal, App, Statistic, Row, Col, Descriptions } from 'antd';
import { CreditCardOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminCreditsPage() {
  const { t } = useLanguage();
  const { message } = App.useApp();
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [approvalType, setApprovalType] = useState<'approve' | 'reject'>('approve');

  const user = {
    name: 'Admin User',
    email: 'admin@tutorhub.com',
    avatar: 'https://i.pravatar.cc/150?img=0',
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/credits');
      const data = await response.json();
      setCredits(data);
    } catch (error) {
      message.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record: any) => {
    setSelectedCredit(record);
    setDetailsModalVisible(true);
  };

  const handleApprove = async (record: any) => {
    setSelectedCredit(record);
    setApprovalType('approve');
    setApprovalModalVisible(true);
  };

  const handleReject = async (record: any) => {
    setSelectedCredit(record);
    setApprovalType('reject');
    setApprovalModalVisible(true);
  };

  const handleApprovalSubmit = async () => {
    try {
      const response = await fetch(`/api/credits/${selectedCredit.id}/${approvalType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: '' }),
      });

      if (response.ok) {
        message.success(approvalType === 'approve' ? t('admin.creditsPage.creditApproved') : t('admin.creditsPage.creditRejected'));
        setApprovalModalVisible(false);
        fetchCredits();
      } else {
        message.error(t('errors.updateFailed'));
      }
    } catch (error) {
      message.error(t('errors.updateFailed'));
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap: any = {
      pending: { color: 'orange', text: t('admin.creditsPage.pending') },
      approved: { color: 'green', text: t('admin.creditsPage.approved') },
      rejected: { color: 'red', text: t('admin.creditsPage.rejected') },
      credited: { color: 'blue', text: t('admin.creditsPage.credited') },
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: t('admin.commonTable.id'),
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: t('admin.creditsPage.student'),
      key: 'student',
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.user?.firstName} {record.user?.lastName}
          </div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.user?.email}</div>
        </div>
      ),
    },
    {
      title: t('admin.creditsPage.institution'),
      key: 'institution',
      render: (_: any, record: any) => record.institution?.name || '-',
    },
    {
      title: t('admin.creditsPage.credits'),
      dataIndex: 'creditsEarned',
      key: 'creditsEarned',
      width: 100,
      render: (credits: string) => <strong>{credits}</strong>,
    },
    {
      title: t('admin.creditsPage.academicYear'),
      dataIndex: 'academicYear',
      key: 'academicYear',
      width: 120,
    },
    {
      title: t('admin.creditsPage.status'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: getStatusTag,
    },
    {
      title: t('admin.creditsPage.submittedDate'),
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      width: 130,
    },
    {
      title: t('admin.commonTable.actions'),
      key: 'actions',
      width: 200,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            {t('admin.creditsPage.viewDetails')}
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record)}
                style={{ color: 'green' }}
              >
                {t('admin.creditsPage.approve')}
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(record)}
              >
                {t('admin.creditsPage.reject')}
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const stats = credits.reduce(
    (acc, credit) => {
      if (credit.status === 'pending') acc.pending++;
      if (credit.status === 'approved') acc.approved++;
      if (credit.status === 'rejected') acc.rejected++;
      acc.total += parseFloat(credit.creditsEarned || 0);
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0, total: 0 }
  );

  return (
    <App>
      <DashboardLayout role="admin" user={user}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title={t('admin.creditsPage.totalPending')}
                value={stats.pending}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title={t('admin.creditsPage.totalApproved')}
                value={stats.approved}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title={t('admin.creditsPage.totalRejected')}
                value={stats.rejected}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title={t('admin.creditsPage.totalCredits')}
                value={stats.total.toFixed(2)}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        <Card
          title={
            <Space>
              <CreditCardOutlined style={{ fontSize: 20 }} />
              <span>{t('admin.creditsPage.title')}</span>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={credits}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `${t('admin.creditsPage.totalCredits')}: ${total}` }}
          />
        </Card>

        {/* Details Modal */}
        <Modal
          title={t('admin.creditsPage.creditDetails')}
          open={detailsModalVisible}
          onCancel={() => setDetailsModalVisible(false)}
          footer={null}
          width={700}
        >
          {selectedCredit && (
            <Descriptions bordered column={2}>
              <Descriptions.Item label={t('admin.creditsPage.student')} span={2}>
                {selectedCredit.user?.firstName} {selectedCredit.user?.lastName} ({selectedCredit.user?.email})
              </Descriptions.Item>
              <Descriptions.Item label={t('admin.creditsPage.institution')} span={2}>
                {selectedCredit.institution?.name}
              </Descriptions.Item>
              <Descriptions.Item label={t('admin.creditsPage.creditValue')}>
                {selectedCredit.creditsEarned}
              </Descriptions.Item>
              <Descriptions.Item label={t('admin.creditsPage.academicYear')}>
                {selectedCredit.academicYear}
              </Descriptions.Item>
              <Descriptions.Item label={t('admin.creditsPage.status')}>
                {getStatusTag(selectedCredit.status)}
              </Descriptions.Item>
              <Descriptions.Item label={t('admin.creditsPage.submittedDate')}>
                {new Date(selectedCredit.submittedAt).toLocaleString()}
              </Descriptions.Item>
              {selectedCredit.reviewedBy && (
                <>
                  <Descriptions.Item label={t('admin.creditsPage.reviewedBy')} span={2}>
                    User ID: {selectedCredit.reviewedBy}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('admin.creditsPage.approvalNotes')} span={2}>
                    {selectedCredit.reviewNotes || '-'}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          )}
        </Modal>

        {/* Approval/Reject Modal */}
        <Modal
          title={approvalType === 'approve' ? t('admin.creditsPage.approveCredit') : t('admin.creditsPage.rejectCredit')}
          open={approvalModalVisible}
          onCancel={() => setApprovalModalVisible(false)}
          onOk={handleApprovalSubmit}
          okText={approvalType === 'approve' ? t('admin.creditsPage.approve') : t('admin.creditsPage.reject')}
          okButtonProps={{ danger: approvalType === 'reject' }}
        >
          <p>
            {approvalType === 'approve'
              ? `តើអ្នកប្រាកដថាចង់អនុម័តក្រេឌីតនេះសម្រាប់ ${selectedCredit?.user?.firstName} ${selectedCredit?.user?.lastName}? / Are you sure you want to approve this credit for ${selectedCredit?.user?.firstName} ${selectedCredit?.user?.lastName}?`
              : `តើអ្នកប្រាកដថាចង់បដិសេធក្រេឌីតនេះសម្រាប់ ${selectedCredit?.user?.firstName} ${selectedCredit?.user?.lastName}? / Are you sure you want to reject this credit for ${selectedCredit?.user?.firstName} ${selectedCredit?.user?.lastName}?`}
          </p>
        </Modal>
      </DashboardLayout>
    </App>
  );
}
