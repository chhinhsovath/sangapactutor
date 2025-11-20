/**
 * LiveSessionScreen Component (Phase 5 - Tier 4)
 * Live class interface with participants
 * Adapted from EducatePro template
 *
 * Features:
 * - Live video call interface
 * - Participant list
 * - Chat during session
 * - Raise hand feature
 * - Screen share indicator
 * - Recording status
 * - Dark mode support
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface Participant {
  id: string;
  name: string;
  avatar: any;
  isSpeaker: boolean;
  hasRaisedHand: boolean;
}

interface LiveSessionScreenProps {
  navigation: any;
}

const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: '1',
    name: 'John Smith',
    avatar: require('../../../assets/icon.png'),
    isSpeaker: true,
    hasRaisedHand: false,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: require('../../../assets/icon.png'),
    isSpeaker: false,
    hasRaisedHand: true,
  },
  {
    id: '3',
    name: 'Mike Wilson',
    avatar: require('../../../assets/icon.png'),
    isSpeaker: false,
    hasRaisedHand: false,
  },
  {
    id: '4',
    name: 'Emma Davis',
    avatar: require('../../../assets/icon.png'),
    isSpeaker: false,
    hasRaisedHand: false,
  },
];

const LiveSessionScreen = ({ navigation }: LiveSessionScreenProps) => {
  const [isDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);

  /**
   * Render main video view
   */
  const renderMainVideo = () => (
    <View style={[styles.mainVideo, { backgroundColor: COLORS.black }]}>
      <View style={styles.videoPlaceholder}>
        <MaterialCommunityIcons
          name="video-outline"
          size={64}
          color={COLORS.white}
        />
        <Text style={styles.instructorName}>John Smith</Text>
        <Text style={styles.instructorTitle}>Instructor</Text>
      </View>

      <View style={styles.recordingBadge}>
        <MaterialCommunityIcons
          name="record-circle"
          size={16}
          color={COLORS.red}
        />
        <Text style={styles.recordingText}>Recording</Text>
      </View>
    </View>
  );

  /**
   * Render control buttons
   */
  const renderControls = () => (
    <View
      style={[
        styles.controls,
        {
          backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => setIsMuted(!isMuted)}
        style={[
          styles.controlButton,
          isMuted && styles.controlButtonInactive,
        ]}
      >
        <MaterialCommunityIcons
          name={isMuted ? 'microphone-off' : 'microphone'}
          size={24}
          color={isMuted ? COLORS.red : COLORS.primary}
        />
        <Text
          style={[
            styles.controlLabel,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsCameraOn(!isCameraOn)}
        style={[
          styles.controlButton,
          !isCameraOn && styles.controlButtonInactive,
        ]}
      >
        <MaterialCommunityIcons
          name={isCameraOn ? 'video' : 'video-off'}
          size={24}
          color={!isCameraOn ? COLORS.red : COLORS.primary}
        />
        <Text
          style={[
            styles.controlLabel,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          {isCameraOn ? 'Camera On' : 'Camera Off'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setHandRaised(!handRaised)}
        style={[
          styles.controlButton,
          handRaised && styles.controlButtonActive,
        ]}
      >
        <MaterialCommunityIcons
          name="hand-right"
          size={24}
          color={handRaised ? COLORS.primary : COLORS.greyscale600}
        />
        <Text
          style={[
            styles.controlLabel,
            {
              color: handRaised ? COLORS.primary : COLORS.greyscale600,
            },
          ]}
        >
          Raise Hand
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.controlButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons
          name="phone-hangup"
          size={24}
          color={COLORS.red}
        />
        <Text
          style={[
            styles.controlLabel,
            {
              color: COLORS.red,
            },
          ]}
        >
          Leave
        </Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render participant item
   */
  const renderParticipant = ({ item }: { item: Participant }) => (
    <View
      style={[
        styles.participantItem,
        {
          backgroundColor: isDark ? COLORS.dark3 : COLORS.greyscale100,
        },
      ]}
    >
      <Image
        source={item.avatar}
        style={styles.participantAvatar}
      />

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.participantName,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          {item.name}
          {item.isSpeaker && ' (Speaker)'}
        </Text>
        {item.hasRaisedHand && (
          <View style={styles.handBadge}>
            <MaterialCommunityIcons
              name="hand-right"
              size={12}
              color={COLORS.primary}
            />
            <Text style={styles.handText}>Hand raised</Text>
          </View>
        )}
      </View>

      {item.isSpeaker && (
        <MaterialCommunityIcons
          name="crown"
          size={16}
          color={COLORS.primary}
        />
      )}
    </View>
  );

  /**
   * Render participants panel
   */
  const renderParticipantsPanel = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Participants ({MOCK_PARTICIPANTS.length})
        </Text>
        <TouchableOpacity
          onPress={() => setShowParticipants(!showParticipants)}
        >
          <MaterialCommunityIcons
            name={showParticipants ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {showParticipants && (
        <FlatList
          data={MOCK_PARTICIPANTS}
          renderItem={renderParticipant}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.participantsList}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
        },
      ]}
    >
      {renderMainVideo()}
      {renderControls()}

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderParticipantsPanel()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainVideo: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoPlaceholder: {
    alignItems: 'center',
  },
  instructorName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    marginTop: SIZES.padding,
  },
  instructorTitle: {
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 4,
  },
  recordingBadge: {
    position: 'absolute',
    top: SIZES.padding,
    right: SIZES.padding,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.base,
    borderRadius: 6,
    gap: 4,
  },
  recordingText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SIZES.padding2,
    borderTopWidth: 1,
    borderTopColor: COLORS.greyscale200,
  },
  controlButton: {
    alignItems: 'center',
    paddingVertical: SIZES.base,
  },
  controlButtonInactive: {
    opacity: 0.6,
  },
  controlButtonActive: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SIZES.padding,
    borderRadius: 8,
  },
  controlLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.greyscale200,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  participantsList: {
    gap: SIZES.base,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.base,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.padding2,
  },
  participantName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  handBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  handText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default LiveSessionScreen;
