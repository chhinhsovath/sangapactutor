import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

export default function AdminDashboardScreen() {
    const { user } = useAuth();
    const theme = useTheme();
    const { t } = useTranslation();

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.welcome}>
                    Welcome Admin
                </Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                    {user?.firstName} {user?.lastName}
                </Text>
            </View>

            <View style={styles.section}>
                <Text variant="titleLarge" style={styles.sectionTitle}>System Overview</Text>

                <Card style={[styles.statsCard, { backgroundColor: '#E3F2FD' }]}>
                    <Card.Content>
                        <View style={styles.statRow}>
                            <View style={styles.statItem}>
                                <Text variant="displaySmall" style={styles.statNumber}>--</Text>
                                <Text variant="bodySmall">Total Users</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text variant="displaySmall" style={styles.statNumber}>--</Text>
                                <Text variant="bodySmall">Active Sessions</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text variant="displaySmall" style={styles.statNumber}>--</Text>
                                <Text variant="bodySmall">Bookings</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </View>

            <View style={styles.section}>
                <Text variant="titleLarge" style={styles.sectionTitle}>Admin Actions</Text>

                <Card style={styles.actionCard}>
                    <Card.Content>
                        <View style={styles.actionRow}>
                            <Button mode="contained" style={styles.actionButton}>
                                Manage Users
                            </Button>
                            <Button mode="outlined" style={styles.actionButton}>
                                View Reports
                            </Button>
                        </View>
                        <View style={styles.actionRow}>
                            <Button mode="outlined" style={styles.actionButton}>
                                System Settings
                            </Button>
                            <Button mode="outlined" style={styles.actionButton}>
                                View Logs
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            </View>

            <View style={styles.section}>
                <Text variant="titleLarge" style={styles.sectionTitle}>Recent Activity</Text>
                <Card style={styles.activityCard}>
                    <Card.Content>
                        <Text variant="bodyMedium">No recent activity</Text>
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    welcome: {
        fontWeight: '600',
        marginBottom: 4,
    },
    subtitle: {
        opacity: 0.7,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontWeight: '600',
        marginBottom: 12,
    },
    statsCard: {
        borderRadius: 12,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    actionCard: {
        borderRadius: 12,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    actionButton: {
        flex: 1,
    },
    activityCard: {
        borderRadius: 12,
    },
});
