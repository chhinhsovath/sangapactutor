import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme, Avatar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { bookingsService } from '../../services/bookings.service';
import { Booking } from '../../types';

export default function HomeScreen({ navigation }: any) {
    const { user } = useAuth();
    const theme = useTheme();
    const { t } = useTranslation();

    // Fetch upcoming bookings
    const { data: bookings, isLoading } = useQuery({
        queryKey: ['bookings', 'upcoming'],
        queryFn: () => bookingsService.getBookings('confirmed'),
    });

    const upcomingBookings = bookings?.slice(0, 3) || [];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.welcome}>
                    {t('home.welcomeUser', { name: user?.firstName })}
                </Text>
                {user?.role === 'student' && (
                    <Card style={styles.creditCard}>
                        <Card.Content>
                            <Text variant="titleMedium" style={{ color: '#fff' }}>{t('home.creditBalance')}</Text>
                            <Text variant="displaySmall" style={{ color: '#fff', fontWeight: 'bold' }}>
                                ${user?.creditBalance || '0.00'}
                            </Text>
                        </Card.Content>
                    </Card>
                )}
            </View>

            <View style={styles.section}>
                <Text variant="titleLarge" style={styles.sectionTitle}>{t('home.upcomingBookings')}</Text>

                {isLoading ? (
                    <Text>Loading...</Text>
                ) : upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking: Booking) => (
                        <Card
                            key={booking.id}
                            style={styles.bookingCard}
                            onPress={() => navigation.navigate('BookingDetail', { id: booking.id })}
                        >
                            <Card.Content>
                                <View style={styles.bookingContent}>
                                    <Avatar.Text
                                        size={40}
                                        label={booking.tutor?.firstName?.[0] || 'T'}
                                    />
                                    <View style={styles.bookingInfo}>
                                        <Text variant="titleSmall">
                                            {booking.tutor?.firstName} {booking.tutor?.lastName}
                                        </Text>
                                        <Text variant="bodySmall">
                                            {new Date(booking.scheduledAt).toLocaleDateString()} at{' '}
                                            {new Date(booking.scheduledAt).toLocaleTimeString()}
                                        </Text>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    ))
                ) : (
                    <Card style={styles.emptyCard}>
                        <Card.Content style={{ alignItems: 'center' }}>
                            <Avatar.Icon size={64} icon="calendar-blank" style={{ backgroundColor: '#e0e0e0' }} />
                            <Text variant="bodyLarge" style={{ marginTop: 16, color: '#757575' }}>
                                {t('home.noUpcomingBookings')}
                            </Text>
                            <Button
                                mode="contained"
                                onPress={() => navigation.navigate('Search')}
                                style={{ marginTop: 16 }}
                            >
                                {t('home.findTutor')}
                            </Button>
                        </Card.Content>
                    </Card>
                )}
            </View>

            <View style={styles.section}>
                <Text variant="titleLarge" style={styles.sectionTitle}>{t('home.recentTutors')}</Text>
                {/* Placeholder for recent tutors */}
                <Text style={{ color: '#757575', fontStyle: 'italic' }}>Coming soon...</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 24,
        backgroundColor: '#fff',
        paddingBottom: 32,
    },
    welcome: {
        fontWeight: 'bold',
        marginBottom: 16,
    },
    creditCard: {
        backgroundColor: '#1976d2',
        marginTop: 8,
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
    },
    bookingCard: {
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    bookingContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookingInfo: {
        marginLeft: 12,
    },
    emptyCard: {
        backgroundColor: '#fff',
        padding: 16,
    },
});
