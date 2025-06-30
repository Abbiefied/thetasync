import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Reply } from 'lucide-react';
import { Message } from '../../hooks/useMessages';

interface MessageInputProps {
  onSendMessage: (content: string, replyTo?: string) => void;
  isSending: boolean;
  replyToMessage?: Message;
  onCancelReply?: () => void;
}

export default function MessageInput({ 
  onSendMessage, 
  isSending, 
  replyToMessage,
  onCancelReply 
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Focus textarea when replying
  useEffect(() => {
    if (replyToMessage && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyToMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSending) {
      onSendMessage(message.trim(), replyToMessage?.id);
      setMessage('');
      if (onCancelReply) {
        onCancelReply();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-neutral-200 p-4 bg-white">
      {/* Reply indicator */}
      {replyToMessage && (
        <div className="mb-3 p-3 bg-neutral-50 border-l-4 border-primary-500 rounded-r-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Reply className="w-4 h-4 text-neutral-500" />
                <span className="text-sm font-medium text-neutral-700">
                  Replying to {replyToMessage.user_profiles?.name || 'User'}
                </span>
              </div>
              <p className="text-sm text-neutral-600 truncate">
                {replyToMessage.content}
              </p>
            </div>
            <button
              onClick={onCancelReply}
              className="p-1 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32"
            rows={1}
            disabled={isSending}
          />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || isSending}
          className={`p-3 rounded-lg transition-colors ${
            message.trim() && !isSending
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      <div className="mt-2 text-xs text-neutral-500">
        Press Enter to send, Shift + Enter for new line
      </div>
    </div>
  );
}