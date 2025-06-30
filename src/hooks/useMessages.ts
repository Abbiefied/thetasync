import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/AppContext';
import * as api from '../lib/api';

export interface Message {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  message_type: 'text' | 'file' | 'system';
  reply_to?: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  user_profiles?: {
    name: string;
  };
  reply_message?: {
    id: string;
    content: string;
    user_profiles?: {
      name: string;
    };
  };
}

// Demo messages for testing
const DEMO_MESSAGES: Message[] = [
  {
    id: 'demo-1',
    group_id: 'demo',
    user_id: 'demo-user-1',
    content: 'Hey everyone! Welcome to our study group. Looking forward to working together on algorithms!',
    message_type: 'text',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    is_edited: false,
    user_profiles: {
      name: 'Alex Chen'
    }
  },
  {
    id: 'demo-2',
    group_id: 'demo',
    user_id: 'demo-user-2',
    content: 'Thanks for creating this group! I\'ve been struggling with dynamic programming. Anyone have good resources?',
    message_type: 'text',
    created_at: new Date(Date.now() - 3000000).toISOString(),
    updated_at: new Date(Date.now() - 3000000).toISOString(),
    is_edited: false,
    user_profiles: {
      name: 'Sarah Kim'
    }
  },
  {
    id: 'demo-3',
    group_id: 'demo',
    user_id: 'demo-user-3',
    content: 'I have some great DP resources! Let me share them in the resources section.',
    message_type: 'text',
    reply_to: 'demo-2',
    created_at: new Date(Date.now() - 2400000).toISOString(),
    updated_at: new Date(Date.now() - 2400000).toISOString(),
    is_edited: false,
    user_profiles: {
      name: 'Mike Johnson'
    },
    reply_message: {
      id: 'demo-2',
      content: 'Thanks for creating this group! I\'ve been struggling with dynamic programming. Anyone have good resources?',
      user_profiles: {
        name: 'Sarah Kim'
      }
    }
  },
  {
    id: 'demo-4',
    group_id: 'demo',
    user_id: 'demo-user-1',
    content: 'Perfect! Also, should we schedule our first study session for this weekend?',
    message_type: 'text',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    is_edited: false,
    user_profiles: {
      name: 'Alex Chen'
    }
  },
  {
    id: 'demo-5',
    group_id: 'demo',
    user_id: 'demo-user-4',
    content: 'Saturday afternoon works for me! What time is good for everyone?',
    message_type: 'text',
    created_at: new Date(Date.now() - 1200000).toISOString(),
    updated_at: new Date(Date.now() - 1200000).toISOString(),
    is_edited: false,
    user_profiles: {
      name: 'Emily Davis'
    }
  }
];

export function useMessages(groupId: string) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Fetch messages for the group
  const fetchMessages = async () => {
    if (!groupId) return;
    
    setIsLoading(true);
    try {
      // Try to fetch real messages first
      const { data, error } = await api.getGroupMessages(groupId);
      
      if (error) {
        console.warn('Error fetching real messages, using demo messages:', error);
        // Use demo messages as fallback
        setMessages(DEMO_MESSAGES);
      } else {
        // If we have real messages, use them, otherwise fall back to demo
        setMessages(data && data.length > 0 ? data : DEMO_MESSAGES);
      }
    } catch (error) {
      console.warn('Error fetching messages, using demo messages:', error);
      setMessages(DEMO_MESSAGES);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async (content: string, replyTo?: string) => {
    if (!user || !content.trim()) return;

    setIsSending(true);
    try {
      // Try to send real message
      const { data, error } = await api.sendMessage({
        group_id: groupId,
        content: content.trim(),
        message_type: 'text',
        reply_to: replyTo
      });

      if (error) {
        console.warn('Error sending real message, adding demo message:', error);
        // Create a demo message for immediate feedback
        const demoMessage: Message = {
          id: `demo-${Date.now()}`,
          group_id: groupId,
          user_id: user.id,
          content: content.trim(),
          message_type: 'text',
          reply_to: replyTo,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_edited: false,
          user_profiles: {
            name: 'You'
          }
        };
        
        // Add reply message if replying
        if (replyTo) {
          const replyMessage = messages.find(m => m.id === replyTo);
          if (replyMessage) {
            demoMessage.reply_message = {
              id: replyMessage.id,
              content: replyMessage.content,
              user_profiles: replyMessage.user_profiles
            };
          }
        }
        
        setMessages(prev => [...prev, demoMessage]);
        addNotification('info', 'Message sent (demo mode)');
      } else if (data) {
        // Add the real message to the list
        setMessages(prev => [...prev, data]);
        addNotification('success', 'Message sent');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addNotification('error', 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  // Edit a message
  const editMessage = async (messageId: string, newContent: string) => {
    if (!user || !newContent.trim()) return;

    try {
      // Try to edit real message
      const { data, error } = await api.updateMessage(messageId, {
        content: newContent.trim()
      });

      if (error) {
        console.warn('Error editing real message, updating demo message:', error);
        // Update demo message locally
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: newContent.trim(), is_edited: true, updated_at: new Date().toISOString() }
            : msg
        ));
        addNotification('info', 'Message updated (demo mode)');
      } else {
        // Update the message in the list
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: newContent.trim(), is_edited: true, updated_at: new Date().toISOString() }
            : msg
        ));
        addNotification('success', 'Message updated');
      }
    } catch (error) {
      console.error('Error editing message:', error);
      addNotification('error', 'Failed to edit message');
    }
  };

  // Delete a message
  const deleteMessage = async (messageId: string) => {
    if (!user) return;

    try {
      // Try to delete real message
      const { error } = await api.deleteMessage(messageId);

      if (error) {
        console.warn('Error deleting real message, removing demo message:', error);
        // Remove demo message locally
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        addNotification('info', 'Message deleted (demo mode)');
      } else {
        // Remove the message from the list
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        addNotification('success', 'Message deleted');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      addNotification('error', 'Failed to delete message');
    }
  };

  // Load messages when component mounts or groupId changes
  useEffect(() => {
    fetchMessages();
  }, [groupId]);

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    editMessage,
    deleteMessage,
    refreshMessages: fetchMessages
  };
}