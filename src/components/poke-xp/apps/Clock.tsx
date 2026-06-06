import React, { useState, useEffect } from 'react';

export const ClockApp: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 50);
    return () => clearInterval(timer);
  }, []);

  const milliseconds = time.getMilliseconds();
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Smooth movement for all hands
  const secondDegrees = ((seconds + milliseconds / 1000) / 60) * 360 + 90;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360 + 90;
  const hourDegrees = ((hours + minutes / 60) / 12) * 360 + 90;

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayName = dayNames[time.getDay()];
  const dateNum = time.getDate();

  return (
    <div className="relative w-[150px] h-[150px] rounded-full bg-white shadow-[0_8px_16px_rgba(0,0,0,0.5)] flex items-center justify-center select-none transform transition-transform hover:scale-105">
      
      {/* Tick marks and numbers */}
        {[...Array(60)].map((_, i) => {
          const isFive = i % 5 === 0;
          return (
            <div
              key={i}
              className={`absolute top-0 bottom-0 left-1/2 w-0 flex justify-center`}
              style={{ transform: `rotate(${i * 6}deg)` }}
            >
              <div 
                className={`absolute top-1 ${isFive ? 'w-[2px] h-[4px] bg-[#a0a5ab]' : 'w-[1px] h-[2px] bg-[#ced1d6]'}`}
              />
              {isFive && (
                <div 
                  className="absolute text-[#8b9198] font-bold text-[8px] font-sans"
                  style={{ 
                    top: '6px',
                    transform: `rotate(${-i * 6}deg)` 
                  }}
                >
                  {i === 0 ? '60' : i.toString().padStart(2, '0')}
                </div>
              )}
            </div>
          );
        })}

        {/* Berry icon (Top Left) */}
        <div className="absolute top-[22%] left-[18%] w-[24px] h-[24px] rounded-full border-[1px] border-[#a0a5ab] flex items-center justify-center bg-white shadow-sm z-10">
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png" 
            alt="Oran Berry" 
            className="w-[18px] h-[18px]" 
            style={{ imageRendering: 'pixelated' }}
            draggable="false"
          />
        </div>

        {/* Snorlax Center Image */}
        <img 
          src="https://raw.githubusercontent.com/heil-kaizen/PokeOS/main/snorlax-sleeping.gif" 
          alt="Snorlax" 
          className="w-[90px] h-[90px] object-contain opacity-95 relative z-0 mt-2" 
          style={{ imageRendering: 'pixelated' }}
          draggable="false"
        />

        {/* Date Display */}
        <div className="absolute bottom-[20%] flex border-[1px] border-[#c0c5cb] text-[#6d747d] bg-[#f0ebd9] z-0 font-mono text-[8px] leading-none font-bold rounded-[2px] shadow-sm">
          <div className="px-1 py-0.5 border-r-[1px] border-[#c0c5cb] tracking-wider">{dayName}</div>
          <div className="px-1 py-0.5 tracking-wider">{dateNum.toString().padStart(2, '0')}</div>
        </div>

        {/* Hands */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Hour Hand */}
          <div 
            className="absolute top-1/2 right-1/2 h-[3px] w-[26%] bg-[#48534e] rounded-l-full shadow-md"
            style={{ 
              transformOrigin: '100% 50%', 
              transform: `translateY(-50%) rotate(${hourDegrees}deg)` 
            }}
          />
          {/* Minute Hand */}
          <div 
            className="absolute top-1/2 right-1/2 h-[2px] w-[36%] bg-[#48534e] rounded-l-full shadow-md"
            style={{ 
              transformOrigin: '100% 50%', 
              transform: `translateY(-50%) rotate(${minuteDegrees}deg)` 
            }}
          />
          {/* Second Hand */}
          <div 
            className="absolute top-1/2 right-1/2 h-[1px] w-[42%] bg-[#48534e] shadow-md"
            style={{ 
              transformOrigin: '100% 50%', 
              transform: `translateY(-50%) rotate(${secondDegrees}deg)` 
            }}
          >
            {/* Second hand tail */}
            <div className="absolute top-1/2 -right-[15%] w-[15%] h-[1px] bg-[#48534e] transform -translate-y-1/2" />
          </div>
          
          {/* Center Pin */}
          <div className="absolute top-1/2 left-1/2 w-[6px] h-[6px] bg-[#48534e] rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md border-[1px] border-[#6b7570]" />
        </div>
    </div>
  );
};
