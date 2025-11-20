import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentTabNavigator from './navigators/StudentTabNavigator';
import TutorTabNavigator from './navigators/TutorTabNavigator';
import AdminTabNavigator from './navigators/AdminTabNavigator';
import InstitutionAdminTabNavigator from './navigators/InstitutionAdminTabNavigator';
import { View, ActivityIndicator } from 'react-native';

const RoleBasedNavigator = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    switch (user?.role) {
        case 'student':
        case 'mentee':
            return <StudentTabNavigator />;
        case 'tutor':
        case 'verified_tutor':
            return <TutorTabNavigator />;
        case 'admin':
        case 'super_admin':
            return <AdminTabNavigator />;
        case 'institution_admin':
        case 'faculty_coordinator':
        case 'student_coordinator':
        case 'institution_viewer':
        case 'partner_manager':
            return <InstitutionAdminTabNavigator />;
        default:
            // Fallback to student navigator for any other roles or if role is not defined
            return <StudentTabNavigator />;
    }
};

export default RoleBasedNavigator;
