
import React, { useState, useEffect } from 'react';
import { Monitor, Zap, Wifi, CheckCircle } from 'lucide-react';

interface BootScreenProps {
  onBootComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [bootStage, setBootStage] = useState(0);
  const [progress, setProgress] = useState(0);

  const bootStages = [
    { text: "Initializing system...", icon: Monitor, delay: 800 },
    { text: "Loading portfolio modules...", icon: Zap, delay: 1000 },
    { text: "Connecting to network...", icon: Wifi, delay: 700 },
    { text: "System ready!", icon: CheckCircle, delay: 500 }
  ];

  useEffect(() => {
    let currentStage = 0;
    let progressInterval: NodeJS.Timeout;

    const bootSequence = () => {
      if (currentStage < bootStages.length) {
        setBootStage(currentStage);
        setProgress(0);

        progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              setTimeout(() => {
                currentStage++;
                if (currentStage >= bootStages.length) {
                  setTimeout(onBootComplete, 500);
                } else {
                  bootSequence();
                }
              }, 200);
              return 100;
            }
            return prev + 2;
          });
        }, bootStages[currentStage].delay / 50);
      }
    };

    const timer = setTimeout(bootSequence, 500);
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onBootComplete]);

  const CurrentIcon = bootStages[bootStage]?.icon || Monitor;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center z-[100]">
      <div className="text-center space-y-8 animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full bg-primary/40 animate-ping"></div>
            <CurrentIcon className="w-10 h-10 text-primary absolute inset-0 m-auto animate-bounce" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Portfolio OS</h1>
          <p className="text-xl text-blue-200 animate-pulse">
            {bootStages[bootStage]?.text || "Starting up..."}
          </p>
        </div>

        <div className="w-80 mx-auto space-y-2">
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-primary transition-all duration-100 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-400">{progress}% Complete</p>
        </div>

        <div className="flex justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
