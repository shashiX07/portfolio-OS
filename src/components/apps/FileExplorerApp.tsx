import React, { useState } from 'react';
import { Folder, File, Image, FileText, Download, FolderOpen, Music } from 'lucide-react';
import { useDesktopStore } from '../../hooks/useDesktopStore';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon: React.ElementType;
  size?: string;
  modified: string;
  path: string;
  downloadUrl?: string;
  fileType?: 'image' | 'pdf' | 'text' | 'music';
  content?: string;
}

export const FileExplorerApp: React.FC<{ windowId: string }> = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { openWindow } = useDesktopStore();

  const fileSystem: Record<string, FileItem[]> = {
    '/': [
      { id: '1', name: 'Documents', type: 'folder', icon: Folder, modified: '2 days ago', path: '/Documents' },
      { id: '2', name: 'Projects', type: 'folder', icon: Folder, modified: '1 day ago', path: '/Projects' },
      { id: '3', name: 'Images', type: 'folder', icon: Folder, modified: '3 hours ago', path: '/Images' },
      { id: '4', name: 'Music', type: 'folder', icon: Folder, modified: '1 hour ago', path: '/Music' },
      { id: '5', name: 'Resume.pdf', type: 'file', icon: FileText, size: '245 KB', modified: '1 week ago', path: '/Resume.pdf', fileType: 'pdf', downloadUrl: 'data:application/pdf;base64,sample-pdf-data' },
      { id: '6', name: 'Cover_Letter.pdf', type: 'file', icon: FileText, size: '189 KB', modified: '1 week ago', path: '/Cover_Letter.pdf', fileType: 'pdf', downloadUrl: 'data:application/pdf;base64,sample-pdf-data' }
    ],
    '/Documents': [
      { id: '7', name: 'Certificates', type: 'folder', icon: Folder, modified: '2 weeks ago', path: '/Documents/Certificates' },
      { id: '8', name: 'Notes.txt', type: 'file', icon: File, size: '12 KB', modified: '3 days ago', path: '/Documents/Notes.txt', fileType: 'text', content: 'Sample notes content...\nThis is a text file with some content.' },
      { id: '9', name: 'Project_Ideas.md', type: 'file', icon: FileText, size: '8 KB', modified: '1 day ago', path: '/Documents/Project_Ideas.md', fileType: 'text', content: '# Project Ideas\n\n## Web Development\n- Portfolio website\n- E-commerce platform\n\n## Mobile Apps\n- Task manager\n- Weather app' }
    ],
    '/Projects': [
      { id: '10', name: 'E-Commerce-App', type: 'folder', icon: FolderOpen, modified: '1 day ago', path: '/Projects/Niblie - Web Extension' },
      { id: '11', name: 'Weather-Dashboard', type: 'folder', icon: FolderOpen, modified: '3 days ago', path: '/Projects/Expense Tracker' },
      { id: '12', name: 'Task-Manager', type: 'folder', icon: FolderOpen, modified: '1 week ago', path: '/Projects/NixOS' }
    ],
    '/Images': [
      { id: '13', name: 'Screenshots', type: 'folder', icon: Folder, modified: '2 hours ago', path: '/Images/Screenshots' },
      { id: '14', name: 'profile.jpg', type: 'file', icon: Image, size: '856 KB', modified: '1 month ago', path: '/Images/profile.jpg', fileType: 'image', downloadUrl: 'images/profile.jpg' },
      { id: '15', name: 'cutie.png', type: 'file', icon: Image, size: '2.1 MB', modified: '2 weeks ago', path: '/Images/cutie.png', fileType: 'image', downloadUrl: 'images/cutie.png' },
      { id: '16', name: 'nature.jpg', type: 'file', icon: Image, size: '1.5 MB', modified: '1 week ago', path: '/Images/nature.jpg', fileType: 'image', downloadUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' }
    ],
    '/Music': [
      { id: '17', name: 'Heat Waves.mp3', type: 'file', icon: Music, size: '3.2 MB', modified: '2 days ago', path: '/Music/Heat_Waves.mp3', fileType: 'music', downloadUrl: 'audio/heat-waves.mp3' },
      { id: '18', name: 'Copines.mp3', type: 'file', icon: Music, size: '4.8 MB', modified: '1 day ago', path: '/Music/Copines.mp3', fileType: 'music', downloadUrl: 'audio/copines.mp3' },
      { id: '19', name: 'Closers.mp3', type: 'file', icon: Music, size: '4.1 MB', modified: '3 hours ago', path: '/Music/Closers.mp3', fileType: 'music', downloadUrl: 'audio/closers.mp3' },
      { id: '20', name: 'Maiyya.mp3', type: 'file', icon: Music, size: '2.9 MB', modified: '1 hour ago', path: '/Music/Maiyya.mp3', fileType: 'music', downloadUrl: 'audio/maiyya.mp3' },
      { id: '21', name: 'Mere Saamne wali khidki.mp3', type: 'file', icon: Music, size: '3.1 MB', modified: '30 minutes ago', path: '/Music/Mere_Saamne_wali_khidki.mp3', fileType: 'music', downloadUrl: 'audio/meresaamnewalikhidki.mp3' }
    ],
    '/Documents/Certificates': [
            { id: '22', name: 'Frontend Developer Intern.pdf', type: 'file', icon: FileText, size: '500 KB', modified: '1 month ago', path: '/Documents/Certificates/shashikant_intership.pdf', fileType: 'pdf', downloadUrl: 'Documents/shashikant_intership.pdf' },
      { id: '23', name: 'RCA Appreciation cirtificate.png', type: 'file', icon: Image, size: '600 KB', modified: '2 months ago', path: '/Documents/Certificates/appreciation_certificate.png', fileType: 'image', downloadUrl: 'images/appreciation_certificate.png' }
    ]
  };

  const currentFiles = fileSystem[currentPath] || [];

  const navigateToFolder = (path: string) => {
    setCurrentPath(path);
    setSelectedItem(null);
  };

  const navigateUp = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    const newPath = pathParts.length > 0 ? '/' + pathParts.join('/') : '/';
    setCurrentPath(newPath);
    setSelectedItem(null);
  };

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      navigateToFolder(item.path);
    } else {
      setSelectedItem(item.id);
    }
  };

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      navigateToFolder(item.path);
    } else if (item.type === 'file') {
      switch (item.fileType) {
        case 'image':
          openWindow('image-viewer', { imageSrc: item.downloadUrl });
          break;
        case 'pdf':
          console.log('Opening PDF with:', { pdfSrc: item.downloadUrl, fileName: item.name }); // Debug
          openWindow('pdf-viewer', { pdfSrc: item.downloadUrl, fileName: item.name });
          break;
        case 'text':
          openWindow('text-viewer', { content: item.content });
          break;
        case 'music':
          openWindow('music-player');
          break;
        default:
          console.log('Opening file:', item.name);
      }
    }
  };

  const handleDownload = (item: FileItem) => {
    if (item.downloadUrl && item.downloadUrl !== '#') {
      if (item.fileType === 'image') {
        // For images, open in new tab
        window.open(item.downloadUrl, '_blank');
      } else {
        // For other files, create download link
        const link = document.createElement('a');
        link.href = item.downloadUrl;
        link.download = item.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      console.log('Downloaded:', item.name);
    } else {
      console.log('Download not available for:', item.name);
    }
  };

  const getPathBreadcrumbs = () => {
    if (currentPath === '/') return ['Home'];
    const parts = currentPath.split('/').filter(Boolean);
    return ['Home', ...parts];
  };

  return (
    <div className="h-full flex flex-col">
      {/* Navigation Bar */}
      <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/20">
        <button
          onClick={navigateUp}
          disabled={currentPath === '/'}
          className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          {getPathBreadcrumbs().map((part, index, array) => (
            <React.Fragment key={index}>
              <span className={index === array.length - 1 ? 'text-foreground font-medium' : ''}>
                {part}
              </span>
              {index < array.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="p-4">
          <div className="grid gap-1">
            {currentFiles.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedItem === item.id 
                      ? 'bg-primary/20 border border-primary/30' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleItemClick(item)}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon className={`w-5 h-5 ${
                      item.type === 'folder' ? 'text-blue-500' :
                      item.fileType === 'image' ? 'text-green-500' :
                      item.fileType === 'music' ? 'text-purple-500' :
                      item.fileType === 'pdf' ? 'text-red-500' :
                      'text-muted-foreground'
                    }`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.size && `${item.size} • `}Modified {item.modified}
                      </div>
                    </div>
                  </div>

                  {item.type === 'file' && item.downloadUrl && (
                    <button
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item);
                      }}
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {currentFiles.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>This folder is empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-border bg-muted/20 text-xs text-muted-foreground">
        {currentFiles.length} item{currentFiles.length !== 1 ? 's' : ''}
        {selectedItem && (
          <span className="ml-4">
            Selected: {currentFiles.find(f => f.id === selectedItem)?.name}
          </span>
        )}
      </div>
    </div>
  );
};
