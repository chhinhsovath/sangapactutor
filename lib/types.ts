import { z } from 'zod';

export const TutorFiltersSchema = z.object({
  subject: z.string().optional(),
  country: z.string().optional(),
  specialization: z.string().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
});

export type TutorFilters = z.infer<typeof TutorFiltersSchema>;

export interface TutorWithDetails {
  id: number;
  firstName: string;
  lastName: string;
  slug: string;
  avatar: string | null;
  subject: {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
  };
  country: {
    id: number;
    name: string;
    code: string;
    flag: string | null;
  };
  specialization: string;
  level: string;
  hourlyRate: string;
  rating: string | null;
  totalReviews: number | null;
  totalLessons: number | null;
  yearsExperience: number | null;
  bio: string;
  teachingStyle: string | null;
  spokenLanguages: string | null;
  videoIntro: string | null;
  availability: string | null;
  isVerified: boolean | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
