import React, { useState } from 'react';
import { motion, useDragControls } from 'motion/react';
import { X } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  icon: string;
  isActive: boolean;
  zIndex: number;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  children: React.ReactNode;
  width?: number;
  height?: number;
}

export const Window: React.FC<WindowProps> = ({
  id, title, icon, isActive, zIndex, onClose, onMinimize, onFocus, children, width = 600, height = 400
}) => {
  const dragControls = useDragControls();
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <motion.div
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.95, x: 80, y: 80 }}
      animate={{ opacity: 1, scale: 1, ...(isMaximized ? { x: 0, y: 0, width: '100vw', height: 'calc(100vh - 30px)' } : { width, height }) }}
      onPointerDown={() => onFocus(id)}
      style={{ zIndex }}
      className={`absolute top-0 left-0 bg-[#ece9d8] xp-border flex flex-col shadow-2xl overflow-hidden ${!isActive ? 'opacity-90' : ''}`}
    >
      {/* Title Bar */}
      <div 
        className={`${isActive ? 'xp-window-bg' : 'xp-window-bg-inactive'} flex justify-between items-center p-[2px] cursor-grab active:cursor-grabbing text-white rounded-t-[6px] h-[30px]`}
        onPointerDown={(e) => {
          onFocus(id);
          if (!isMaximized) {
            dragControls.start(e);
          }
        }}
        onDoubleClick={() => setIsMaximized(!isMaximized)}
      >
        <div className="flex items-center gap-1.5 pl-1 font-bold text-[13px] tracking-wide drop-shadow-md">
          <img src={icon} alt="icon" className="w-[18px] h-[18px] object-contain drop-shadow" style={{ imageRendering: 'pixelated' }} />
          {title}
        </div>
        <div className="flex gap-[2px] pr-[2px]">
          <button onPointerDown={(e) => e.stopPropagation()} onClick={() => onMinimize(id)} className="xp-min-max-btn w-[21px] h-[21px] flex flex-col items-center justify-end pb-[4px] text-white">
            <span className="w-2 h-0.5 bg-white shadow-sm" />
          </button>
          <button onPointerDown={(e) => e.stopPropagation()} onClick={() => setIsMaximized(!isMaximized)} className="xp-min-max-btn w-[21px] h-[21px] flex items-center justify-center text-white">
             {isMaximized ? (
               <div className="relative w-[11px] h-[10px]">
                 <div className="absolute top-0 right-0 w-[8px] h-[7px] border-[2px] border-white shadow-sm border-t-[3px]" />
                 <div className="absolute bottom-0 left-0 w-[8px] h-[7px] border-[2px] border-white shadow-sm border-t-[3px] bg-[#3c813f]" />
               </div>
             ) : (
               <div className="w-[11px] h-[10px] border-[2px] border-white shadow-sm border-t-[3px]" />
             )}
          </button>
          <button onPointerDown={(e) => e.stopPropagation()} onClick={() => onClose(id)} className="xp-close-btn w-[21px] h-[21px] flex items-center justify-center text-white">
            <X size={16} strokeWidth={2.5} className="drop-shadow-sm" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 bg-white border border-[#716f64] m-[3px] border-b-[2px] border-r-[2px] overflow-auto flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}
