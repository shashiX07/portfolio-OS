
import React, { useState, useEffect } from 'react';
import { Battery, Wifi, Bell, Volume2 } from 'lucide-react';

interface SystemTrayProps {
  currentTime: Date;
  onNotificationClick: () => void;
}

export const SystemTray: React.FC<SystemTrayProps> = ({ currentTime, onNotificationClick }) => {
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [networkSpeed, setNetworkSpeed] = useState(0);
  const [notifications, setNotifications] = useState(2);

  useEffect(() => {
    // Simulate network activity
    const networkInterval = setInterval(() => {
      setNetworkSpeed(Math.floor(Math.random() * 100 + 20));
    }, 2000);

    // Simulate battery drain
    const batteryInterval = setInterval(() => {
      setBatteryLevel(prev => Math.max(20, prev - Math.random() * 0.1));
    }, 30000);

    return () => {
      clearInterval(networkInterval);
      clearInterval(batteryInterval);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getBatteryColor = () => {
    if (batteryLevel > 50) return 'text-green-500';
    if (batteryLevel > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex items-center gap-4">
      {/* Network Speed */}
      <div className="flex items-center gap-1 text-xs">
        <Wifi className="w-4 h-4" />
        <span>{networkSpeed} Mbps</span>
      </div>

      {/* Battery */}
      <div className="flex items-center gap-1 text-xs">
        <Battery className={`w-4 h-4 ${getBatteryColor()}`} />
        <span>{Math.round(batteryLevel)}%</span>
      </div>

      {/* Volume */}
      <Volume2 className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />

      {/* Notifications */}
      <button
        onClick={onNotificationClick}
        className="relative hover:bg-white/10 p-1 rounded transition-colors"
      >
        <Bell className="w-4 h-4" />
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {notifications}
          </span>
        )}
      </button>

      {/* Time */}
      <div className="text-right text-xs">
        <div className="font-medium">{formatTime(currentTime)}</div>
        <div className="text-muted-foreground">{formatDate(currentTime)}</div>
      </div>
    </div>
  );
};
