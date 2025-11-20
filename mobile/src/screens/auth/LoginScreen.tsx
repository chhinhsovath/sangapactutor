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
import { TextInput, Button, Text, HelperText, useTheme, Checkbox } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { GradientBackground } from '../../components/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login, isLoading, error } = useAuth();
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

    const handleLogin = async () => {
        if (!email || !password) return;
        await login(email, password);
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
                                    {t('auth.loginTitle')}
                                </Text>
                                <Text variant="bodyLarge" style={styles.subtitle}>
                                    {t('auth.loginSubtitle')}
                                </Text>
                            </View>

                            <View style={styles.form}>
                                <View style={styles.inputContainer}>
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

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={t('auth.password')}
                                        value={password}
                                        onChangeText={setPassword}
                                        mode="outlined"
                                        secureTextEntry={!showPassword}
                                        style={styles.input}
                                        error={!!error}
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
                                </View>

                                {error ? (
                                    <HelperText type="error" visible={!!error} style={styles.errorText}>
                                        {error}
                                    </HelperText>
                                ) : null}

                                <View style={styles.optionsRow}>
                                    <TouchableOpacity
                                        style={styles.rememberMeContainer}
                                        onPress={() => setRememberMe(!rememberMe)}
                                        activeOpacity={0.7}
                                    >
                                        <Checkbox
                                            status={rememberMe ? 'checked' : 'unchecked'}
                                            onPress={() => setRememberMe(!rememberMe)}
                                            color="#667eea"
                                        />
                                        <Text style={styles.rememberMeText}>
                                            {t('auth.rememberMe') || 'Remember me'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => { }}>
                                        <Text style={styles.forgotPassword}>
                                            {t('auth.forgotPassword')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <Button
                                    mode="contained"
                                    onPress={handleLogin}
                                    loading={isLoading}
                                    disabled={isLoading}
                                    style={styles.button}
                                    contentStyle={styles.buttonContent}
                                    buttonColor="#667eea"
                                    labelStyle={styles.buttonLabel}
                                >
                                    {t('auth.loginButton')}
                                </Button>

                                {/* Social Login Placeholder */}
                                <View style={styles.dividerContainer}>
                                    <View style={styles.divider} />
                                    <Text style={styles.dividerText}>
                                        {t('auth.orContinueWith') || 'Or continue with'}
                                    </Text>
                                    <View style={styles.divider} />
                                </View>

                                <View style={styles.socialButtons}>
                                    <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                                        <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                                        <MaterialCommunityIcons name="apple" size={24} color="#000" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.footer}>
                                    <Text variant="bodyMedium" style={styles.footerText}>
                                        {t('auth.dontHaveAccount')}{' '}
                                    </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                        <Text style={styles.link}>
                                            {t('auth.registerButton')}
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
        marginBottom: 28,
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
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    errorText: {
        marginBottom: 8,
        fontSize: 13,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberMeText: {
        fontSize: 14,
        color: '#666',
        marginLeft: -8,
    },
    forgotPassword: {
        fontSize: 14,
        color: '#667eea',
        fontWeight: '600',
    },
    button: {
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
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    dividerText: {
        marginHorizontal: 12,
        fontSize: 13,
        color: '#999',
        fontWeight: '500',
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
