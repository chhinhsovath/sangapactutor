import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

type RegisterScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, isLoading, error } = useAuth();
    const theme = useTheme();
    const { t } = useTranslation();

    const handleRegister = async () => {
        if (!email || !password || !firstName || !lastName) return;
        if (password !== confirmPassword) {
            // Ideally show an error here, but for now relying on backend or AuthContext error
            return;
        }
        await register({ email, password, firstName, lastName, role: role as 'student' | 'tutor' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text variant="headlineLarge" style={styles.title}>{t('auth.registerTitle')}</Text>
                            <Text variant="bodyLarge" style={styles.subtitle}>{t('auth.registerSubtitle')}</Text>
                        </View>

                        <View style={styles.form}>
                            <Text style={styles.label}>{t('auth.iAmA')}</Text>
                            <SegmentedButtons
                                value={role}
                                onValueChange={setRole}
                                buttons={[
                                    {
                                        value: 'student',
                                        label: t('auth.student'),
                                        icon: 'school',
                                    },
                                    {
                                        value: 'tutor',
                                        label: t('auth.tutor'),
                                        icon: 'teach',
                                    },
                                ]}
                                style={styles.segmentedButtons}
                            />

                            <View style={styles.row}>
                                <TextInput
                                    label={t('auth.firstName')}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    mode="outlined"
                                    style={[styles.input, styles.halfInput]}
                                    disabled={isLoading}
                                    editable={!isLoading}
                                />
                                <TextInput
                                    label={t('auth.lastName')}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    mode="outlined"
                                    style={[styles.input, styles.halfInput]}
                                    disabled={isLoading}
                                    editable={!isLoading}
                                />
                            </View>

                            <TextInput
                                label={t('auth.email')}
                                value={email}
                                onChangeText={setEmail}
                                mode="outlined"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                                disabled={isLoading}
                                editable={!isLoading}
                            />

                            <TextInput
                                label={t('auth.password')}
                                value={password}
                                onChangeText={setPassword}
                                mode="outlined"
                                secureTextEntry={!showPassword}
                                right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                                style={styles.input}
                                disabled={isLoading}
                                editable={!isLoading}
                            />

                            <TextInput
                                label={t('auth.confirmPassword')}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                mode="outlined"
                                secureTextEntry={!showConfirmPassword}
                                right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
                                style={styles.input}
                                disabled={isLoading}
                                editable={!isLoading}
                            />

                            {error ? (
                                <HelperText type="error" visible={!!error}>
                                    {error}
                                </HelperText>
                            ) : null}

                            <Button
                                mode="contained"
                                onPress={handleRegister}
                                loading={isLoading}
                                disabled={isLoading}
                                style={styles.button}
                                contentStyle={styles.buttonContent}
                            >
                                {t('auth.registerButton')}
                            </Button>

                            <View style={styles.footer}>
                                <Text variant="bodyMedium">{t('auth.alreadyHaveAccount')} </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={[styles.link, { color: theme.colors.primary }]}>
                                        {t('auth.loginButton')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: '#666',
    },
    segmentedButtons: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        marginBottom: 24,
    },
    buttonContent: {
        paddingVertical: 6,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    link: {
        fontWeight: 'bold',
    },
});
