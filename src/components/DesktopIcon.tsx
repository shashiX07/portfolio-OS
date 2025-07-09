
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DesktopIconProps {
  icon: LucideIcon;
  label: string;
  onDoubleClick: () => void;
  style?: React.CSSProperties;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  icon: Icon,
  label,
  onDoubleClick,
  style
}) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer group select-none w-16"
      onDoubleClick={onDoubleClick}
      style={style}
    >
      <div className="relative p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all duration-200 app-icon-shadow group-hover:scale-105">
        <Icon className="w-8 h-8 text-white" />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/20 to-transparent opacity-50" />
      </div>
      <span className="text-xs text-white mt-2 text-center break-words leading-tight shadow-sm">
        {label}
      </span>
    </div>
  );
};
