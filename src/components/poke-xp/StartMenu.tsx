import React, { useEffect, useRef } from 'react';
import { AppWindow } from '../../types';

interface StartMenuProps {
  isOpen: boolean;
  onAppClick: (opts: Partial<AppWindow>) => void;
  onClose: () => void;
  onShutdown?: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onAppClick, onClose, onShutdown }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking the start button
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && !(event.target as Element).closest('.xp-start-btn')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute bottom-[30px] left-0 w-[320px] h-[450px] bg-white border border-[#0055eb] rounded-tr-[6px] shadow-[2px_2px_10px_rgba(0,0,0,0.5)] flex flex-col z-[10000] select-none"
    >
      {/* User Header */}
      <div className="h-[55px] bg-gradient-to-r from-[#0036b1] to-[#015add] rounded-tr-[5px] flex items-center px-3 gap-3 border-b-2 border-orange-500 shadow-sm relative">
        <div className="w-[42px] h-[42px] bg-white rounded flex items-center justify-center p-0.5 border-2 border-white/60 shadow-md">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png" className="w-[36px] h-[36px] object-cover" style={{ imageRendering: 'pixelated' }} alt="Trainer" />
        </div>
        <span className="text-white font-bold text-[15px] drop-shadow">Trainer Red</span>
      </div>

      <div className="flex-1 flex">
        {/* Left Column (Apps) */}
        <div className="flex-1 bg-white flex flex-col py-2 px-1 gap-1 border-r border-[#b0cfff]">
          
          <button 
            className="flex items-center gap-3 py-2 px-2 hover:bg-[#3b82f6] hover:text-white rounded-[3px] text-left group"
            onClick={() => {
              onAppClick({ id: 'pokedex', title: 'Pokédex', component: 'Pokedex', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', width: 650, height: 450 });
              onClose();
            }}
          >
            <div className="w-[32px] h-[32px] flex items-center justify-center">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-[28px] h-[28px] drop-shadow-sm group-hover:drop-shadow-none" style={{ imageRendering: 'pixelated' }} alt="Pokedex" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-[#333] group-hover:text-white">Pokédex</span>
              <span className="text-[10px] text-gray-500 group-hover:text-white/80">Encyclopedia</span>
            </div>
          </button>

          <button 
            className="flex items-center gap-3 py-2 px-2 hover:bg-[#3b82f6] hover:text-white rounded-[3px] text-left group"
            onClick={() => {
              onAppClick({ id: 'paint', title: 'Paint', component: 'Paint', icon: 'https://raw.githubusercontent.com/heil-kaizen/PokeOS/main/assets/paint.webp', width: 600, height: 400 });
              onClose();
            }}
          >
            <div className="w-[32px] h-[32px] flex items-center justify-center">
              <img src="https://raw.githubusercontent.com/heil-kaizen/PokeOS/main/assets/paint.webp" className="w-[28px] h-[28px] drop-shadow-sm group-hover:drop-shadow-none" style={{ imageRendering: 'pixelated' }} alt="Paint" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-[#333] group-hover:text-white">Paint</span>
              <span className="text-[10px] text-gray-500 group-hover:text-white/80">Draw stuff</span>
            </div>
          </button>

          <div className="my-1 border-t border-[#dcdcdc] mx-2" />

          <button 
            className="flex items-center gap-3 py-2 px-2 hover:bg-[#3b82f6] hover:text-white rounded-[3px] text-left group"
            onClick={() => {
              onAppClick({ id: 'pc', title: 'Ash\'s PC', component: 'PCBox', icon: 'https://raw.githubusercontent.com/heil-kaizen/PokeOS/main/assets/The-PC.webp' });
              onClose();
            }}
          >
            <div className="w-[32px] h-[32px] flex items-center justify-center">
              <img src="https://raw.githubusercontent.com/heil-kaizen/PokeOS/main/assets/The-PC.webp" className="w-[24px] h-[24px] drop-shadow-sm group-hover:drop-shadow-none" style={{ imageRendering: 'pixelated' }} alt="PC" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-[#333] group-hover:text-white">Ash's PC</span>
              <span className="text-[10px] text-gray-500 group-hover:text-white/80">My Computer</span>
            </div>
          </button>
        </div>

        {/* Right Column (Folders/Actions) */}
        <div className="w-[120px] bg-[#d3e5fa] flex flex-col p-2 gap-1 border-l border-white shadow-[inset_1px_0_0_rgba(255,255,255,0.5)]">
          <button className="flex items-center gap-2 py-1.5 px-1 hover:bg-[#2051b8] hover:text-white rounded-[3px] text-left text-[11px] font-bold text-[#0036b1] group">
             <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png" className="w-[18px] h-[18px]" style={{ imageRendering: 'pixelated' }} alt="Map" />
             <span>My Region</span>
          </button>
          <button className="flex items-center gap-2 py-1.5 px-1 hover:bg-[#2051b8] hover:text-white rounded-[3px] text-left text-[11px] font-bold text-[#0036b1] group">
             <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/coin-case.png" className="w-[18px] h-[18px]" style={{ imageRendering: 'pixelated' }} alt="Bag" />
             <span>My Items</span>
          </button>
          
          <div className="my-1 border-t border-[#a6cbf0]" />

          <button className="flex items-center gap-2 py-1.5 px-1 hover:bg-[#2051b8] hover:text-white rounded-[3px] text-left text-[11px] text-[#0036b1] group">
             <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-share.png" className="w-[18px] h-[18px]" style={{ imageRendering: 'pixelated' }} alt="Settings" />
             <span>Control Panel</span>
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <div className="h-[42px] bg-gradient-to-r from-[#0036b1] to-[#015add] flex items-center justify-end px-4 gap-4 shadow-inner">
         <button className="flex items-center gap-1.5 text-white text-[11px] hover:text-[#d3e5fa] active:scale-95 transition-transform" onClick={onShutdown}>
           <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/escape-rope.png" className="w-[22px] h-[22px]" style={{ imageRendering: 'pixelated' }} alt="Log Off" />
           Log Off
         </button>
         <button className="flex items-center gap-1.5 text-white text-[11px] hover:text-[#d3e5fa] active:scale-95 transition-transform" onClick={onShutdown}>
           <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png" className="w-[20px] h-[20px]" style={{ imageRendering: 'pixelated' }} alt="Turn Off" />
           Turn Off
         </button>
      </div>
    </div>
  );
}
