import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Student Screens
import HomeScreen from '../../screens/tabs/HomeScreen';
import SearchScreen from '../../screens/tabs/SearchScreen';
import BookingsScreen from '../../screens/tabs/BookingsScreen';
import ProfileScreen from '../../screens/tabs/ProfileScreen';
import MessagesScreen from '../../screens/tabs/MessagesScreen';

// EducatePro Stack Navigator
import EducateProStackNavigator from './EducateProStackNavigator';

const Tab = createBottomTabNavigator();

export default function StudentTabNavigator() {
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#1976d2',
                tabBarInactiveTintColor: '#999',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                    title: t('tabs.home'),
                    tabBarLabel: t('tabs.home'),
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="magnify" color={color} size={size} />
                    ),
                    title: t('tabs.search'),
                    tabBarLabel: t('tabs.search'),
                }}
            />
            <Tab.Screen
                name="EducatePro"
                component={EducateProStackNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="book-open" color={color} size={size} />
                    ),
                    title: 'Learn',
                    tabBarLabel: 'Learn',
                }}
            />
            <Tab.Screen
                name="Bookings"
                component={BookingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="calendar" color={color} size={size} />
                    ),
                    title: t('tabs.bookings'),
                    tabBarLabel: t('tabs.bookings'),
                }}
            />
            <Tab.Screen
                name="Messages"
                component={MessagesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="chat" color={color} size={size} />
                    ),
                    title: 'Messages',
                    tabBarLabel: 'Messages',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                    title: t('tabs.profile'),
                    tabBarLabel: t('tabs.profile'),
                }}
            />
        </Tab.Navigator>
    );
}
