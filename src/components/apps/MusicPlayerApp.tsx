import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  file: string;
}

const sampleTracks: Track[] = [
  { id: '1', title: 'Heat Waves', artist: 'Glass Animals', duration: '3:58', file: '/audio/heat-waves.mp3' },
  { id: '2', title: 'Copines', artist: 'Aya Nakamura', duration: '2:50', file: '/audio/copines.mp3' },
  { id: '3', title: 'Closers', artist: 'The Chainsmokers', duration: '4:09', file: '/audio/closers.mp3' },
  { id: '4', title: 'Maiyya', artist: 'Sachet-Parampara', duration: '3:34', file: '/audio/maiyya.mp3' },
  { id: '5', title: 'Mere Saamne wali khidki', artist: 'RB-Burman', duration: '2:52', file: '/audio/meresaamnewalikhidki.m4a' }
];

export const MusicPlayerApp: React.FC<{ windowId: string }> = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(sampleTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load audio when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      setIsLoading(true);
      audioRef.current.src = currentTrack.file;
      audioRef.current.load();
    }
  }, [currentTrack]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      console.error('Error loading audio file:', currentTrack?.file);
    };

    // Keep audio playing when page visibility changes
    const handleVisibilityChange = () => {
      if (isPlaying && audio && audio.paused) {
        audio.play().catch(console.error);
      }
    };

    // Prevent audio from being paused by focus changes
    const handlePageHide = () => {
      if (isPlaying && audio) {
        // Force audio to continue playing
        setTimeout(() => {
          if (audio.paused && isPlaying) {
            audio.play().catch(console.error);
          }
        }, 100);
      }
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('blur', handlePageHide);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('blur', handlePageHide);
    };
  }, [currentTrack, isRepeat, isPlaying]);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current || !currentTrack) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsLoading(false);
    }
  };

  const playTrack = async (track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    
    // Auto-play the new track if music was already playing
    if (isPlaying) {
      setTimeout(async () => {
        if (audioRef.current) {
          try {
            await audioRef.current.play();
          } catch (error) {
            console.error('Error auto-playing new track:', error);
          }
        }
      }, 100); // Small delay to ensure audio is loaded
    }
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    let nextIndex;
    
    if (isShuffle) {
      do {
        nextIndex = Math.floor(Math.random() * sampleTracks.length);
      } while (nextIndex === sampleTracks.findIndex(t => t.id === currentTrack.id) && sampleTracks.length > 1);
    } else {
      const currentIndex = sampleTracks.findIndex(t => t.id === currentTrack.id);
      nextIndex = (currentIndex + 1) % sampleTracks.length;
    }
    
    playTrack(sampleTracks[nextIndex]);
  };

  const prevTrack = () => {
    if (!currentTrack) return;
    const currentIndex = sampleTracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? sampleTracks.length - 1 : currentIndex - 1;
    playTrack(sampleTracks[prevIndex]);
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    seekTo(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Music Player</h1>
        <p className="text-gray-300">Your personal music collection</p>
      </div>

      {/* Current Track Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-48 h-48 bg-gradient-to-br from-pink-500 to-violet-500 rounded-lg mb-6 flex items-center justify-center relative">
          {isLoading ? (
            <div className="animate-spin text-4xl">⏳</div>
          ) : (
            <div className="text-6xl">🎵</div>
          )}
        </div>
        
        {currentTrack && (
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-1">{currentTrack.title}</h2>
            <p className="text-gray-300">{currentTrack.artist}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full max-w-md mb-6">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div 
            className="w-full bg-gray-700 rounded-full h-2 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="bg-gradient-to-r from-pink-500 to-violet-500 h-2 rounded-full transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2 rounded-full transition-colors ${
              isShuffle ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-5 h-5" />
          </button>
          
          <button
            onClick={prevTrack}
            className="p-3 text-gray-300 hover:text-white transition-colors"
            title="Previous track"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="p-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="animate-spin text-lg">⏳</div>
              </div>
            ) : isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8" />
            )}
          </button>
          
          <button
            onClick={nextTrack}
            className="p-3 text-gray-300 hover:text-white transition-colors"
            title="Next track"
          >
            <SkipForward className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`p-2 rounded-full transition-colors ${
              isRepeat ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Repeat"
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 mb-6">
          <Volume2 className="w-5 h-5 text-gray-300" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-violet-500"
            title="Volume"
          />
          <span className="text-xs text-gray-400 w-8">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      {/* Playlist */}
      <div className="border-t border-gray-700 p-4">
        <h3 className="text-lg font-semibold mb-3">Playlist</h3>
        <div className="max-h-40 overflow-auto custom-scrollbar">
          {sampleTracks.map((track) => (
            <div
              key={track.id}
              onClick={() => playTrack(track)}
              className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                currentTrack?.id === track.id 
                  ? 'bg-violet-600/30 border border-violet-500' 
                  : 'hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {currentTrack?.id === track.id && isPlaying && (
                  <div className="w-3 h-3 flex items-center justify-center">
                    <div className="text-xs animate-pulse">♪</div>
                  </div>
                )}
                <div>
                  <div className="font-medium text-sm">{track.title}</div>
                  <div className="text-xs text-gray-400">{track.artist}</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">{track.duration}</div>
            </div>
          ))}
        </div>
      </div>

      <audio 
        ref={audioRef} 
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={(e) => {
          // Prevent unwanted pausing - only pause if user explicitly paused
          if (!e.isTrusted || document.hidden) {
            return;
          }
          setIsPlaying(false);
        }}
        onSuspend={(e) => {
          // Prevent browser from suspending audio
          e.preventDefault();
          if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(console.error);
          }
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
};