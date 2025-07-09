
import React from 'react';
import { Monitor, RefreshCw, Settings, Info, Palette } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onRefresh: () => void;
  onChangeWallpaper: () => void;
  onSystemInfo: () => void;
  onDisplaySettings: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  onRefresh,
  onChangeWallpaper,
  onSystemInfo,
  onDisplaySettings
}) => {
  const menuItems = [
    { icon: RefreshCw, label: "Refresh", action: onRefresh },
    { icon: Palette, label: "Change Wallpaper", action: onChangeWallpaper },
    { icon: Settings, label: "Display Settings", action: onDisplaySettings },
    { icon: Info, label: "System Info", action: onSystemInfo }
  ];

  React.useEffect(() => {
    const handleClickOutside = () => onClose();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="fixed bg-card border border-border rounded-lg shadow-lg py-2 z-50 min-w-48"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-3 text-sm transition-colors"
            onClick={() => {
              item.action();
              onClose();
            }}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
