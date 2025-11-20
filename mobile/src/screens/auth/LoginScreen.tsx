import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error } = useAuth();
    const theme = useTheme();
    const { t } = useTranslation();

    const handleLogin = async () => {
        if (!email || !password) return;
        await login(email, password);
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
                            <Text variant="headlineLarge" style={styles.title}>{t('auth.loginTitle')}</Text>
                            <Text variant="bodyLarge" style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>
                        </View>

                        <View style={styles.form}>
                            <TextInput
                                label={t('auth.email')}
                                value={email}
                                onChangeText={setEmail}
                                mode="outlined"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                                error={!!error}
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
                                error={!!error}
                                editable={!isLoading}
                            />

                            {error ? (
                                <HelperText type="error" visible={!!error}>
                                    {error}
                                </HelperText>
                            ) : null}

                            <TouchableOpacity onPress={() => { }}>
                                <Text style={[styles.forgotPassword, { color: theme.colors.primary }]}>
                                    {t('auth.forgotPassword')}
                                </Text>
                            </TouchableOpacity>

                            <Button
                                mode="contained"
                                onPress={handleLogin}
                                loading={isLoading}
                                disabled={isLoading}
                                style={styles.button}
                                contentStyle={styles.buttonContent}
                            >
                                {t('auth.loginButton')}
                            </Button>

                            <View style={styles.footer}>
                                <Text variant="bodyMedium">{t('auth.dontHaveAccount')} </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <Text style={[styles.link, { color: theme.colors.primary }]}>
                                        {t('auth.registerButton')}
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
        marginBottom: 32,
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
    input: {
        marginBottom: 16,
    },
    forgotPassword: {
        textAlign: 'right',
        marginBottom: 24,
        fontWeight: 'bold',
    },
    button: {
        marginBottom: 24,
    },
    buttonContent: {
        paddingVertical: 6,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    link: {
        fontWeight: 'bold',
    },
});
