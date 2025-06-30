import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useNotifications } from '../../context/AppContext';

export default function Toast() {
  const { notifications, removeNotification } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
          getIcon={getIcon}
          getBackgroundColor={getBackgroundColor}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  notification: any;
  onRemove: (id: string) => void;
  getIcon: (type: string) => React.ReactNode;
  getBackgroundColor: (type: string) => string;
}

function ToastItem({ notification, onRemove, getIcon, getBackgroundColor }: ToastItemProps) {
  useEffect(() => {
    // Auto-remove after 30 seconds
    const timer = setTimeout(() => {
      onRemove(notification.id);
    }, 30000);

    return () => clearTimeout(timer);
  }, [notification.id, onRemove]);

  return (
    <div
      className={`flex items-center space-x-3 p-4 rounded-lg border shadow-lg max-w-sm animate-slide-up ${getBackgroundColor(notification.type)}`}
    >
      {getIcon(notification.type)}
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-900">
          {notification.message}
        </p>
      </div>
      <button
        onClick={() => onRemove(notification.id)}
        className="text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}