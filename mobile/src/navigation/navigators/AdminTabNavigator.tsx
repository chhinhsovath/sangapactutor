import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboardScreen from '../../screens/tabs/AdminDashboardScreen';
import AdminUsersScreen from '../../screens/tabs/AdminUsersScreen';
import AdminSettingsScreen from '../../screens/tabs/AdminSettingsScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function AdminTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                tabBarActiveTintColor: '#1976d2',
                tabBarInactiveTintColor: '#999',
                tabBarIcon: ({ color, size }) => {
                    let iconName = 'home';
                    if (route.name === 'Dashboard') {
                        iconName = 'view-dashboard';
                    } else if (route.name === 'Users') {
                        iconName = 'account-multiple';
                    } else if (route.name === 'Settings') {
                        iconName = 'cog';
                    }
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={AdminDashboardScreen}
                options={{ title: 'Dashboard' }}
            />
            <Tab.Screen
                name="Users"
                component={AdminUsersScreen}
                options={{ title: 'Users' }}
            />
            <Tab.Screen
                name="Settings"
                component={AdminSettingsScreen}
                options={{ title: 'Settings' }}
            />
        </Tab.Navigator>
    );
}
