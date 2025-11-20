import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Switch } from 'react-native';
import { Text, Card, Button, useTheme, Divider, List } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function AdminSettingsScreen() {
    const { user, logout } = useAuth();
    const theme = useTheme();
    const { t } = useTranslation();

    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.section}>
                <Text variant="headlineMedium" style={styles.sectionTitle}>Settings</Text>
            </View>

            {/* Admin Account Section */}
            <View style={styles.section}>
                <Text variant="titleLarge" style={styles.groupTitle}>Account</Text>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.accountInfo}>
                            <View>
                                <Text variant="labelSmall" style={styles.label}>Name</Text>
                                <Text variant="bodyMedium">{user?.firstName} {user?.lastName}</Text>
                            </View>
                            <Divider style={styles.divider} />
                            <View>
                                <Text variant="labelSmall" style={styles.label}>Email</Text>
                                <Text variant="bodyMedium">{user?.email}</Text>
                            </View>
                            <Divider style={styles.divider} />
                            <View>
                                <Text variant="labelSmall" style={styles.label}>Role</Text>
                                <Text variant="bodyMedium" style={styles.roleText}>Admin</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </View>

            {/* System Settings Section */}
            <View style={styles.section}>
                <Text variant="titleLarge" style={styles.groupTitle}>System</Text>
                <Card style={styles.card}>
                    <Card.Content>
                        <List.Item
                            title="Maintenance Mode"
                            description="Restrict user access while updating"
                            right={() => (
                                <Switch
                                    value={maintenanceMode}
                                    onValueChange={setMaintenanceMode}
                                />
                            )}
                        />
                        <Divider />
                        <List.Item
                            title="Email Notifications"
                            description="Receive system alerts via email"
                            right={() => (
                                <Switch
                                    value={emailNotifications}
                                    onValueChange={setEmailNotifications}
                                />
                            )}
                        />
                        <Divider />
                        <List.Item
                            title="Analytics"
                            description="Enable usage analytics"
                            right={() => (
                                <Switch
                                    value={analyticsEnabled}
                                    onValueChange={setAnalyticsEnabled}
                                />
                            )}
                        />
                    </Card.Content>
                </Card>
            </View>

            {/* Tools Section */}
            <View style={styles.section}>
                <Text variant="titleLarge" style={styles.groupTitle}>Tools</Text>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.toolRow}>
                            <Button
                                mode="outlined"
                                style={styles.toolButton}
                                onPress={() => {}}
                            >
                                View Logs
                            </Button>
                            <Button
                                mode="outlined"
                                style={styles.toolButton}
                                onPress={() => {}}
                            >
                                Database
                            </Button>
                        </View>
                        <View style={styles.toolRow}>
                            <Button
                                mode="outlined"
                                style={styles.toolButton}
                                onPress={() => {}}
                            >
                                Backups
                            </Button>
                            <Button
                                mode="outlined"
                                style={styles.toolButton}
                                onPress={() => {}}
                            >
                                API Keys
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            </View>

            {/* About Section */}
            <View style={styles.section}>
                <Text variant="titleLarge" style={styles.groupTitle}>About</Text>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.aboutItem}>
                            <Text variant="labelSmall" style={styles.label}>App Version</Text>
                            <Text variant="bodyMedium">1.0.0</Text>
                        </View>
                        <Divider style={styles.divider} />
                        <View style={styles.aboutItem}>
                            <Text variant="labelSmall" style={styles.label}>API Version</Text>
                            <Text variant="bodyMedium">1.0.0</Text>
                        </View>
                        <Divider style={styles.divider} />
                        <View style={styles.aboutItem}>
                            <Text variant="labelSmall" style={styles.label}>Database</Text>
                            <Text variant="bodyMedium">Connected</Text>
                        </View>
                    </Card.Content>
                </Card>
            </View>

            {/* Logout Section */}
            <View style={styles.section}>
                <Button
                    mode="contained"
                    textColor="white"
                    buttonColor={theme.colors.error}
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    Logout
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontWeight: '600',
        marginBottom: 16,
    },
    groupTitle: {
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 8,
    },
    card: {
        borderRadius: 8,
    },
    accountInfo: {
        gap: 12,
    },
    label: {
        opacity: 0.6,
        marginBottom: 4,
    },
    divider: {
        marginVertical: 8,
    },
    roleText: {
        color: '#1976d2',
        fontWeight: '500',
    },
    toolRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    toolButton: {
        flex: 1,
    },
    aboutItem: {
        marginBottom: 12,
    },
    logoutButton: {
        paddingVertical: 6,
    },
});
