import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Image,
    Animated,
} from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { GradientBackground } from '../../components/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

    // Animation values
    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(30);
    const logoScale = new Animated.Value(0.8);

    useEffect(() => {
        // Animate on mount
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Password strength calculation
    const getPasswordStrength = () => {
        if (!password) return { level: 0, color: '#ddd', label: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 1) {
            return { level: 1, color: '#ef4444', label: 'Weak' };
        } else if (strength <= 2) {
            return { level: 2, color: '#f59e0b', label: 'Fair' };
        } else if (strength <= 3) {
            return { level: 3, color: '#eab308', label: 'Good' };
        } else {
            return { level: 4, color: '#22c55e', label: 'Strong' };
        }
    };

    const passwordStrength = getPasswordStrength();

    const handleRegister = async () => {
        if (!email || !password || !firstName || !lastName) return;
        if (password !== confirmPassword) {
            return;
        }
        await register({ email, password, firstName, lastName, role: role as 'student' | 'tutor' });
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Logo Section */}
                        <Animated.View
                            style={[
                                styles.logoContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ scale: logoScale }],
                                },
                            ]}
                        >
                            <View style={styles.logoWrapper}>
                                <Image
                                    source={require('../../../assets/images/logo.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>
                        </Animated.View>

                        {/* Form Section */}
                        <Animated.View
                            style={[
                                styles.formCard,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            <View style={styles.header}>
                                <Text variant="headlineLarge" style={styles.title}>
                                    {t('auth.registerTitle')}
                                </Text>
                                <Text variant="bodyLarge" style={styles.subtitle}>
                                    {t('auth.registerSubtitle')}
                                </Text>
                            </View>

                            <View style={styles.form}>
                                {/* Role Selection */}
                                <View style={styles.roleSection}>
                                    <Text style={styles.roleLabel}>{t('auth.iAmA')}</Text>
                                    <View style={styles.roleCards}>
                                        <TouchableOpacity
                                            style={[
                                                styles.roleCard,
                                                role === 'student' && styles.roleCardActive,
                                            ]}
                                            onPress={() => setRole('student')}
                                            activeOpacity={0.7}
                                        >
                                            <MaterialCommunityIcons
                                                name="school"
                                                size={28}
                                                color={role === 'student' ? '#667eea' : '#666'}
                                            />
                                            <Text
                                                style={[
                                                    styles.roleCardText,
                                                    role === 'student' && styles.roleCardTextActive,
                                                ]}
                                            >
                                                {t('auth.student')}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[
                                                styles.roleCard,
                                                role === 'tutor' && styles.roleCardActive,
                                            ]}
                                            onPress={() => setRole('tutor')}
                                            activeOpacity={0.7}
                                        >
                                            <MaterialCommunityIcons
                                                name="account-tie"
                                                size={28}
                                                color={role === 'tutor' ? '#667eea' : '#666'}
                                            />
                                            <Text
                                                style={[
                                                    styles.roleCardText,
                                                    role === 'tutor' && styles.roleCardTextActive,
                                                ]}
                                            >
                                                {t('auth.tutor')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Name Fields */}
                                <View style={styles.row}>
                                    <View style={styles.halfInputContainer}>
                                        <TextInput
                                            label={t('auth.firstName')}
                                            value={firstName}
                                            onChangeText={setFirstName}
                                            mode="outlined"
                                            style={styles.input}
                                            disabled={isLoading}
                                            editable={!isLoading}
                                            outlineColor="rgba(255, 255, 255, 0.3)"
                                            activeOutlineColor="#fff"
                                            textColor="#1a1a1a"
                                            theme={{
                                                colors: {
                                                    onSurfaceVariant: 'rgba(0, 0, 0, 0.6)',
                                                },
                                            }}
                                        />
                                    </View>
                                    <View style={styles.halfInputContainer}>
                                        <TextInput
                                            label={t('auth.lastName')}
                                            value={lastName}
                                            onChangeText={setLastName}
                                            mode="outlined"
                                            style={styles.input}
                                            disabled={isLoading}
                                            editable={!isLoading}
                                            outlineColor="rgba(255, 255, 255, 0.3)"
                                            activeOutlineColor="#fff"
                                            textColor="#1a1a1a"
                                            theme={{
                                                colors: {
                                                    onSurfaceVariant: 'rgba(0, 0, 0, 0.6)',
                                                },
                                            }}
                                        />
                                    </View>
                                </View>

                                {/* Email */}
                                <View style={styles.inputContainer}>
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
                                        outlineColor="rgba(255, 255, 255, 0.3)"
                                        activeOutlineColor="#fff"
                                        textColor="#1a1a1a"
                                        theme={{
                                            colors: {
                                                onSurfaceVariant: 'rgba(0, 0, 0, 0.6)',
                                            },
                                        }}
                                        left={
                                            <TextInput.Icon
                                                icon="email-outline"
                                                color="rgba(0, 0, 0, 0.6)"
                                            />
                                        }
                                    />
                                </View>

                                {/* Password */}
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={t('auth.password')}
                                        value={password}
                                        onChangeText={setPassword}
                                        mode="outlined"
                                        secureTextEntry={!showPassword}
                                        style={styles.input}
                                        disabled={isLoading}
                                        editable={!isLoading}
                                        outlineColor="rgba(255, 255, 255, 0.3)"
                                        activeOutlineColor="#fff"
                                        textColor="#1a1a1a"
                                        theme={{
                                            colors: {
                                                onSurfaceVariant: 'rgba(0, 0, 0, 0.6)',
                                            },
                                        }}
                                        left={
                                            <TextInput.Icon
                                                icon="lock-outline"
                                                color="rgba(0, 0, 0, 0.6)"
                                            />
                                        }
                                        right={
                                            <TextInput.Icon
                                                icon={showPassword ? 'eye-off' : 'eye'}
                                                onPress={() => setShowPassword(!showPassword)}
                                                color="rgba(0, 0, 0, 0.6)"
                                            />
                                        }
                                    />
                                    {password && (
                                        <View style={styles.strengthContainer}>
                                            <View style={styles.strengthBars}>
                                                {[1, 2, 3, 4].map((index) => (
                                                    <View
                                                        key={index}
                                                        style={[
                                                            styles.strengthBar,
                                                            {
                                                                backgroundColor:
                                                                    index <= passwordStrength.level
                                                                        ? passwordStrength.color
                                                                        : '#e5e5e5',
                                                            },
                                                        ]}
                                                    />
                                                ))}
                                            </View>
                                            <Text
                                                style={[
                                                    styles.strengthLabel,
                                                    { color: passwordStrength.color },
                                                ]}
                                            >
                                                {passwordStrength.label}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* Confirm Password */}
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={t('auth.confirmPassword')}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        mode="outlined"
                                        secureTextEntry={!showConfirmPassword}
                                        style={styles.input}
                                        disabled={isLoading}
                                        editable={!isLoading}
                                        outlineColor="rgba(255, 255, 255, 0.3)"
                                        activeOutlineColor="#fff"
                                        textColor="#1a1a1a"
                                        theme={{
                                            colors: {
                                                onSurfaceVariant: 'rgba(0, 0, 0, 0.6)',
                                            },
                                        }}
                                        left={
                                            <TextInput.Icon
                                                icon="lock-check-outline"
                                                color="rgba(0, 0, 0, 0.6)"
                                            />
                                        }
                                        right={
                                            <TextInput.Icon
                                                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                                color="rgba(0, 0, 0, 0.6)"
                                            />
                                        }
                                    />
                                    {confirmPassword && password !== confirmPassword && (
                                        <HelperText type="error" visible={true} style={styles.errorText}>
                                            Passwords do not match
                                        </HelperText>
                                    )}
                                </View>

                                {error ? (
                                    <HelperText type="error" visible={!!error} style={styles.errorText}>
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
                                    buttonColor="#667eea"
                                    labelStyle={styles.buttonLabel}
                                >
                                    {t('auth.registerButton')}
                                </Button>

                                <View style={styles.footer}>
                                    <Text variant="bodyMedium" style={styles.footerText}>
                                        {t('auth.alreadyHaveAccount')}{' '}
                                    </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                        <Text style={styles.link}>
                                            {t('auth.loginButton')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    logoWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    logo: {
        width: 80,
        height: 80,
    },
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#1a1a1a',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        fontWeight: '500',
    },
    form: {
        width: '100%',
    },
    roleSection: {
        marginBottom: 20,
    },
    roleLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    roleCards: {
        flexDirection: 'row',
        gap: 12,
    },
    roleCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    roleCardActive: {
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.05)',
    },
    roleCardText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    roleCardTextActive: {
        color: '#667eea',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    halfInputContainer: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    strengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    strengthBars: {
        flex: 1,
        flexDirection: 'row',
        gap: 4,
    },
    strengthBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
    },
    strengthLabel: {
        fontSize: 12,
        fontWeight: '600',
        minWidth: 50,
        textAlign: 'right',
    },
    errorText: {
        marginTop: 4,
        fontSize: 13,
    },
    button: {
        marginTop: 8,
        marginBottom: 20,
        borderRadius: 12,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#666',
    },
    link: {
        fontWeight: 'bold',
        color: '#667eea',
        fontSize: 15,
    },
});
