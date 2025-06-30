import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2, Reply, Check, X } from 'lucide-react';
import { Message } from '../../hooks/useMessages';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  isConsecutive: boolean;
  onEdit: (messageId: string, newContent: string) => void;
  onDelete: (messageId: string) => void;
  onReply: (message: Message) => void;
}

export default function MessageItem({ 
  message, 
  isOwn, 
  showAvatar, 
  isConsecutive,
  onEdit, 
  onDelete,
  onReply 
}: MessageItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent.trim() !== message.content) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onDelete(message.id);
    setShowDeleteConfirm(false);
    setShowMenu(false);
  };

  const handleReply = () => {
    onReply(message);
    setShowMenu(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-primary-100 text-primary-600',
      'bg-secondary-100 text-secondary-600',
      'bg-accent-100 text-accent-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-4'}`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {showAvatar && !isOwn && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${getAvatarColor(message.user_profiles?.name || 'User')}`}>
            {getAvatarInitials(message.user_profiles?.name || 'U')}
          </div>
        )}
        
        {/* Message Content */}
        <div className={`relative group ${isOwn ? 'mr-2' : showAvatar ? '' : 'ml-11'}`}>
          {/* Reply indicator */}
          {message.reply_to && message.reply_message && (
            <div className={`text-xs text-neutral-500 mb-1 p-2 bg-neutral-100 rounded-lg border-l-2 border-neutral-300 ${isOwn ? 'text-right' : ''}`}>
              <div className="font-medium">{message.reply_message.user_profiles?.name || 'User'}</div>
              <div className="truncate">{message.reply_message.content}</div>
            </div>
          )}

          <div
            className={`px-4 py-2 rounded-lg relative ${
              isOwn
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-neutral-200 text-neutral-900'
            }`}
          >
            {/* Sender name for non-own messages */}
            {!isOwn && showAvatar && (
              <div className="text-xs font-medium text-neutral-500 mb-1">
                {message.user_profiles?.name || 'Unknown User'}
              </div>
            )}

            {/* Message content */}
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 text-sm bg-white text-neutral-900 border border-neutral-300 rounded resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={2}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </div>
            )}

            {/* Message actions menu */}
            {!isEditing && (
              <div className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 text-neutral-400 hover:text-neutral-600 bg-white border border-neutral-200 rounded shadow-sm"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showMenu && (
                    <div className={`absolute top-full mt-1 ${isOwn ? 'right-0' : 'left-0'} bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-10 min-w-32`}>
                      <button
                        onClick={handleReply}
                        className="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </button>
                      
                      {isOwn && (
                        <>
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setShowMenu(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Timestamp and edited indicator */}
          <div className={`text-xs text-neutral-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
            {formatTime(message.created_at)}
            {message.is_edited && <span className="ml-1">(edited)</span>}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Delete Message</h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-neutral-600 border border-neutral-300 rounded-lg hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}