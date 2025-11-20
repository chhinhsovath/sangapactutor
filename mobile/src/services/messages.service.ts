import api from './api';
import { Message, Conversation, ApiResponse } from '../types';

export const messagesService = {
    // Get all conversations for the current user
    async getConversations(): Promise<Conversation[]> {
        const response = await api.get<ApiResponse<Conversation[]>>('/messages/conversations');
        return response.data.data;
    },

    // Get messages for a specific conversation
    async getMessages(otherUserId: number): Promise<Message[]> {
        const response = await api.get<ApiResponse<Message[]>>(`/messages/${otherUserId}`);
        return response.data.data;
    },

    // Send a message
    async sendMessage(receiverId: number, message: string): Promise<Message> {
        const response = await api.post<ApiResponse<Message>>('/messages', {
            receiverId,
            message,
        });
        return response.data.data;
    },

    // Mark messages as read
    async markAsRead(senderId: number): Promise<void> {
        await api.put(`/messages/${senderId}/read`);
    },
};
