import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { AppWindow } from '../../types';

interface TaskbarProps {
  windows: AppWindow[];
  focusedWindowId: string | null;
  onWindowClick: (id: string) => void;
  onStartClick: () => void;
  isStartMenuOpen: boolean;
}

export const Taskbar: React.FC<TaskbarProps> = ({ windows, focusedWindowId, onWindowClick, onStartClick, isStartMenuOpen }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    // Play immediately on mount (since user clicked Enter O.S.)
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Auto-play prevented', e));
    }
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[30px] xp-taskbar-bg flex items-center justify-between z-[9999] text-white select-none">
      <audio ref={audioRef} loop src="https://raw.githubusercontent.com/heil-kaizen/PokeOS/main/audio/Pok%C3%A9mon%20Season%201_%20Indigo%20League%20-%20Opening%20Theme.mp3" />
      
      <div className="flex h-full items-center flex-1 overflow-hidden">
        {/* Start Button */}
        <button 
          onClick={onStartClick}
          className={`xp-start-btn h-full pl-2 pr-6 flex items-center gap-1.5 font-bold italic drop-shadow-md rounded-r-3xl relative top-0 z-10 ${isStartMenuOpen ? 'opacity-90 shadow-inner' : ''}`}
        >
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-6 h-6 object-contain drop-shadow" style={{ imageRendering: 'pixelated' }} alt="Start" />
          <span className="text-[15px] pr-1 drop-shadow-lg" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>start</span>
        </button>

        {/* Taskbar Items */}
        <div className="flex px-2 gap-1 h-full items-center flex-1 overflow-x-auto ml-1">
          {windows.map(win => (
            win.state !== 'closed' && (
              <button
                key={win.id}
                onClick={() => onWindowClick(win.id)}
                className={`flex items-center gap-1.5 px-2 h-[24px] min-w-[100px] max-w-[150px] rounded-[3px] transition-all text-white ${
                  focusedWindowId === win.id && win.state !== 'minimized'
                    ? 'bg-[#1b439c] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] border border-[#00000040]' 
                    : 'bg-[#3b82f6]/20 hover:bg-[#3b82f6]/40 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.3)] border border-[#ffffff40]'
                }`}
              >
                <img src={win.icon} className="w-[18px] h-[18px] object-contain" style={{ imageRendering: 'pixelated' }} alt="" />
                <span className="text-[11px] truncate">{win.title}</span>
              </button>
            )
          ))}
        </div>
      </div>

      {/* System Tray */}
      <div className="h-full bg-[#0996f1] border-l-2 border-[#0051e0] px-3 flex items-center gap-3 shadow-[inset_1px_0_2px_rgba(255,255,255,0.4)]">
         <div className="flex items-center gap-1 group">
           <button onClick={() => setIsMuted(!isMuted)} className="hover:bg-white/20 p-0.5 rounded transition-colors">
             {isMuted || volume === 0 ? <VolumeX size={14} className="drop-shadow" /> : <Volume2 size={14} className="drop-shadow" />}
           </button>
           <input
             type="range"
             min="0"
             max="1"
             step="0.01"
             value={isMuted ? 0 : volume}
             onChange={(e) => {
               setVolume(parseFloat(e.target.value));
               if (isMuted && parseFloat(e.target.value) > 0) setIsMuted(false);
             }}
             className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hidden group-hover:block"
           />
         </div>
         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" className="w-[18px] h-[18px] drop-shadow" style={{ imageRendering: 'pixelated' }} alt="Tray Icon" />
         <span className="text-[11px] mt-[1px] font-sans drop-shadow font-mono tracking-wider font-bold">{time}</span>
      </div>
    </div>
  );
}
