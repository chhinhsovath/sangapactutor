import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

function PlaceholderScreen({ route }: any) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{route.name}</Text>
        </View>
    );
}

export default function AdminTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: '#1976d2',
            }}
        >
            <Tab.Screen name="Dashboard" component={PlaceholderScreen} />
            <Tab.Screen name="Users" component={PlaceholderScreen} />
            <Tab.Screen name="Settings" component={PlaceholderScreen} />
        </Tab.Navigator>
    );
}
