import api from './api';
import { Booking } from '../types';

export const bookingsService = {
    // Get user's bookings
    async getBookings(status?: string): Promise<Booking[]> {
        const response = await api.get<Booking[]>('/bookings', {
            params: status ? { status } : undefined,
        });
        return response.data;
    },

    // Get single booking
    async getBookingById(id: number): Promise<Booking> {
        const response = await api.get<Booking>(`/bookings/${id}`);
        return response.data;
    },

    // Create new booking
    async createBooking(data: {
        tutorId: number;
        scheduledAt: string;
        duration: number;
        notes?: string;
    }): Promise<Booking> {
        const response = await api.post<Booking>('/bookings', data);
        return response.data;
    },

    // Update booking status
    async updateBooking(id: number, status: string): Promise<Booking> {
        const response = await api.patch<Booking>(`/bookings/${id}`, { status });
        return response.data;
    },

    // Cancel booking
    async cancelBooking(id: number): Promise<void> {
        await api.delete(`/bookings/${id}`);
    },
};
