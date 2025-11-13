'use client';

import { Card, Row, Col, Typography, Button, Space } from 'antd';
import { UserOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function DashboardHomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px',
    }}>
      <div style={{ maxWidth: 1200, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Title style={{ color: 'white', fontSize: 48, marginBottom: 16 }}>
            TutorHub Dashboard
          </Title>
          <Paragraph style={{ color: 'white', fontSize: 18, opacity: 0.9 }}>
            Select your role to access your dashboard
          </Paragraph>
        </div>

        <Row gutter={[24, 24]} justify="center">
          {/* Student Dashboard */}
          <Col xs={24} md={8}>
            <Link href="/dashboard/student" style={{ textDecoration: 'none' }}>
              <Card
                hoverable
                style={{
                  textAlign: 'center',
                  height: 350,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{
                  fontSize: 80,
                  marginBottom: 24,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  🎓
                </div>
                <Title level={2}>Student Portal</Title>
                <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                  Access your lessons, find tutors, track progress, and manage your learning journey
                </Paragraph>
                <Space direction="vertical" size="small">
                  <div>✓ Find & book tutors</div>
                  <div>✓ Manage lessons</div>
                  <div>✓ Track progress</div>
                  <div>✓ Message tutors</div>
                </Space>
              </Card>
            </Link>
          </Col>

          {/* Tutor Dashboard */}
          <Col xs={24} md={8}>
            <Link href="/dashboard/tutor" style={{ textDecoration: 'none' }}>
              <Card
                hoverable
                style={{
                  textAlign: 'center',
                  height: 350,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{
                  fontSize: 80,
                  marginBottom: 24,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  👨‍🏫
                </div>
                <Title level={2}>Tutor Portal</Title>
                <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                  Manage your schedule, track students, view earnings, and grow your teaching business
                </Paragraph>
                <Space direction="vertical" size="small">
                  <div>✓ Manage schedule</div>
                  <div>✓ Track students</div>
                  <div>✓ View earnings</div>
                  <div>✓ Manage reviews</div>
                </Space>
              </Card>
            </Link>
          </Col>

          {/* Admin Dashboard */}
          <Col xs={24} md={8}>
            <Link href="/dashboard/admin" style={{ textDecoration: 'none' }}>
              <Card
                hoverable
                style={{
                  textAlign: 'center',
                  height: 350,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{
                  fontSize: 80,
                  marginBottom: 24,
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  ⚙️
                </div>
                <Title level={2}>Admin Panel</Title>
                <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                  Monitor platform, manage users, approve tutors, and analyze business metrics
                </Paragraph>
                <Space direction="vertical" size="small">
                  <div>✓ Manage users</div>
                  <div>✓ Approve tutors</div>
                  <div>✓ View analytics</div>
                  <div>✓ Platform settings</div>
                </Space>
              </Card>
            </Link>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/">
            <Button size="large" type="default" style={{ background: 'white' }}>
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
