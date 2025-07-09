
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Minus, Square, LucideIcon } from 'lucide-react';
import { useDesktopStore } from '../hooks/useDesktopStore';

interface WindowProps {
  id: string;
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  minSize: { width: number; height: number };
  isActive: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
}

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  icon: Icon,
  children,
  initialPosition,
  initialSize,
  minSize,
  isActive,
  isMinimized,
  onClose,
  onFocus,
  onMinimize
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeState, setPreMaximizeState] = useState({
    position: initialPosition,
    size: initialSize
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const windowRef = useRef<HTMLDivElement>(null);
  const { updateWindowPosition, updateWindowSize } = useDesktopStore();

  const handleMaximize = useCallback(() => {
    if (isMaximized) {
      // Restore
      setPosition(preMaximizeState.position);
      setSize(preMaximizeState.size);
      setIsMaximized(false);
      updateWindowPosition(id, preMaximizeState.position);
      updateWindowSize(id, preMaximizeState.size);
    } else {
      // Maximize
      setPreMaximizeState({ position, size });
      const newPosition = { x: 0, y: 0 };
      const newSize = { 
        width: window.innerWidth, 
        height: window.innerHeight - 56 // Account for taskbar
      };
      setPosition(newPosition);
      setSize(newSize);
      setIsMaximized(true);
      updateWindowPosition(id, newPosition);
      updateWindowSize(id, newSize);
    }
  }, [isMaximized, position, size, preMaximizeState, id, updateWindowPosition, updateWindowSize]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && !e.currentTarget.contains(e.target as Node)) return;
    if (isMaximized) return; // Prevent dragging when maximized
    
    e.preventDefault();
    onFocus();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position, onFocus, isMaximized]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return; // Prevent resizing when maximized
    
    e.preventDefault();
    e.stopPropagation();
    onFocus();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  }, [size, onFocus, isMaximized]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        const newPosition = {
          x: Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStart.x)),
          y: Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragStart.y))
        };
        setPosition(newPosition);
        updateWindowPosition(id, newPosition);
      } else if (isResizing && !isMaximized) {
        const newWidth = Math.max(minSize.width, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(minSize.height, resizeStart.height + (e.clientY - resizeStart.y));
        const newSize = { width: newWidth, height: newHeight };
        setSize(newSize);
        updateWindowSize(id, newSize);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, minSize, size.width, id, updateWindowPosition, updateWindowSize, isMaximized]);

  if (isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className={`absolute bg-card border border-border rounded-lg window-shadow transition-all duration-200 ${
        isActive ? 'z-50' : 'z-40'
      } ${isDragging || isResizing ? 'select-none' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        opacity: isActive ? 1 : 0.95
      }}
      onMouseDown={onFocus}
    >
      {/* Window Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-window-header rounded-t-lg border-b border-border cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="font-medium text-sm">{title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            className="w-6 h-6 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center transition-colors"
            onClick={onMinimize}
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            className="w-6 h-6 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors"
            onClick={handleMaximize}
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
            onClick={onClose}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-full pb-12 overflow-hidden">
        <div className="h-full overflow-auto custom-scrollbar">
          {children}
        </div>
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="absolute bottom-1 right-1 w-0 h-0 border-l-4 border-b-4 border-l-transparent border-b-muted-foreground opacity-50" />
        </div>
      )}
    </div>
  );
};
