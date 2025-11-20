import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import ProfileScreen from '../../screens/tabs/ProfileScreen';

const Tab = createBottomTabNavigator();

function PlaceholderScreen({ route }: any) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{route.name}</Text>
        </View>
    );
}

export default function InstitutionAdminTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: '#1976d2',
            }}
        >
            <Tab.Screen name="Dashboard" component={PlaceholderScreen} />
            <Tab.Screen name="Tutors" component={PlaceholderScreen} />
            <Tab.Screen name="Students" component={PlaceholderScreen} />
            <Tab.Screen name="Reports" component={PlaceholderScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
