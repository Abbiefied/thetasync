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
      const { data, error } = await api.getGroupMessages(groupId);
      if (error) {
        console.error('Error fetching messages:', error);
        addNotification('error', 'Failed to load messages');
        return;
      }
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      addNotification('error', 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async (content: string, replyTo?: string) => {
    if (!user || !content.trim()) return;

    setIsSending(true);
    try {
      const { data, error } = await api.sendMessage({
        group_id: groupId,
        content: content.trim(),
        message_type: 'text',
        reply_to: replyTo
      });

      if (error) {
        console.error('Error sending message:', error);
        addNotification('error', 'Failed to send message');
        return;
      }

      // Add the new message to the list
      if (data) {
        setMessages(prev => [...prev, data]);
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
      const { data, error } = await api.updateMessage(messageId, {
        content: newContent.trim()
      });

      if (error) {
        console.error('Error editing message:', error);
        addNotification('error', 'Failed to edit message');
        return;
      }

      // Update the message in the list
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent.trim(), is_edited: true, updated_at: new Date().toISOString() }
          : msg
      ));
      
      addNotification('success', 'Message updated');
    } catch (error) {
      console.error('Error editing message:', error);
      addNotification('error', 'Failed to edit message');
    }
  };

  // Delete a message
  const deleteMessage = async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await api.deleteMessage(messageId);

      if (error) {
        console.error('Error deleting message:', error);
        addNotification('error', 'Failed to delete message');
        return;
      }

      // Remove the message from the list
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      addNotification('success', 'Message deleted');
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