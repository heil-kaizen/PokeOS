import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, ArrowRight, ArrowUp, Search, Monitor, HardDrive } from 'lucide-react';

export const PCBoxApp = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const pcItems = [
    { id: 1, name: 'Local Disk (C:)', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', type: 'drive' },
    { id: 2, name: 'Box 1', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png', type: 'folder' },
    { id: 3, name: 'Box 2', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png', type: 'folder' },
    { id: 4, name: 'Hall of Fame', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-share.png', type: 'file' },
    { id: 5, name: 'Mom\'s Bank Account', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/coin-case.png', type: 'file' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-sans">
      {/* Menu Bar */}
      <div className="flex px-2 py-1 text-xs gap-3 border-b border-[#ece9d8] bg-[#ece9d8]">
        <span className="cursor-pointer hover:bg-black/10 px-1 rounded">File</span>
        <span className="cursor-pointer hover:bg-black/10 px-1 rounded">Edit</span>
        <span className="cursor-pointer hover:bg-black/10 px-1 rounded">View</span>
        <span className="cursor-pointer hover:bg-black/10 px-1 rounded">Favorites</span>
        <span className="cursor-pointer hover:bg-black/10 px-1 rounded">Tools</span>
        <span className="cursor-pointer hover:bg-black/10 px-1 rounded">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-1 py-1 border-y border-[#716f64] bg-[#ece9d8] shadow-[0_1px_0_white_inset]">
         <div className="flex items-center gap-0.5 border-r border-black/30 pr-1">
           <button className="p-1 text-gray-500 hover:text-black hover:border-black/20 border border-transparent rounded flex items-center gap-1">
             <span className="w-6 h-6 rounded-full bg-[#1b439c] flex items-center justify-center text-white"><ArrowLeft size={16} /></span>
             <span className="text-xs">Back</span>
           </button>
           <button className="p-1 text-gray-400 border border-transparent rounded flex items-center">
             <span className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white"><ArrowRight size={16} /></span>
           </button>
         </div>

         <button className="p-1 border border-transparent hover:border-black/20 rounded mx-1">
           <Search size={18} className="text-[#1b439c]" />
         </button>
         
         <div className="flex items-center pl-1 border-l border-white h-6">
           <button className="flex items-center gap-1 px-2 py-1 border border-transparent hover:border-black/20 rounded text-xs">
             <Monitor size={16} className="text-[#2051b8] fill-[#2051b8]/20" />
             Folders
           </button>
         </div>
      </div>

      {/* Address Bar */}
      <div className="flex items-center px-2 py-1 border-b border-[#716f64] bg-[#ece9d8] gap-2">
         <span className="text-xs text-gray-600">Address</span>
         <div className="flex-1 bg-white border border-[#716f64] shadow-inner py-0.5 px-1 flex items-center text-xs">
           <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pc.png" className="w-4 h-4 mr-1 pixelated" style={{ imageRendering: 'pixelated' }} alt="PC" />
           My Computer
         </div>
         <button className="flex items-center gap-1 px-2 py-0.5 border border-transparent hover:bg-black/10 rounded text-xs">
           <span className="bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center"><ArrowRight size={12} /></span> Go
         </button>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-[200px] bg-gradient-to-b from-[#6e90e2] to-[#2b51b8] border-r border-[#716f64] overflow-y-auto p-3 flex flex-col gap-3">
          {/* Card 1 */}
          <div className="bg-white rounded-t-[3px] rounded-b-[3px] overflow-hidden flex flex-col shadow-md">
            <div className="bg-gradient-to-r from-white to-[#cce0fc] text-[#0036b1] text-[11px] font-bold p-1 pl-2 border-b border-[#0036b1]">
              System Tasks
            </div>
            <div className="p-2 flex flex-col gap-1 bg-[#d3e5fa]">
              <button className="flex items-center gap-1.5 text-[#0036b1] hover:underline text-[11px] text-left">
                <span className="w-4 flex items-center justify-center"><Search size={12} /></span>
                View system information
              </button>
              <button className="flex items-center gap-1.5 text-[#0036b1] hover:underline text-[11px] text-left">
                <span className="w-4 flex items-center justify-center"><HardDrive size={12} /></span>
                Add or remove programs
              </button>
              <button className="flex items-center gap-1.5 text-[#0036b1] hover:underline text-[11px] text-left">
                <span className="w-4 flex items-center justify-center"><Monitor size={12} /></span>
                Change a setting
              </button>
            </div>
          </div>

           {/* Card Details */}
           {selected !== null && (
             <div className="bg-white rounded-t-[3px] rounded-b-[3px] overflow-hidden flex flex-col shadow-md">
               <div className="bg-gradient-to-r from-white to-[#cce0fc] text-[#0036b1] text-[11px] font-bold p-1 pl-2 border-b border-[#0036b1]">
                 Details
               </div>
               <div className="p-3 bg-[#d3e5fa] text-xs flex flex-col gap-1 items-start">
                  <img src={pcItems.find(i => i.id === selected)?.icon} className="w-8 h-8 self-center pixelated drop-shadow mb-2" style={{ imageRendering: 'pixelated' }} alt="" />
                  <span className="font-bold">{pcItems.find(i => i.id === selected)?.name}</span>
                  <span className="text-gray-600">{pcItems.find(i => i.id === selected)?.type.toUpperCase()} File</span>
               </div>
             </div>
           )}
        </div>

        {/* Right Panel Explorer Items */}
        <div className="flex-1 bg-white overflow-y-auto p-4 flex content-start flex-wrap gap-2">
           {pcItems.map(item => (
             <div 
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={`flex flex-col items-center justify-start p-2 w-[80px] h-[80px] border border-transparent rounded cursor-pointer group ${selected === item.id ? 'bg-[#316ac5] text-white' : 'hover:bg-[#316ac5]/10 text-black'}`}
             >
                <img 
                  src={item.icon} 
                  className={`w-8 h-8 object-contain mb-1 transition-transform group-hover:scale-105 pixelated ${selected === item.id ? 'mix-blend-luminosity brightness-200' : ''}`}
                  style={{ imageRendering: 'pixelated' }} 
                  alt="" 
                />
                <span className="text-[11px] leading-tight text-center break-words w-full px-1">
                  {item.name}
                </span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
