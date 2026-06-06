import { useEffect, useRef } from 'react';

const STARTUP_SOUND = 'https://archive.org/download/winsound/Windows%20XP%20Startup.wav';
const SHUTDOWN_SOUND = 'https://archive.org/download/winsound/Windows%20XP%20Shutdown.wav';

export const useXPSounds = (hasEntered: boolean) => {
  const startupPlayed = useRef(false);

  useEffect(() => {
    if (hasEntered && !startupPlayed.current) {
      const audio = new Audio(STARTUP_SOUND);
      audio.volume = 1;
      audio.play().catch(e => console.log('Startup sound play failed:', e));
      startupPlayed.current = true;
    }
  }, [hasEntered]);

  const playShutdown = (): Promise<void> => {
    return new Promise((resolve) => {
      const audio = new Audio(SHUTDOWN_SOUND);
      audio.volume = 1;
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(e => {
        console.log('Shutdown sound play failed:', e);
        resolve();
      });
      // Safety timeout in case audio never finishes loading
      setTimeout(resolve, 3000);
    });
  };

  return { playShutdown };
};
