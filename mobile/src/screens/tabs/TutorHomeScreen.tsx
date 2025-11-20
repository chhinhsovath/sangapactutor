import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function TutorHomeScreen() {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>
                    {t('home.welcome')}, {user?.firstName}!
                </Text>
                <Text style={styles.subtitle}>Tutor Dashboard</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statLabel}>Upcoming Sessions</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>$0.00</Text>
                    <Text style={styles.statLabel}>Earnings (Month)</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionText}>Update Availability</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionText}>View Requests</Text>
                    </TouchableOpacity>
                </View>
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
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-between',
    },
    statCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1976d2',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    actionButton: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        width: '48%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    actionText: {
        color: '#1976d2',
        fontWeight: '600',
    },
});
