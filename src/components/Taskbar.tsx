
import React from 'react';
import { AppConfig } from './OSDesktop';
import { SystemTray } from './SystemTray';
import { LucideIcon } from 'lucide-react';

interface TaskbarProps {
  apps: AppConfig[];
  openWindows: Record<string, any>;
  minimizedWindows: string[];
  currentTime: Date;
  onAppClick: (appId: string) => void;
  onWindowRestore: (windowId: string) => void;
  onNotificationClick: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  apps,
  openWindows,
  minimizedWindows,
  currentTime,
  onAppClick,
  onWindowRestore,
  onNotificationClick
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-14 bg-card/95 backdrop-blur-md border-t border-border shadow-lg flex items-center justify-between px-4">
      {/* App Icons */}
      <div className="flex items-center gap-2">
        {apps.map((app) => {
          const isOpen = Object.values(openWindows).some(window => window.appId === app.id);
          const Icon = app.icon as LucideIcon;
          
          return (
            <button
              key={app.id}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isOpen 
                  ? 'bg-primary/20 border border-primary/30 shadow-sm' 
                  : 'hover:bg-muted/80'
              }`}
              onClick={() => onAppClick(app.id)}
              title={app.title}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      {/* Open Windows */}
      <div className="flex items-center gap-1 flex-1 justify-center max-w-md">
        {Object.entries(openWindows).map(([windowId, windowData]) => {
          const app = apps.find(a => a.id === windowData.appId);
          if (!app) return null;
          
          const isMinimized = minimizedWindows.includes(windowId);
          const Icon = app.icon as LucideIcon;
          
          return (
            <button
              key={windowId}
              className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-all duration-200 max-w-32 ${
                isMinimized 
                  ? 'bg-muted/50 text-muted-foreground border border-border/50' 
                  : 'bg-primary/10 text-foreground hover:bg-primary/20 border border-primary/20'
              }`}
              onClick={() => onWindowRestore(windowId)}
              title={app.title}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{app.title}</span>
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <SystemTray 
        currentTime={currentTime}
        onNotificationClick={onNotificationClick}
      />
    </div>
  );
};
