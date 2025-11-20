import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Avatar, Button, List, Divider, SegmentedButtons, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen({ navigation }: any) {
    const { user, logout } = useAuth();
    const theme = useTheme();
    const { t, i18n } = useTranslation();

    const handleLogout = () => {
        Alert.alert(t('common.logout'), t('profile.logoutConfirm'), [
            { text: t('common.cancel'), style: 'cancel' },
            {
                text: t('common.logout'),
                style: 'destructive',
                onPress: async () => {
                    await logout();
                },
            },
        ]);
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Avatar.Text
                    size={80}
                    label={user?.firstName?.substring(0, 2).toUpperCase() || 'U'}
                    style={{ backgroundColor: theme.colors.primary }}
                />
                <Text variant="headlineMedium" style={styles.name}>
                    {user?.firstName} {user?.lastName}
                </Text>
                <Text variant="bodyLarge" style={styles.email}>
                    {user?.email}
                </Text>
                <Text variant="labelLarge" style={[styles.role, { color: theme.colors.primary }]}>
                    {user?.role?.toUpperCase()}
                </Text>
            </View>

            <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>{t('profile.personalInfo')}</Text>
                <List.Item
                    title={t('auth.email')}
                    description={user?.email}
                    left={props => <List.Icon {...props} icon="email" />}
                />
                {user?.role === 'student' && (
                    <>
                        <Divider />
                        <List.Item
                            title={t('home.creditBalance')}
                            description={`$${user?.creditBalance || '0.00'}`}
                            left={props => <List.Icon {...props} icon="wallet" />}
                        />
                    </>
                )}
            </View>

            <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>{t('profile.settings')}</Text>

                <View style={styles.languageContainer}>
                    <Text variant="bodyMedium" style={{ marginBottom: 8 }}>{t('profile.language')}</Text>
                    <SegmentedButtons
                        value={i18n.language}
                        onValueChange={changeLanguage}
                        buttons={[
                            {
                                value: 'km',
                                label: 'ខ្មែរ',
                            },
                            {
                                value: 'en',
                                label: 'English',
                            },
                        ]}
                    />
                </View>

                <Divider style={{ marginVertical: 10 }} />

                <List.Item
                    title={t('profile.help')}
                    left={props => <List.Icon {...props} icon="help-circle" />}
                    onPress={() => { }}
                />
                <Divider />
                <List.Item
                    title={t('profile.about')}
                    left={props => <List.Icon {...props} icon="information" />}
                    onPress={() => { }}
                />
            </View>

            <View style={styles.logoutContainer}>
                <Button
                    mode="outlined"
                    onPress={handleLogout}
                    icon="logout"
                    style={styles.logoutButton}
                    textColor={theme.colors.error}
                >
                    {t('common.logout')}
                </Button>
                <Text variant="bodySmall" style={styles.version}>{t('profile.version')} 1.0.0</Text>
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
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    name: {
        marginTop: 16,
        fontWeight: 'bold',
    },
    email: {
        color: '#666',
        marginTop: 4,
    },
    role: {
        marginTop: 8,
        fontWeight: 'bold',
    },
    section: {
        backgroundColor: '#fff',
        marginBottom: 12,
        padding: 16,
    },
    sectionTitle: {
        marginBottom: 16,
        color: '#666',
        fontWeight: 'bold',
    },
    languageContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    logoutContainer: {
        padding: 24,
        alignItems: 'center',
    },
    logoutButton: {
        width: '100%',
        borderColor: '#ff5252',
    },
    version: {
        marginTop: 16,
        color: '#999',
    },
});
