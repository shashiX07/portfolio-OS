
import { create } from 'zustand';

interface WindowData {
  appId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  props?: Record<string, any>;
}

interface DesktopStore {
  openWindows: Record<string, WindowData>;
  activeWindow: string | null;
  minimizedWindows: string[];
  openWindow: (appId: string, props?: Record<string, any>) => void;
  closeWindow: (windowId: string) => void;
  setActiveWindow: (windowId: string | null) => void;
  minimizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, position: { x: number; y: number }) => void;
  updateWindowSize: (windowId: string, size: { width: number; height: number }) => void;
}

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  openWindows: {},
  activeWindow: null,
  minimizedWindows: [],

  openWindow: (appId: string, props?: Record<string, any>) => {
    const existingWindow = Object.entries(get().openWindows).find(([_, data]) => data.appId === appId);
    
    if (existingWindow) {
      // Window already exists, just focus it and restore if minimized
      const [windowId] = existingWindow;
      set(state => ({
        activeWindow: windowId,
        minimizedWindows: state.minimizedWindows.filter(id => id !== windowId)
      }));
      return;
    }

    // Create new window
    const windowId = `${appId}-${Date.now()}`;
    const existingCount = Object.keys(get().openWindows).length;
    
    set(state => ({
      openWindows: {
        ...state.openWindows,
        [windowId]: {
          appId,
          position: { x: 100 + existingCount * 30, y: 100 + existingCount * 30 },
          size: { width: 600, height: 500 },
          props
        }
      },
      activeWindow: windowId,
      minimizedWindows: state.minimizedWindows.filter(id => id !== windowId)
    }));
  },

  closeWindow: (windowId: string) => {
    set(state => {
      const newOpenWindows = { ...state.openWindows };
      delete newOpenWindows[windowId];
      
      const newActiveWindow = state.activeWindow === windowId 
        ? Object.keys(newOpenWindows)[0] || null 
        : state.activeWindow;

      return {
        openWindows: newOpenWindows,
        activeWindow: newActiveWindow,
        minimizedWindows: state.minimizedWindows.filter(id => id !== windowId)
      };
    });
  },

  setActiveWindow: (windowId: string | null) => {
    set({ activeWindow: windowId });
  },

  minimizeWindow: (windowId: string) => {
    set(state => ({
      minimizedWindows: [...state.minimizedWindows, windowId],
      activeWindow: state.activeWindow === windowId 
        ? Object.keys(state.openWindows).find(id => id !== windowId) || null 
        : state.activeWindow
    }));
  },

  restoreWindow: (windowId: string) => {
    set(state => ({
      minimizedWindows: state.minimizedWindows.filter(id => id !== windowId),
      activeWindow: windowId
    }));
  },

  updateWindowPosition: (windowId: string, position: { x: number; y: number }) => {
    set(state => ({
      openWindows: {
        ...state.openWindows,
        [windowId]: {
          ...state.openWindows[windowId],
          position
        }
      }
    }));
  },

  updateWindowSize: (windowId: string, size: { width: number; height: number }) => {
    set(state => ({
      openWindows: {
        ...state.openWindows,
        [windowId]: {
          ...state.openWindows[windowId],
          size
        }
      }
    }));
  }
}));
