'use client';

import { Typography, Empty, Row, Col } from 'antd';
import TutorCard from './JobCard';
import { TutorWithDetails } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

const { Title, Text } = Typography;

interface TutorListProps {
  tutors: TutorWithDetails[];
}

export default function TutorList({ tutors }: TutorListProps) {
  const { t } = useLanguage();
  
  if (tutors.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Empty description="No tutors found matching your filters" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary" style={{ fontSize: 14 }}>
          {tutors.length} {t('home.tutorsAvailable')}
        </Text>
      </div>
      
      <Row gutter={[0, 0]}>
        <Col span={24}>
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </Col>
      </Row>
    </div>
  );
}
