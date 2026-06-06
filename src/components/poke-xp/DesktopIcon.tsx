import React, { useState } from 'react';

interface DesktopIconProps {
  icon: string;
  title: string;
  onDoubleClick: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, title, onDoubleClick }) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div 
      className={`w-24 flex flex-col items-center justify-start py-2 px-1 rounded-[3px] border border-transparent cursor-pointer group ${isSelected ? 'bg-[#0b58d6]/50 border-white/30' : 'hover:bg-white/10'}`}
      onDoubleClick={() => {
        setIsSelected(false);
        onDoubleClick();
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsSelected(true);
      }}
    >
      <img 
        src={icon} 
        alt={title} 
        className={`w-16 h-16 object-contain drop-shadow-md group-hover:opacity-90 ${isSelected ? 'opacity-80 mix-blend-luminosity' : ''}`} 
        style={{ imageRendering: 'pixelated' }} 
      />
      <span 
        className={`text-white text-xs font-medium font-sans mt-2 text-center leading-tight [text-shadow:_0_1px_2px_rgb(0_0_0_/_100%)] ${isSelected ? 'bg-[#0b58d6] px-1' : ''}`}
      >
        {title}
      </span>
    </div>
  );
}
