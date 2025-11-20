/**
 * ChatScreen Component (Phase 5 - Tier 2)
 * Messaging interface with conversation history
 * Adapted from EducatePro template
 *
 * Features:
 * - Chat header with user info
 * - Message list (sent/received)
 * - Input field with send button
 * - Typing indicator
 * - Online status
 * - Dark mode support
 * - Message timestamps
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
  avatar?: any;
}

interface ChatScreenProps {
  navigation: any;
  route?: any;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hey! How are you doing?',
    sender: 'other',
    timestamp: '10:30 AM',
    avatar: require('../../../assets/icon.png'),
  },
  {
    id: '2',
    text: 'I\'m doing great! Just finished the React course.',
    sender: 'user',
    timestamp: '10:32 AM',
  },
  {
    id: '3',
    text: 'That\'s awesome! Congratulations 🎉',
    sender: 'other',
    timestamp: '10:33 AM',
    avatar: require('../../../assets/icon.png'),
  },
  {
    id: '4',
    text: 'Would you like to start the advanced course next?',
    sender: 'other',
    timestamp: '10:34 AM',
    avatar: require('../../../assets/icon.png'),
  },
  {
    id: '5',
    text: 'Yes, I\'d love to! Can you recommend some resources?',
    sender: 'user',
    timestamp: '10:35 AM',
  },
  {
    id: '6',
    text: 'Sure! I\'ll send you a list of great resources.',
    sender: 'other',
    timestamp: '10:36 AM',
    avatar: require('../../../assets/icon.png'),
  },
];

const ChatScreen = ({ navigation, route }: ChatScreenProps) => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isDark] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  /**
   * Scroll to bottom when messages update
   */
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  /**
   * Handle sending message
   */
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: String(messages.length + 1),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate typing indicator and response
    setTimeout(() => {
      setIsTyping(true);
    }, 500);

    setTimeout(() => {
      const response: Message = {
        id: String(messages.length + 2),
        text: 'Thanks for your message! I\'ll get back to you soon.',
        sender: 'other',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        avatar: require('../../../assets/icon.png'),
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 2000);
  };

  /**
   * Render chat header
   */
  const renderHeader = () => (
    <View
      style={[
        styles.header,
        {
          backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
          borderBottomColor: isDark ? COLORS.dark2 : COLORS.greyscale200,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={isDark ? COLORS.white : COLORS.black}
        />
      </TouchableOpacity>

      <View style={styles.headerContent}>
        <Text
          style={[
            styles.headerTitle,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Sarah Johnson
        </Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: COLORS.primary }]} />
          <Text
            style={[
              styles.statusText,
              {
                color: isDark ? COLORS.gray : COLORS.greyscale600,
              },
            ]}
          >
            Online
          </Text>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.7}>
        <MaterialCommunityIcons
          name="phone"
          size={24}
          color={COLORS.primary}
        />
      </TouchableOpacity>
    </View>
  );

  /**
   * Render message item
   */
  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageWrapper,
        item.sender === 'user' && styles.sentMessageWrapper,
      ]}
    >
      {item.sender === 'other' && item.avatar && (
        <Image
          source={item.avatar}
          resizeMode="cover"
          style={styles.avatar}
        />
      )}

      <View
        style={[
          styles.messageBubble,
          item.sender === 'user'
            ? styles.sentBubble
            : styles.receivedBubble,
          {
            backgroundColor:
              item.sender === 'user'
                ? COLORS.primary
                : isDark
                ? COLORS.dark2
                : COLORS.greyscale100,
          },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color:
                item.sender === 'user'
                  ? COLORS.white
                  : isDark
                  ? COLORS.white
                  : COLORS.black,
            },
          ]}
        >
          {item.text}
        </Text>
      </View>

      {item.sender === 'user' && (
        <Text
          style={[
            styles.timestamp,
            {
              color: isDark ? COLORS.gray : COLORS.greyscale600,
            },
          ]}
        >
          {item.timestamp}
        </Text>
      )}
    </View>
  );

  /**
   * Render typing indicator
   */
  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.messageWrapper}>
        <Image
          source={require('../../../assets/icon.png')}
          resizeMode="cover"
          style={styles.avatar}
        />
        <View
          style={[
            styles.messageBubble,
            styles.receivedBubble,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
              paddingVertical: SIZES.padding,
            },
          ]}
        >
          <View style={styles.typingDots}>
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
          </View>
        </View>
      </View>
    );
  };

  /**
   * Render input area
   */
  const renderInputArea = () => (
    <View
      style={[
        styles.inputArea,
        {
          backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
          borderTopColor: isDark ? COLORS.dark2 : COLORS.greyscale200,
        },
      ]}
    >
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale100,
          },
        ]}
      >
        <TouchableOpacity activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <TextInput
          placeholder="Type your message..."
          placeholderTextColor={COLORS.gray}
          value={inputText}
          onChangeText={setInputText}
          style={[
            styles.input,
            {
              color: isDark ? COLORS.white : COLORS.black,
            },
          ]}
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={inputText.trim() === ''}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="send"
            size={24}
            color={
              inputText.trim() === '' ? COLORS.gray : COLORS.primary
            }
          />
        </TouchableOpacity>
      </View>
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
      {renderHeader()}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => renderMessage({ item: msg }))}
          {renderTypingIndicator()}
        </ScrollView>

        {renderInputArea()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
    borderBottomWidth: 1,
  },
  headerContent: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
    alignItems: 'flex-end',
  },
  sentMessageWrapper: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: SIZES.padding2,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.padding,
    borderRadius: 16,
  },
  sentBubble: {
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: SIZES.padding,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gray,
    marginRight: 4,
  },
  inputArea: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderTopWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.padding2 - 2,
    borderRadius: 24,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: SIZES.padding2,
    maxHeight: 100,
  },
});

export default ChatScreen;
