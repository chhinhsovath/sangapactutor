import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { messagesService } from '../../services/messages.service';
import { Conversation } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export default function MessagesScreen() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const { user } = useAuth();

    const fetchConversations = async () => {
        try {
            const data = await messagesService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchConversations();
    };

    const renderItem = ({ item }: { item: Conversation }) => (
        <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => {
                // Navigate to chat detail - to be implemented
                // navigation.navigate('Chat', { userId: item.user.id });
                console.log('Navigate to chat with', item.user.firstName);
            }}
        >
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                    {item.user.firstName[0]}
                    {item.user.lastName[0]}
                </Text>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.name}>
                        {item.user.firstName} {item.user.lastName}
                    </Text>
                    <Text style={styles.time}>
                        {new Date(item.lastMessage.createdAt).toLocaleDateString()}
                    </Text>
                </View>
                <Text style={styles.message} numberOfLines={1}>
                    {item.lastMessage.message}
                </Text>
            </View>
            {item.unreadCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.unreadCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#1976d2" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={conversations}
                renderItem={renderItem}
                keyExtractor={(item) => item.userId.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>No messages yet</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    conversationItem: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: '#1976d2',
        fontWeight: 'bold',
        fontSize: 18,
    },
    contentContainer: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    time: {
        color: '#666',
        fontSize: 12,
    },
    message: {
        color: '#666',
        fontSize: 14,
    },
    badge: {
        backgroundColor: '#1976d2',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        paddingHorizontal: 5,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
});
