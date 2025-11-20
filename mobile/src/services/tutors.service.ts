import api from './api';
import { Tutor, TutorFilters } from '../types';

export const tutorsService = {
    // Get all tutors with filters
    async getTutors(filters?: TutorFilters): Promise<Tutor[]> {
        const response = await api.get<Tutor[]>('/tutors', { params: filters });
        return response.data;
    },

    // Get single tutor by ID
    async getTutorById(id: number): Promise<Tutor> {
        const response = await api.get<Tutor>(`/tutors/${id}`);
        return response.data;
    },

    // Get tutor availability
    async getTutorAvailability(id: number): Promise<any> {
        const response = await api.get(`/tutors/${id}/availability`);
        return response.data;
    },
};
