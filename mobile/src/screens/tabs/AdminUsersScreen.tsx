import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, SearchBar, useTheme, Chip, FAB } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function AdminUsersScreen() {
    const theme = useTheme();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const roles = ['Student', 'Tutor', 'Institution Admin'];

    const mockUsers = [
        { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Student', status: 'Active' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Tutor', status: 'Active' },
        { id: 3, name: 'Admin User', email: 'admin@tutorhub.com', role: 'Admin', status: 'Active' },
    ];

    const renderUserCard = (user: any) => (
        <Card key={user.id} style={[styles.userCard, { marginBottom: 8 }]}>
            <Card.Content>
                <View style={styles.userHeader}>
                    <View style={styles.userInfo}>
                        <Text variant="titleMedium" style={styles.userName}>{user.name}</Text>
                        <Text variant="bodySmall" style={styles.userEmail}>{user.email}</Text>
                    </View>
                    <Chip
                        label={user.status}
                        mode="outlined"
                        textStyle={styles.chipText}
                    />
                </View>
                <View style={styles.userFooter}>
                    <Chip label={user.role} mode="flat" />
                    <View style={styles.userActions}>
                        <Button mode="text" compact>Edit</Button>
                        <Button mode="text" compact textColor="red">Remove</Button>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollContent}>
                <View style={styles.header}>
                    <Text variant="headlineMedium" style={styles.title}>User Management</Text>
                </View>

                <View style={styles.section}>
                    <SearchBar
                        placeholder="Search users..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                    />
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Filter by Role</Text>
                    <View style={styles.filterChips}>
                        {roles.map((role) => (
                            <Chip
                                key={role}
                                label={role}
                                mode={selectedRole === role ? 'flat' : 'outlined'}
                                onPress={() => setSelectedRole(selectedRole === role ? null : role)}
                                style={styles.filterChip}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        All Users ({mockUsers.length})
                    </Text>
                    {mockUsers.map(renderUserCard)}
                </View>
            </ScrollView>

            <FAB
                icon="plus"
                label="Add User"
                onPress={() => {}}
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontWeight: '600',
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontWeight: '600',
        marginBottom: 8,
    },
    searchBar: {
        borderRadius: 8,
    },
    filterChips: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    filterChip: {
        marginBottom: 8,
    },
    userCard: {
        borderRadius: 8,
    },
    userHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontWeight: '600',
        marginBottom: 4,
    },
    userEmail: {
        opacity: 0.6,
    },
    chipText: {
        fontSize: 12,
    },
    userFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userActions: {
        flexDirection: 'row',
        marginLeft: 8,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
