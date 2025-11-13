'use client';

import { useState, useEffect } from 'react';
import { List, Avatar, Input, Button, Space, Typography, Card, Empty, Spin, App } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function StudentMessagesPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchConversations();
    }
  }, [status, session]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/messages?userId=${session?.user?.id}`);
      const data = await response.json();

      // Group messages by conversation partner
      const conversationMap = new Map();
      data.forEach((msg: any) => {
        const partnerId = msg.senderId === parseInt(session?.user?.id!) ? msg.receiverId : msg.senderId;
        const partner = msg.senderId === parseInt(session?.user?.id!) ? msg.receiver : msg.sender;
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            partnerId,
            partner,
            lastMessage: msg,
            unreadCount: 0,
          });
        } else {
          const existing = conversationMap.get(partnerId);
          if (new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
            existing.lastMessage = msg;
          }
        }

        if (msg.receiverId === parseInt(session?.user?.id!) && !msg.isRead) {
          conversationMap.get(partnerId).unreadCount++;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId: number) => {
    try {
      const response = await fetch(`/api/messages?userId=${session?.user?.id}&with=${partnerId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      messageApi.error(t('student.messagesPage.failedToLoad'));
    }
  };

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.partnerId);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: parseInt(session?.user?.id!),
          receiverId: selectedConversation.partnerId,
          message: messageText,
        }),
      });

      if (response.ok) {
        setMessageText('');
        fetchMessages(selectedConversation.partnerId);
        fetchConversations();
        messageApi.success(t('student.messagesPage.messageSent'));
      } else {
        messageApi.error(t('student.messagesPage.failedToSend'));
      }
    } catch (error) {
      messageApi.error(t('student.messagesPage.failedToSend'));
    } finally {
      setSending(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout role="student" user={{ name: '', email: '', avatar: '' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = {
    name: session.user.name || '',
    email: session.user.email || '',
    avatar: session.user.image || '',
  };

  return (
    <DashboardLayout role="student" user={user}>
      <Title level={2}>{t('student.messagesPage.title')}</Title>

      <div style={{ display: 'flex', gap: 16, marginTop: 24, height: 'calc(100vh - 200px)' }}>
        {/* Conversations List */}
        <Card style={{ width: 350, overflowY: 'auto' }} bodyStyle={{ padding: 0 }}>
          <List
            dataSource={conversations}
            renderItem={(conversation: any) => {
              const partnerName = `${conversation.partner.firstName} ${conversation.partner.lastName}`;
              return (
                <List.Item
                  onClick={() => handleSelectConversation(conversation)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedConversation?.partnerId === conversation.partnerId ? '#f0f0f0' : 'transparent',
                    padding: '12px 16px',
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={conversation.partner.avatar || undefined}>{partnerName.charAt(0)}</Avatar>}
                    title={partnerName}
                    description={conversation.lastMessage.message.substring(0, 50)}
                  />
                  {conversation.unreadCount > 0 && (
                    <div style={{
                      backgroundColor: '#1890ff',
                      color: 'white',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                    }}>
                      {conversation.unreadCount}
                    </div>
                  )}
                </List.Item>
              );
            }}
          />
        </Card>

        {/* Messages */}
        <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedConversation ? (
            <>
              <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {messages.map((msg: any) => {
                    const isOwn = msg.senderId === parseInt(session?.user?.id!);
                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          justifyContent: isOwn ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '70%',
                            padding: '8px 12px',
                            borderRadius: 8,
                            backgroundColor: isOwn ? '#1890ff' : '#f0f0f0',
                            color: isOwn ? 'white' : 'black',
                          }}
                        >
                          <Text style={{ color: isOwn ? 'white' : 'inherit' }}>{msg.message}</Text>
                          <div>
                            <Text
                              type="secondary"
                              style={{ fontSize: 11, color: isOwn ? 'rgba(255,255,255,0.7)' : undefined }}
                            >
                              {dayjs(msg.createdAt).format('HH:mm')}
                            </Text>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Space>
              </div>
              <div style={{ borderTop: '1px solid #f0f0f0', padding: 16 }}>
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    placeholder={t('student.messagesPage.typeMessage')}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onPressEnter={handleSendMessage}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    loading={sending}
                  >
                    {t('student.messagesPage.send')}
                  </Button>
                </Space.Compact>
              </div>
            </>
          ) : (
            <Empty description={t('student.messagesPage.selectConversation')} />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
