import React, { useState, useEffect } from 'react';
import { Window } from './components/poke-xp/Window';
import { Taskbar } from './components/poke-xp/Taskbar';
import { StartMenu } from './components/poke-xp/StartMenu';
import { DesktopIcon } from './components/poke-xp/DesktopIcon';
import { PokedexApp } from './components/poke-xp/apps/Pokedex';
import { PaintApp } from './components/poke-xp/apps/Paint';
import { PCBoxApp } from './components/poke-xp/apps/PCBox';
import { ClockApp } from './components/poke-xp/apps/Clock';
import { AppWindow } from './types';
import { useXPSounds } from './hooks/useXPSounds';

export default function App() {
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [highestZIndex, setHighestZIndex] = useState(10);
  const [hasEntered, setHasEntered] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showEnter, setShowEnter] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  const { playShutdown } = useXPSounds(hasEntered && !isShuttingDown);

  const handleShutdown = async () => {
    setIsStartMenuOpen(false);
    setIsShuttingDown(true);
    await playShutdown();
    window.location.reload();
  };

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setShowEnter(true);
      }
      setLoadingProgress(progress);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleOpenApp = (appPartial: Partial<AppWindow>) => {
    const existingWindow = windows.find(w => w.id === appPartial.id);
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);

    if (existingWindow) {
      if (existingWindow.state === 'minimized') {
        setWindows(windows.map(w => w.id === appPartial.id ? { ...w, state: 'open', zIndex: newZIndex } : w));
      } else {
        setWindows(windows.map(w => w.id === appPartial.id ? { ...w, zIndex: newZIndex } : w));
      }
      setFocusedWindowId(appPartial.id);
    } else {
      const newWindow: AppWindow = {
        id: appPartial.id!,
        title: appPartial.title || 'App',
        icon: appPartial.icon || '',
        component: appPartial.component || 'Unknown',
        state: 'open',
        zIndex: newZIndex,
        width: appPartial.width || 600,
        height: appPartial.height || 400,
      };
      setWindows([...windows, newWindow]);
      setFocusedWindowId(appPartial.id!);
    }
  };

  const handleCloseWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    if (focusedWindowId === id) setFocusedWindowId(null);
  };

  const handleMinimizeWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, state: 'minimized' } : w));
    if (focusedWindowId === id) setFocusedWindowId(null);
  };

  const handleFocusWindow = (id: string) => {
    const existingWindow = windows.find(w => w.id === id);
    if (existingWindow && existingWindow.state === 'minimized') {
      handleOpenApp(existingWindow);
      return;
    }
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: newZIndex } : w));
    setFocusedWindowId(id);
  };

  const renderAppComponent = (component: string) => {
    switch (component) {
      case 'Pokedex': return <PokedexApp />;
      case 'PCBox': return <PCBoxApp />;
      case 'Paint': return <PaintApp />;
      case 'Clock': return <ClockApp />;
      default: return <div className="p-4">Unknown Application</div>;
    }
  };

  if (!hasEntered) {
    return (
      <div 
        className="w-full h-screen relative flex flex-col items-center justify-center bg-[#0996f1] select-none"
      >
        <img 
          src="https://raw.githubusercontent.com/heil-kaizen/PokeOS/main/assets/Pokemon%20GIF/dance.gif" 
          alt="Dancing Pokemon" 
          className="w-48 h-48 mb-8 object-contain" 
          style={{ imageRendering: 'pixelated' }} 
        />
        
        <div className="w-64 h-6 border-2 border-white rounded-none p-1 bg-black/50 mb-8 relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-b from-[#3c813f] to-[#2d612f] transition-all duration-200"
            style={{ width: `${loadingProgress}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-mono font-bold drop-shadow-md z-10">
             {loadingProgress < 100 ? `LOADING... ${loadingProgress}%` : 'READY'}
          </div>
        </div>

        {showEnter && (
           <button 
             onClick={() => setHasEntered(true)}
             className="px-6 py-2 bg-[#0058e6] border-[2px] border-white text-white font-bold font-sans text-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-transform uppercase rounded-none"
             style={{ imageRendering: 'pixelated', boxShadow: '4px 4px 0px rgba(0,0,0,1)' }}
           >
             Enter O.S.
           </button>
        )}
      </div>
    );
  }

  if (isShuttingDown) {
    return (
      <div className="w-full h-screen relative flex flex-col items-center justify-center bg-[#0036b1] select-none text-white overflow-hidden">
        <h1 className="text-4xl font-sans italic tracking-wider mb-8 drop-shadow-md">PokeOS is shutting down...</h1>
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png" 
          alt="Shutting down" 
          className="w-16 h-16 animate-pulse" 
          style={{ imageRendering: 'pixelated' }} 
        />
      </div>
    );
  }

  return (
    <div 
      className="w-full h-screen relative overflow-hidden bg-[#225091] select-none" 
      onClick={() => {
         setFocusedWindowId(null);
         setIsStartMenuOpen(false);
      }}
      style={{
        backgroundImage: `url('https://raw.githubusercontent.com/heil-kaizen/PokeOS/main/assets/pokemon-wallepaper.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-4">
        <DesktopIcon 
          icon="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
          title="Pokédex" 
          onDoubleClick={() => handleOpenApp({ id: 'pokedex', title: 'Pokédex', component: 'Pokedex', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', width: 650, height: 450 })} 
        />
        <DesktopIcon 
          icon="https://raw.githubusercontent.com/heil-kaizen/PokeOS/main/assets/The-PC.webp" 
          title="Ash's PC" 
          onDoubleClick={() => handleOpenApp({ id: 'pc', title: 'Ash\'s PC', component: 'PCBox', icon: 'https://raw.githubusercontent.com/heil-kaizen/PokeOS/main/assets/The-PC.webp' })} 
        />
        <DesktopIcon 
          icon="https://raw.githubusercontent.com/heil-kaizen/PokeOS/main/assets/paint.webp" 
          title="Paint" 
          onDoubleClick={() => handleOpenApp({ id: 'paint', title: 'Paint', component: 'Paint', icon: 'https://raw.githubusercontent.com/heil-kaizen/PokeOS/main/assets/paint.webp' })} 
        />
      </div>

      {/* Widget Layer */}
      <div className="absolute top-12 right-12 z-0 pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
        <div className="pointer-events-auto rounded-full">
          <ClockApp />
        </div>
      </div>

      {/* Desktop GIFs Layer */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex items-end justify-center gap-8 z-0 pointer-events-none">
        <img 
          src="https://raw.githubusercontent.com/heil-kaizen/PokeOS/main/funny.gif" 
          alt="Walking Pokemon" 
          className="h-16 object-contain pointer-events-auto hover:scale-110 transition-transform" 
          style={{ imageRendering: 'pixelated', filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.3))' }}
        />
        <img 
          src="https://raw.githubusercontent.com/heil-kaizen/PokeOS/main/assets/Pokemon%20GIF/darumaka.gif" 
          alt="Darumaka" 
          className="h-12 object-contain pointer-events-auto hover:scale-110 transition-transform" 
          style={{ imageRendering: 'pixelated', filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.3))' }}
        />
      </div>

      {/* Render Windows */}
      {windows.map(win => (
        <div 
          key={win.id} 
          onClick={(e) => e.stopPropagation()}
          className={win.state === 'minimized' ? 'hidden' : ''}
        >
          <Window
            id={win.id}
            title={win.title}
            icon={win.icon}
            isActive={focusedWindowId === win.id}
            zIndex={win.zIndex}
            width={win.width}
            height={win.height}
            onClose={handleCloseWindow}
            onMinimize={handleMinimizeWindow}
            onFocus={handleFocusWindow}
          >
            {renderAppComponent(win.component)}
          </Window>
        </div>
      ))}

      {/* Taskbar & Start Menu */}
      <div onClick={(e) => e.stopPropagation()}>
        <StartMenu 
          isOpen={isStartMenuOpen} 
          onClose={() => setIsStartMenuOpen(false)} 
          onAppClick={handleOpenApp} 
          onShutdown={handleShutdown}
        />
        <Taskbar 
          windows={windows} 
          focusedWindowId={focusedWindowId} 
          onWindowClick={handleFocusWindow} 
          onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)} 
          isStartMenuOpen={isStartMenuOpen}
        />
      </div>
    </div>
  );
}
