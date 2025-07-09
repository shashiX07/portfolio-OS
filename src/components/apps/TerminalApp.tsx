
import React, { useState, useRef, useEffect } from 'react';
import { useDesktopStore } from '../../hooks/useDesktopStore';
import { Maximize, Minimize } from 'lucide-react';

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp?: Date;
}

export const TerminalApp: React.FC<{ windowId: string }> = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to Portfolio Terminal v1.0.0' },
    { type: 'output', content: 'Type "help" to see available commands.' },
    { type: 'output', content: '' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openWindow } = useDesktopStore();

  const commands = {
    help: {
      description: 'Show available commands',
      action: () => [
        'Available commands:',
        '  help       - Show this help message',
        '  about      - Open About Me application',
        '  projects   - Open Projects application',
        '  contact    - Open Mail Client application',
        '  files      - Open File Explorer',
        '  clear      - Clear terminal screen',
        '  fullscreen - Toggle fullscreen mode',
        '  whoami     - Display user information',
        '  date       - Show current date and time',
        '  skills     - List technical skills',
        '  sudo hire-me - Execute hiring process',
        '  ls         - List directory contents',
        '  pwd        - Print working directory',
        '  cat        - Display file contents',
        '  echo       - Display text',
        '  music      - Open music player',
        ''
      ]
    },
    about: {
      description: 'Open About Me application',
      action: () => {
        openWindow('about');
        return ['Opening About Me application...'];
      }
    },
    projects: {
      description: 'Open Projects application',
      action: () => {
        openWindow('projects');
        return ['Opening Projects application...'];
      }
    },
    contact: {
      description: 'Open Mail Client application',
      action: () => {
        openWindow('contact');
        return ['Opening Mail Client...'];
      }
    },
    files: {
      description: 'Open File Explorer',
      action: () => {
        openWindow('files');
        return ['Opening File Explorer...'];
      }
    },
    music: {
      description: 'Open Music Player',
      action: () => {
        openWindow('music-player');
        return ['Opening Music Player...'];
      }
    },
    clear: {
      description: 'Clear terminal screen',
      action: () => {
        setLines([]);
        return [];
      }
    },
    fullscreen: {
      description: 'Toggle fullscreen mode',
      action: () => {
        setIsFullscreen(!isFullscreen);
        return [`Fullscreen mode ${!isFullscreen ? 'enabled' : 'disabled'}`];
      }
    },
    whoami: {
      description: 'Display user information',
      action: () => [
        'Full Stack Developer',
        'React & TypeScript Enthusiast',
        'UI/UX Designer',
        'Problem Solver',
        'Location: ~/portfolio/developer',
        ''
      ]
    },
    date: {
      description: 'Show current date and time',
      action: () => [new Date().toString(), '']
    },
    skills: {
      description: 'List technical skills',
      action: () => [
        'Technical Skills:',
        '  Frontend: React, TypeScript, CSS, HTML',
        '  Backend: Node.js, Python, Express',
        '  Database: PostgreSQL, MongoDB',
        '  Tools: Git, Docker, AWS',
        '  Design: Figma, Adobe Creative Suite',
        ''
      ]
    },
    'sudo hire-me': {
      description: 'Execute hiring process',
      action: () => [
        '[sudo] password for developer: ****',
        'Executing hiring process...',
        'Checking qualifications... ✓',
        'Reviewing portfolio... ✓',
        'Assessing cultural fit... ✓',
        'Running background check... ✓',
        'Calculating salary expectations... ✓',
        '',
        'SUCCESS: All checks passed!',
        'Please contact me to complete the hiring process.',
        'Email: shashi007.iitkgp@gmail.com',
        ''
      ]
    },
    ls: {
      description: 'List directory contents',
      action: () => [
        'total 42',
        'drwxr-xr-x  2 dev dev 4096 Jan  9 15:30 Documents/',
        'drwxr-xr-x  2 dev dev 4096 Jan  9 15:30 Projects/',
        'drwxr-xr-x  2 dev dev 4096 Jan  9 15:30 Music/',
        'drwxr-xr-x  2 dev dev 4096 Jan  9 15:30 Images/',
        '-rw-r--r--  1 dev dev 2048 Jan  9 15:30 resume.pdf',
        '-rw-r--r--  1 dev dev 1024 Jan  9 15:30 portfolio.md',
        '-rw-r--r--  1 dev dev  512 Jan  9 15:30 contact.txt',
        ''
      ]
    },
    pwd: {
      description: 'Print working directory',
      action: () => ['/home/developer/portfolio', '']
    },
    cat: {
      description: 'Display file contents',
      action: (args: string[]) => {
        const filename = args[0];
        if (!filename) {
          return ['cat: missing file operand', 'Try "cat filename"', ''];
        }
        
        switch (filename) {
          case 'contact.txt':
            return [
              'Contact Information:',
              'Email: shashi007.iitkgp@gmail.com',
              'LinkedIn: https://www.linkedin.com/in/shashikant-4b8bb2325/',
              'GitHub: github.com/shashix07',
              ''
            ];
          case 'resume.pdf':
            return ['Error: Cannot display binary file', 'Use a PDF viewer to open this file', ''];
          case 'portfolio.md':
            return [
              '# My Portfolio',
              '',
              'Welcome to my portfolio website!',
              'This is a web-based operating system showcasing my work.',
              '',
              '## Features',
              '- Interactive desktop environment',
              '- Multiple applications',
              '- File system simulation',
              ''
            ];
          default:
            return [`cat: ${filename}: No such file or directory`, ''];
        }
      }
    },
    echo: {
      description: 'Display text',
      action: (args: string[]) => {
        if (args.length === 0) {
          return [''];
        }
        return [args.join(' '), ''];
      }
    }
  };

  const executeCommand = (input: string) => {
    const trimmedInput = input.trim();
    const [command, ...args] = trimmedInput.split(' ');
    
    // Add input to lines
    const newLines = [...lines, { type: 'input' as const, content: `$ ${trimmedInput}` }];
    
    if (command === '') {
      setLines([...newLines, { type: 'output' as const, content: '' }]);
      return;
    }
    
    // Handle 'sudo hire-me' as a special case
    if (trimmedInput === 'sudo hire-me') {
      const commandAction = commands['sudo hire-me'].action;
      const output = commandAction();
      const outputLines = output.map(line => ({ type: 'output' as const, content: line }));
      setLines([...newLines, ...outputLines]);
    } else if (commands[command as keyof typeof commands]) {
      const commandData = commands[command as keyof typeof commands];
      const output = commandData.action(args);
      const outputLines = output.map(line => ({ type: 'output' as const, content: line }));
      setLines([...newLines, ...outputLines]);
    } else {
      setLines([
        ...newLines,
        { type: 'error' as const, content: `Command not found: ${command}` },
        { type: 'output' as const, content: 'Type "help" to see available commands.' },
        { type: 'output' as const, content: '' }
      ]);
    }
    
    // Add to command history
    if (trimmedInput) {
      setCommandHistory(prev => [...prev, trimmedInput]);
    }
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div 
      className={`h-full bg-black text-green-400 font-mono text-sm overflow-hidden flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-[9999]' : ''
      }`}
      onClick={() => inputRef.current?.focus()}
    >
      {isFullscreen && (
        <div className="flex justify-end p-2">
          <button
            onClick={() => setIsFullscreen(false)}
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            <Minimize className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <div 
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 custom-scrollbar"
      >
        {lines.map((line, index) => (
          <div key={index} className={`whitespace-pre-wrap ${
            line.type === 'input' ? 'text-white' :
            line.type === 'error' ? 'text-red-400' :
            'text-green-400'
          }`}>
            {line.content}
          </div>
        ))}
        
        <div className="flex items-center text-white">
          <span className="text-green-400">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white ml-1"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="animate-pulse">▊</span>
        </div>
      </div>
      
      {!isFullscreen && (
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setIsFullscreen(true)}
            className="text-green-400 hover:text-green-300 transition-colors opacity-50 hover:opacity-100"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
