'use client';

import { useState, useEffect } from 'react';
import { Layout, Typography, Space, Tag, Button, Divider, Spin, Card } from 'antd';
import { ArrowLeftOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { JobWithDetails } from '@/lib/types';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function JobDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [job, setJob] = useState<JobWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetch(`/api/jobs/${slug}`)
        .then(r => r.json())
        .then(data => {
          setJob(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug]);

  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Company';
  const companyWebsite = process.env.NEXT_PUBLIC_COMPANY_WEBSITE || '#';

  const formatSalary = () => {
    if (!job?.salaryMin || !job?.salaryMax) return null;
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    if (job.salaryPeriod === 'hour') {
      return `$${job.salaryMin}-${job.salaryMax}/hour`;
    }
    
    return `${formatter.format(job.salaryMin)}-${formatter.format(job.salaryMax)}/year`;
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <div style={{ textAlign: 'center', padding: '120px 20px' }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Content style={{ padding: '48px' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>Job not found</Title>
            <Link href="/">
              <Button type="primary" icon={<ArrowLeftOutlined />}>
                Back to Jobs
              </Button>
            </Link>
          </div>
        </Content>
      </Layout>
    );
  }

  const workArrangementColor = {
    'On-site': 'blue',
    'Remote': 'green',
    'Hybrid': 'purple',
  }[job.workArrangement] || 'default';

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header style={{ background: '#fff', padding: '0 48px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Link href={companyWebsite} target="_blank" style={{ textDecoration: 'none' }}>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              {companyName}
            </Title>
          </Link>
        </div>
      </Header>

      <Content style={{ padding: '48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link href="/">
            <Button type="link" icon={<ArrowLeftOutlined />} style={{ padding: 0, marginBottom: 24 }}>
              Back to all jobs
            </Button>
          </Link>

          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={1} style={{ marginBottom: 16 }}>
                  {job.title}
                </Title>
                
                <Space size={[0, 8]} wrap>
                  <Tag color="default">{job.department.name}</Tag>
                  <Tag color={workArrangementColor}>{job.workArrangement}</Tag>
                  <Tag>{job.employmentType}</Tag>
                </Space>
              </div>

              <Space direction="vertical" size={8}>
                <Space>
                  <EnvironmentOutlined />
                  <Text strong>{job.location.name}</Text>
                </Space>
                
                {formatSalary() && (
                  <Space>
                    <DollarOutlined />
                    <Text strong>{formatSalary()}</Text>
                  </Space>
                )}
              </Space>

              <Divider />

              <div>
                <Title level={3}>About the Role</Title>
                <Paragraph style={{ fontSize: 16, whiteSpace: 'pre-wrap' }}>
                  {job.description}
                </Paragraph>
              </div>

              {job.responsibilities && (
                <div>
                  <Title level={3}>Responsibilities</Title>
                  <Paragraph style={{ fontSize: 16, whiteSpace: 'pre-wrap' }}>
                    {job.responsibilities}
                  </Paragraph>
                </div>
              )}

              {job.requirements && (
                <div>
                  <Title level={3}>Requirements</Title>
                  <Paragraph style={{ fontSize: 16, whiteSpace: 'pre-wrap' }}>
                    {job.requirements}
                  </Paragraph>
                </div>
              )}

              {job.benefits && (
                <div>
                  <Title level={3}>Benefits</Title>
                  <Paragraph style={{ fontSize: 16, whiteSpace: 'pre-wrap' }}>
                    {job.benefits}
                  </Paragraph>
                </div>
              )}

              <Divider />

              <Button type="primary" size="large" block>
                Apply for this position
              </Button>
            </Space>
          </Card>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        <Space split="·">
          <Text type="secondary">Powered by {companyName}</Text>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/security">Security</Link>
        </Space>
      </Footer>
    </Layout>
  );
}
