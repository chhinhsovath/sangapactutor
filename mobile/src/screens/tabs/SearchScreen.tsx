import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Searchbar, Card, Avatar, Chip, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { tutorsService } from '../../services/tutors.service';
import { Tutor } from '../../types';
import { useTranslation } from 'react-i18next';

export default function SearchScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const { t } = useTranslation();

    const { data: tutors, isLoading } = useQuery({
        queryKey: ['tutors'],
        queryFn: () => tutorsService.getTutors(),
    });

    const filteredTutors = tutors?.filter((tutor: Tutor) =>
        `${tutor.firstName} ${tutor.lastName} ${tutor.subject?.name}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const renderTutor = ({ item }: { item: Tutor }) => (
        <Card
            style={styles.tutorCard}
            onPress={() => navigation.navigate('TutorDetail', { id: item.id })}
        >
            <Card.Content>
                <View style={styles.tutorHeader}>
                    <Avatar.Image
                        size={60}
                        source={{ uri: item.avatar || 'https://via.placeholder.com/60' }}
                    />
                    <View style={styles.tutorInfo}>
                        <Text variant="titleMedium" style={styles.tutorName}>
                            {item.firstName} {item.lastName}
                        </Text>
                        <Text variant="bodySmall" style={styles.tutorSubject}>
                            {item.subject?.name || t('search.subject')}
                        </Text>
                        <View style={styles.tutorMeta}>
                            <Text variant="bodySmall">⭐ {item.rating}</Text>
                            <Text variant="bodySmall"> • </Text>
                            <Text variant="bodySmall">{item.totalLessons} {t('search.lessons')}</Text>
                        </View>
                    </View>
                    <View style={styles.tutorPrice}>
                        <Text variant="titleMedium" style={styles.priceText}>
                            ${item.hourlyRate}
                        </Text>
                        <Text variant="bodySmall">{t('search.perHour')}</Text>
                    </View>
                </View>
                <View style={styles.tags}>
                    <Chip mode="outlined">{item.specialization}</Chip>
                    <Chip mode="outlined">{item.level}</Chip>
                    {item.isVerified && <Chip mode="outlined" icon="check-circle">{t('search.verified')}</Chip>}
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder={t('search.placeholder')}
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />

            {isLoading ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={filteredTutors}
                    renderItem={renderTutor}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text>{t('search.noTutorsFound')}</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    searchBar: {
        margin: 16,
    },
    list: {
        padding: 16,
        paddingTop: 0,
    },
    tutorCard: {
        marginBottom: 12,
    },
    tutorHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    tutorInfo: {
        flex: 1,
        marginLeft: 12,
    },
    tutorName: {
        fontWeight: 'bold',
    },
    tutorSubject: {
        color: '#666',
        marginTop: 2,
    },
    tutorMeta: {
        flexDirection: 'row',
        marginTop: 4,
    },
    tutorPrice: {
        alignItems: 'flex-end',
    },
    priceText: {
        fontWeight: 'bold',
        color: '#1976d2',
    },
    tags: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty: {
        padding: 40,
        alignItems: 'center',
    },
});
