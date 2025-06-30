import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import MessageItem from './MessageItem';
import { Message } from '../../hooks/useMessages';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReplyToMessage: (message: Message) => void;
}

export default function MessageList({ 
  messages, 
  isLoading, 
  onEditMessage, 
  onDeleteMessage,
  onReplyToMessage 
}: MessageListProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-neutral-500 text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No messages yet</h3>
          <p className="text-neutral-600">Be the first to start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const showAvatar = !prevMessage || prevMessage.user_id !== message.user_id;
        const isConsecutive = prevMessage && 
          prevMessage.user_id === message.user_id && 
          new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() < 300000; // 5 minutes

        return (
          <MessageItem
            key={message.id}
            message={message}
            isOwn={message.user_id === user?.id}
            showAvatar={showAvatar}
            isConsecutive={isConsecutive}
            onEdit={onEditMessage}
            onDelete={onDeleteMessage}
            onReply={onReplyToMessage}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}