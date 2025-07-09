import React, { useState, useRef, useCallback } from 'react';
import { Taskbar } from './Taskbar';
import { DesktopIcon } from './DesktopIcon';
import { Window } from './Window';
import { BootScreen } from './BootScreen';
import { ContextMenu } from './ContextMenu';
import { NotificationPanel } from './NotificationPanel';
import { AboutApp } from './apps/AboutApp';
import { ProjectsApp } from './apps/ProjectsApp';
import { TerminalApp } from './apps/TerminalApp';
import { ContactApp } from './apps/ContactApp';
import { FileExplorerApp } from './apps/FileExplorerApp';
import { MusicPlayerApp } from './apps/MusicPlayerApp';
import { Monitor, User, Terminal, Mail, Folder, Image, FileText, File, LucideIcon, Music } from 'lucide-react';
import { useDesktopStore } from '../hooks/useDesktopStore';

export interface AppConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  component: React.ComponentType<any>;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
}

const ImageViewer: React.FC<{ windowId: string; imageSrc?: string }> = ({ imageSrc }) => (
  <div className="flex items-center justify-center h-full bg-black">
    <img src={imageSrc || "/placeholder.svg"} alt="Image" className="max-w-full max-h-full object-contain" />
  </div>
);

const TextViewer: React.FC<{ windowId: string; content?: string }> = ({ content }) => (
  <div className="p-4 h-full overflow-auto">
    <pre className="whitespace-pre-wrap font-mono text-sm">{content || "Sample text content..."}</pre>
  </div>
);

const PDFViewer: React.FC<{ windowId: string; pdfSrc?: string }> = ({ pdfSrc }) => (
  <div className="h-full flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <File className="w-16 h-16 mx-auto mb-4 text-red-500" />
      <p className="text-lg font-semibold">PDF Viewer</p>
      <p className="text-sm text-muted-foreground">PDF: {pdfSrc || "sample.pdf"}</p>
      <p className="text-xs text-muted-foreground mt-2">PDF viewing simulation</p>
    </div>
  </div>
);

const apps: AppConfig[] = [
  {
    id: 'about',
    title: 'About Me',
    icon: User,
    component: AboutApp,
    defaultSize: { width: 600, height: 500 },
    minSize: { width: 400, height: 300 }
  },
  {
    id: 'projects',
    title: 'My Projects',
    icon: Monitor,
    component: ProjectsApp,
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 500, height: 400 }
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: Terminal,
    component: TerminalApp,
    defaultSize: { width: 700, height: 450 },
    minSize: { width: 400, height: 300 }
  },
  {
    id: 'contact',
    title: 'Mail Client',
    icon: Mail,
    component: ContactApp,
    defaultSize: { width: 550, height: 500 },
    minSize: { width: 400, height: 350 }
  },
  {
    id: 'files',
    title: 'File Explorer',
    icon: Folder,
    component: FileExplorerApp,
    defaultSize: { width: 650, height: 550 },
    minSize: { width: 450, height: 400 }
  },
  {
    id: 'music-player',
    title: 'Music Player',
    icon: Music,
    component: MusicPlayerApp,
    defaultSize: { width: 450, height: 600 },
    minSize: { width: 350, height: 500 }
  },
  {
    id: 'image-viewer',
    title: 'Image Viewer',
    icon: Image,
    component: ImageViewer,
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 400, height: 300 }
  },
  {
    id: 'text-viewer',
    title: 'Text Editor',
    icon: FileText,
    component: TextViewer,
    defaultSize: { width: 600, height: 400 },
    minSize: { width: 400, height: 300 }
  },
  {
    id: 'pdf-viewer',
    title: 'PDF Viewer',
    icon: File,
    component: PDFViewer,
    defaultSize: { width: 700, height: 600 },
    minSize: { width: 500, height: 400 }
  }
];

const wallpapers = [
  'linear-gradient(135deg, hsl(220 26% 14%) 0%, hsl(217 91% 20%) 100%)',
  'linear-gradient(135deg, hsl(240 26% 14%) 0%, hsl(260 91% 20%) 100%)',
  'linear-gradient(135deg, hsl(200 26% 14%) 0%, hsl(180 91% 20%) 100%)',
  'linear-gradient(135deg, hsl(280 26% 14%) 0%, hsl(300 91% 20%) 100%)',
  'linear-gradient(135deg, hsl(160 26% 14%) 0%, hsl(120 91% 20%) 100%)'
];

export const OSDesktop: React.FC = () => {
  const { 
    openWindows, 
    activeWindow,
    minimizedWindows,
    openWindow, 
    closeWindow, 
    setActiveWindow,
    minimizeWindow,
    restoreWindow
  } = useDesktopStore();

  const desktopRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isBooted, setIsBooted] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBootComplete = useCallback(() => {
    setIsBooted(true);
  }, []);

  const handleDesktopClick = useCallback((e: React.MouseEvent) => {
    if (e.target === desktopRef.current) {
      setActiveWindow(null);
      setContextMenu(null);
      setShowNotifications(false);
    }
  }, [setActiveWindow]);

  const handleDesktopRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (e.target === desktopRef.current) {
      setContextMenu({ x: e.clientX, y: e.clientY });
      setShowNotifications(false);
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === desktopRef.current && e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setContextMenu(null);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleIconDoubleClick = useCallback((appId: string) => {
    openWindow(appId);
  }, [openWindow]);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const handleSystemInfo = useCallback(() => {
    openWindow('about');
  }, [openWindow]);

  const handleChangeWallpaper = useCallback(() => {
    setCurrentWallpaper((prev) => (prev + 1) % wallpapers.length);
  }, []);

  const handleDisplaySettings = useCallback(() => {
    openWindow('about');
  }, [openWindow]);

  const handleNotificationClick = useCallback(() => {
    setShowNotifications(!showNotifications);
  }, [showNotifications]);

  const getNextWindowPosition = (windowId: string) => {
    const existingWindows = Object.keys(openWindows).length;
    const offset = existingWindows * 30;
    return {
      x: 100 + offset,
      y: 100 + offset
    };
  };

  if (!isBooted) {
    return <BootScreen onBootComplete={handleBootComplete} />;
  }

  return (
    <div 
      className="h-screen w-full"
      style={{ background: wallpapers[currentWallpaper] }}
    >
      {/* Desktop Area */}
      <div 
        ref={desktopRef}
        className="relative h-full w-full overflow-hidden desktop-bg select-none"
        onClick={handleDesktopClick}
        onContextMenu={handleDesktopRightClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Desktop Icons */}
        <div className="absolute left-6 top-6 space-y-4">
          {apps.slice(0, 6).map((app, index) => (
            <DesktopIcon
              key={app.id}
              icon={app.icon}
              label={app.title}
              onDoubleClick={() => handleIconDoubleClick(app.id)}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeIn 0.5s ease-out forwards'
              }}
            />
          ))}
        </div>

        {/* Windows */}
        {Object.entries(openWindows).map(([windowId, windowData]) => {
          const app = apps.find(a => a.id === windowData.appId);
          if (!app) return null;

          return (
            <Window
              key={windowId}
              id={windowId}
              title={app.title}
              icon={app.icon}
              initialPosition={getNextWindowPosition(windowId)}
              initialSize={app.defaultSize}
              minSize={app.minSize}
              isActive={activeWindow === windowId}
              isMinimized={minimizedWindows.includes(windowId)}
              onClose={() => closeWindow(windowId)}
              onFocus={() => setActiveWindow(windowId)}
              onMinimize={() => minimizeWindow(windowId)}
            >
              <app.component windowId={windowId} {...(windowData.props || {})} />
            </Window>
          );
        })}

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onRefresh={handleRefresh}
            onChangeWallpaper={handleChangeWallpaper}
            onSystemInfo={handleSystemInfo}
            onDisplaySettings={handleDisplaySettings}
          />
        )}

        {/* Notification Panel */}
        <NotificationPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>

      {/* Taskbar */}
      <Taskbar 
        apps={apps.slice(0, 6)}
        openWindows={openWindows}
        minimizedWindows={minimizedWindows}
        currentTime={currentTime}
        onAppClick={handleIconDoubleClick}
        onWindowRestore={restoreWindow}
        onNotificationClick={handleNotificationClick}
      />
    </div>
  );
};
