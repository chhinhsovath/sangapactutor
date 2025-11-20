/**
 * API Configuration
 * Reads from environment variables
 *
 * IMPORTANT: The mobile API routes must be deployed separately or alongside the web platform.
 * Currently available at: http://host.docker.internal:3000/api/mobile (local dev)
 * Production URL needs to be configured once the backend API is deployed.
 */

export const API_BASE_URL = process.env.API_BASE_URL || 'http://host.docker.internal:3000/api/mobile';
export const NODE_ENV = process.env.NODE_ENV || 'development';

// API Endpoints reference
export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_ME: '/auth/me',
  AUTH_REFRESH: '/auth/refresh',
  TUTORS: '/tutors',
  SUBJECTS: '/subjects',
  COUNTRIES: '/countries',
  BOOKINGS: '/bookings',
  MESSAGES: '/messages',
} as const;
