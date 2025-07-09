
import React, { useState } from 'react';
import { X, Mail, Calendar, Download, CheckCircle } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: Mail,
      title: "New message received",
      message: "Someone visited your portfolio",
      time: "2 min ago",
      type: "info"
    },
    {
      id: 2,
      icon: Download,
      title: "Download complete",
      message: "Resume.pdf downloaded successfully",
      time: "5 min ago",
      type: "success"
    }
  ]);

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-16 right-4 w-80 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold">Notifications</h3>
        <button
          onClick={onClose}
          className="hover:bg-muted p-1 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    notification.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-border">
          <button 
            onClick={clearAllNotifications}
            className="w-full text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
};
