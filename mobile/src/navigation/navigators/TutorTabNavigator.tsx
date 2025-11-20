import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

// Student Screens
import BookingsScreen from '../../screens/tabs/BookingsScreen';
import MessagesScreen from '../../screens/tabs/MessagesScreen';

// Tutor Screens
import TutorHomeScreen from '../../screens/tabs/TutorHomeScreen';
import TutorProfileScreen from '../../screens/tabs/TutorProfileScreen';

const Tab = createBottomTabNavigator();

export default function TutorTabNavigator() {
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: '#1976d2',
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={TutorHomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => null,
                    title: 'Dashboard',
                    tabBarLabel: 'Dashboard',
                }}
            />
            <Tab.Screen
                name="Bookings"
                component={BookingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => null,
                    title: t('tabs.bookings'),
                    tabBarLabel: t('tabs.bookings'),
                }}
            />
            <Tab.Screen
                name="Messages"
                component={MessagesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => null,
                    title: 'Messages',
                    tabBarLabel: 'Messages',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={TutorProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => null,
                    title: t('tabs.profile'),
                    tabBarLabel: t('tabs.profile'),
                }}
            />
        </Tab.Navigator>
    );
}
