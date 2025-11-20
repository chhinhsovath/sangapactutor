import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, SegmentedButtons, Card, Avatar, Chip, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { bookingsService } from '../../services/bookings.service';
import { Booking } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function BookingsScreen({ navigation }: any) {
    const [filter, setFilter] = useState('all');
    const { t } = useTranslation();

    const { data: bookings, isLoading } = useQuery({
        queryKey: ['bookings'],
        queryFn: () => bookingsService.getBookings(),
    });

    const filteredBookings = bookings?.filter((booking: Booking) => {
        if (filter === 'all') return true;
        return booking.status === filter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return '#4caf50';
            case 'pending':
                return '#ff9800';
            case 'completed':
                return '#2196f3';
            case 'cancelled':
                return '#f44336';
            default:
                return '#757575';
        }
    };

    const { user } = useAuth();

    const renderBooking = ({ item }: { item: Booking }) => {
        const isTutor = user?.role === 'tutor' || user?.role === 'verified_tutor';
        const otherParty = isTutor ? item.student : item.tutor;
        const otherPartyName = isTutor
            ? `${item.student?.firstName} ${item.student?.lastName}`
            : `${item.tutor?.firstName} ${item.tutor?.lastName}`;
        const otherPartyAvatar = isTutor ? item.student?.avatar : item.tutor?.avatar;

        return (
            <Card
                style={styles.bookingCard}
                onPress={() => navigation.navigate('BookingDetail', { id: item.id })}
            >
                <Card.Content>
                    <View style={styles.bookingHeader}>
                        <Avatar.Image
                            size={50}
                            source={{ uri: otherPartyAvatar || 'https://via.placeholder.com/50' }}
                        />
                        <View style={styles.bookingInfo}>
                            <Text variant="titleMedium" style={styles.tutorName}>
                                {otherPartyName}
                            </Text>
                            <Text variant="bodySmall" style={styles.date}>
                                {new Date(item.scheduledAt).toLocaleDateString()} at{' '}
                                {new Date(item.scheduledAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                            <Text variant="bodySmall">{item.duration} {t('bookings.minutes')}</Text>
                        </View>
                        <Chip
                            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
                            textStyle={styles.statusText}
                        >
                            {t(`bookings.status.${item.status}`)}
                        </Chip>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <SegmentedButtons
                    value={filter}
                    onValueChange={setFilter}
                    buttons={[
                        { value: 'all', label: t('bookings.tabs.all') },
                        { value: 'pending', label: t('bookings.tabs.pending') },
                        { value: 'confirmed', label: t('bookings.tabs.confirmed') },
                        { value: 'completed', label: t('bookings.tabs.completed') },
                    ]}
                />
            </View>

            {isLoading ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={filteredBookings}
                    renderItem={renderBooking}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text>{t('bookings.noBookings')}</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    filterContainer: {
        padding: 16,
        backgroundColor: '#fff',
    },
    list: {
        padding: 16,
    },
    bookingCard: {
        marginBottom: 12,
    },
    bookingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookingInfo: {
        flex: 1,
        marginLeft: 12,
    },
    tutorName: {
        fontWeight: 'bold',
    },
    date: {
        color: '#666',
        marginTop: 4,
    },
    statusChip: {
        height: 28,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty: {
        padding: 40,
        alignItems: 'center',
    },
});
