'use client';

import { Card, Avatar, Tag, Typography, Space, Button, Rate } from 'antd';
import { StarFilled, VideoCameraOutlined, CheckCircleFilled } from '@ant-design/icons';
import Link from 'next/link';
import { TutorWithDetails } from '@/lib/types';

const { Text, Paragraph } = Typography;

interface TutorCardProps {
  tutor: TutorWithDetails;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const languages = tutor.spokenLanguages ? JSON.parse(tutor.spokenLanguages) : [];
  const rating = tutor.rating ? parseFloat(tutor.rating) : 0;

  return (
    <Link href={`/tutors/${tutor.slug}`} style={{ textDecoration: 'none' }}>
      <Card
        hoverable
        style={{ marginBottom: 16 }}
        styles={{ body: { padding: '20px' } }}
      >
        <div style={{ display: 'flex', gap: 16 }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Avatar
              size={80}
              src={tutor.avatar}
              alt={`${tutor.firstName} ${tutor.lastName}`}
            />
            {tutor.country.flag && (
              <div style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                fontSize: 24,
                lineHeight: 1,
              }}>
                {tutor.country.flag}
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <Space size={4} align="center">
                  <Text strong style={{ fontSize: 16 }}>
                    {tutor.firstName} {tutor.lastName}
                  </Text>
                  {tutor.isVerified && (
                    <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />
                  )}
                </Space>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {tutor.subject.name} Tutor from {tutor.country.name}
                  </Text>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                  ${tutor.hourlyRate}
                </Text>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>per hour</Text>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div style={{ marginBottom: 8 }}>
              <Space size={4} align="center">
                <Rate disabled defaultValue={rating} allowHalf style={{ fontSize: 14 }} />
                <Text strong>{rating.toFixed(2)}</Text>
                <Text type="secondary" style={{ fontSize: 13 }}>({tutor.totalReviews} reviews)</Text>
                <Text type="secondary" style={{ fontSize: 13 }}>• {tutor.totalLessons} lessons
                </Text>
              </Space>
            </div>

            {/* Bio */}
            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{ marginBottom: 12, fontSize: 14, color: '#666' }}
            >
              {tutor.bio}
            </Paragraph>

            {/* Tags */}
            <Space size={[0, 8]} wrap style={{ marginBottom: 12 }}>
              <Tag color="blue">{tutor.specialization}</Tag>
              <Tag>{tutor.level}</Tag>
              <Tag>{tutor.yearsExperience}+ years exp.</Tag>
              {languages.slice(0, 2).map((lang: string, idx: number) => (
                <Tag key={idx}>{lang}</Tag>
              ))}
            </Space>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="primary" size="small">
                Book Trial Lesson
              </Button>
              <Button size="small">
                Message
              </Button>
              {tutor.videoIntro && (
                <Button size="small" icon={<VideoCameraOutlined />}>
                  Watch Video
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
